const {
  TTADATTENDANCE,
  Sequelize,
  TTADATTENDANCETEMP,
  EmployeeView,
  TTADATTSTATUSDETAIL,
  TTADOVTREQUESTDETAIL,
  TTADOVERTIMEFACTOR,
  TTADATTOVTDETAIL,
  TTADATTOVTINDEX,
  TTADATTOVTOTHER,
} = require("../models");
const cron = require("node-cron");
const { Op, where, TimeoutError } = require("sequelize");
const moment = require("moment");

// Database connection instance
const sequelize = require("../config/database");

const updateShift = async () => {
  try {
    moment.locale("id");

    // const firstDay = moment()
    //   .startOf("month")
    //   .format("YYYY-MM-DD HH:mm:ss.SSS");
    // const lastDay = moment()
    //   .subtract(1, "days")
    //   .format("YYYY-MM-DD HH:mm:ss.SSS");

    const firstDay = "2025-05-01 00:00:00.000";

    const lastDay = "2025-05-27 23:59:59.000";

    console.log(
      `Fetching attendance records from ${firstDay} to ${lastDay}...`
    );

    // Set transaction isolation level to prevent deadlocks
    await sequelize.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");

    let offset = 0;
    const batchSize = 50; // Process 100 records at a time

    while (true) {
      console.log(`Fetching batch: ${offset} - ${offset + batchSize}`);

      const getDataAbsen = await TTADATTENDANCE.findAll({
        where: {
          shiftdaily_code: { [Op.like]: "%S3%" },
          attend_code: {
            [Op.and]: [
              { [Op.notLike]: "Z1%" },
              { [Op.notLike]: "ANL%" },
              { [Op.notLike]: "LL%" },
            ],
          },
          shiftstarttime: { [Op.between]: [firstDay, lastDay] },
          company_id: "18929",
          [Op.or]: [
            { remark: null },
            { remark: { [Op.notLike]: "Leave Request%" } },
          ],
          // actual_in: { [Op.lt]: 0 },
          [Op.and]: [
            sequelize.where(
              sequelize.fn(
                "CONVERT",
                sequelize.literal("VARCHAR"),
                sequelize.col("shiftstarttime"),
                sequelize.literal("108")
              ),
              "00:30:00"
            ),
          ],
        },
        limit: batchSize,
        offset: offset,
        order: [["shiftstarttime", "ASC"]],
        lock: false,
      });

      if (getDataAbsen.length === 0) {
        console.log("No more attendance records found. Exiting batch loop.");
        break;
      }

      // Process records sequentially to avoid deadlocks
      for (const absen of getDataAbsen) {
        await processRecord(absen);
      }

      offset += batchSize;
    }

    console.log("✅ Attendance processing completed.");
  } catch (error) {
    console.error("❌ [Scheduler] Error retrieving attendance data:", error);
  }
};

const processRecord = async (absen) => {
  try {
    console.log(`Processing emp_id: ${absen.emp_id}...`);

    const getDataEmployee = await EmployeeView.findOne({
      where: { emp_id: absen.emp_id },
    });

    console.log(absen.shiftstarttime);

    if (!getDataEmployee) {
      console.warn(`⚠ No Employee found for emp_id: ${absen.emp_id}`);
      return;
    }

    const shiftStartUTC = moment.utc(absen.shiftstarttime).add(1, "day");
    const shiftEndUTC = moment.utc(absen.shiftendtime).add(1, "day");

    const attendDateRealStart = shiftStartUTC.clone().subtract(6, "hours");
    const attendDateRealEnd = shiftStartUTC.clone().add(4, "hours");
    const leaveDateRealStart = shiftEndUTC.clone().subtract(4, "hours");
    const leaveDateRealEnd = shiftEndUTC.clone().add(8, "hours");

    let checkLti = 0;
    let checkEao = 0;

    // Fetch both IN and OUT attendance records
    let otTotal = 0;

    const [getIn, getOut] = await Promise.all([
      TTADATTENDANCETEMP.findOne({
        where: {
          attend_date: {
            [Op.between]: [
              attendDateRealStart.format("YYYY-MM-DD HH:mm:ss"),
              attendDateRealEnd.format("YYYY-MM-DD HH:mm:ss"),
            ],
          },
          attendanceid: getDataEmployee.emp_no,
          company_id: "18929",
          status: "1",
        },
        order: [["attend_date", "ASC"]],
      }),
      TTADATTENDANCETEMP.findOne({
        where: {
          attend_date: {
            [Op.between]: [
              leaveDateRealStart.format("YYYY-MM-DD HH:mm:ss"),
              leaveDateRealEnd.format("YYYY-MM-DD HH:mm:ss"),
            ],
          },
          attendanceid: getDataEmployee.emp_no,
          company_id: "18929",
          status: "0",
        },
        order: [["attend_date", "DESC"]],
      }),
    ]);

    let diffIn = 0;
    let diffOut = 0;
    let arrivalTime;
    let timeOvt = 0;
    let getInOff;
    let getOutOff;

    let getEarlyOvt = await TTADATTOVTDETAIL.findOne({
      where: {
        attend_id: absen.attend_id,
        ot_date: moment
          .utc(absen.shiftstarttime)
          .format("YYYY-MM-DD 00:00:00.000"),
      },
    });

    let startOvt;
    let endOvt;
    let absStats = 0;
    if (getIn) {
      arrivalTime = moment.utc(getIn.attend_date);
      let ovtTimeFrom;
      if (getEarlyOvt) {
        ovtTimeFrom = moment.utc(getEarlyOvt.ot_starttime);
        console.log(absen.daytype, arrivalTime, ovtTimeFrom, "MSMDMSM");
        if (absen.daytype === "OFF" || absen.daytype == "PHOFF") {
          if (arrivalTime > ovtTimeFrom) {
            getInOff = arrivalTime;
          } else {
            getInOff = ovtTimeFrom;
          }
        }
      }
      if (arrivalTime.isBefore(shiftStartUTC)) {
        diffIn = shiftStartUTC.diff(arrivalTime, "minutes");
        if (getEarlyOvt) {
          if (ovtTimeFrom > arrivalTime) {
            if (ovtTimeFrom < shiftStartUTC) {
              timeOvt += shiftStartUTC.diff(ovtTimeFrom, "minutes");
              startOvt = ovtTimeFrom;
              endOvt = shiftStartUTC;
            }
          } else {
            if (arrivalTime < shiftStartUTC) {
              timeOvt += shiftStartUTC.diff(arrivalTime, "minutes");
              startOvt = arrivalTime;
              endOvt = shiftStartUTC;
            }
          }
        }
      } else {
        diffIn = -arrivalTime.diff(shiftStartUTC, "minutes");
        checkLti = diffIn;
      }

      console.log(
        `🕒 Check-in difference for emp_id ${absen.emp_id}: ${diffIn} minutes`
      );

      // Use a transaction to update safely
      await sequelize.transaction(async (t) => {
        await TTADATTENDANCE.update(
          {
            starttime: arrivalTime.format("YYYY-MM-DD HH:mm:ss"),
            actual_in: diffIn,
            ip_starttime: "10.14.55.218",
            total_ot: "0",
            total_otindex: "0",
            modified_by: "SchedulerSLintas",
            modified_date: moment().format("YYYY-MM-DD HH:mm:ss"),
            actual_lti: checkLti,
            attend_code: "PRS",
          },
          { where: { attend_id: absen.attend_id }, transaction: t }
        );
      });

      await TTADATTSTATUSDETAIL.destroy({
        where: { attend_id: absen.attend_id },
      });

      let statusList = ["PRS"];
      if (diffIn > 0) {
        if (absen.daytype !== "OFF") {
          statusList.push("EAI");
        }
        statusList.push("TRANS3");
        statusList.push("SHFALLOW3");
        statusList.push("MEAL3");
      } else if (diffIn < 0) {
        if (absen.daytype != "OFF") {
          statusList.push("LTI");
        }
        statusList.push("TRANS3");
        statusList.push("SHFALLOW3");
        statusList.push("MEAL3");
      } else {
        statusList.push("TRANS3");
        statusList.push("SHFALLOW3");
        statusList.push("MEAL3");
      }
      for (const status of statusList) {
        let statusDetail = {
          attend_id: absen.attend_id,
          emp_id: absen.emp_id,
          attend_date: arrivalTime.format("YYYY-MM-DD HH:mm:ss"),
          company_id: "18929",
          attend_code: status,
          remark: "",
          created_by: "SchedulerS3L",
          created_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          modified_by: "SchedulerS3L",
          modified_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        await TTADATTSTATUSDETAIL.create(statusDetail);
      }
    } else {
      absStats += 1;
      diffIn = 0;
      console.log(`❌ No check-in record found for emp_id ${absen.emp_id}.`);
    }
    let leaveTime;
    let ovtTimeTo;
    if (getOut) {
      leaveTime = moment.utc(getOut.attend_date);
      if (getEarlyOvt) {
        ovtTimeTo = moment.utc(getEarlyOvt.ot_endtime);
        if (absen.daytype == "OFF" || absen.daytype == "PHOFF") {
          console.log(leaveTime, ovtTimeTo);
          if (leaveTime > ovtTimeTo) {
            getOutOff = ovtTimeTo;
          } else {
            getOutOff = leaveTime;
          }
        }
      }
      if (leaveTime.isBefore(shiftEndUTC)) {
        diffOut = shiftEndUTC.diff(leaveTime, "minutes");
        checkEao = diffOut;
      } else {
        diffOut = leaveTime.diff(shiftEndUTC, "minutes");
        if (getEarlyOvt) {
          if (ovtTimeTo > leaveTime) {
            if (leaveTime > shiftEndUTC) {
              timeOvt += leaveTime.diff(shiftEndUTC, "minutes");
              startOvt = shiftEndUTC;
              endOvt = leaveTime;
            }
          } else {
            if (ovtTimeTo > shiftEndUTC) {
              timeOvt += ovtTimeTo.diff(shiftEndUTC, "minutes");
              startOvt = shiftEndUTC;
              endOvt = ovtTimeTo;
            }
          }
        }
      }

      if (
        getInOff &&
        getOutOff &&
        (absen.daytype == "OFF" || absen.daytype == "PHOFF")
      ) {
        timeOvt = getOutOff.diff(getInOff, "minutes");
      }

      let otIndex = 0;
      if (timeOvt > 0) {
        let getTul = await TTADOVERTIMEFACTOR.findAll({
          where: { overtime_code: absen.overtime_code },
          order: [["factor_no", "ASC"]], // Ensure correct step order
        });

        if (getTul.length > 0) {
          let hours;
          if (
            absen.shiftdaily_code == "S3OFF" ||
            absen.shiftdaily_code == "S3OFFCONTRACT"
          ) {
            console.log("MASUK SINI YA MAS");
            hours = ((timeOvt - 30) / 60).toFixed(2);
            timeOvt = timeOvt - 30;
          } else {
            hours = (timeOvt / 60).toFixed(2);
          }
          let index = 0;

          while (hours > 0) {
            let tul = getTul[index];
            let step = 0;

            if (hours >= 1) {
              console.log(
                otIndex,
                tul.value,
                absen.attend_id,
                hours,
                "START OT INDEX"
              );
              otIndex += tul.value;
              console.log(otIndex);
              if (tul.step == 1) {
                let attIndex = {
                  attend_id: absen.attend_id,
                  ot_date: moment
                    .utc(getEarlyOvt.ot_date)
                    .format("YYYY-MM-DD HH:mm:ss"),
                  otindex_code: "OT15",
                  otindex_factor: "1.5",
                  otindex_value: "1",
                  created_by: "SchedulerSLintas",
                  created_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                };

                let checkIndex = await TTADATTOVTINDEX.findOne({
                  where: { attend_id: absen.attend_id, otindex_code: "OT15" },
                });
                if (!checkIndex) {
                  await TTADATTOVTINDEX.create(attIndex);
                }
              }
              hours -= 1;
              tul.step -= 1;
              if (tul.factor_no == 2) {
                step += 1;
              }
              if (tul.step == 0) {
                index++; // Move to the next step in the overtime table
              }
            } else if (hours >= 0.27) {
              if (hours > 0.52) {
                console.log(
                  tul.value * 1,
                  "ini log 1 - full hour karena > 31 menit"
                );
                otIndex += tul.value * 1;
                step += 1;
              } else {
                console.log(
                  tul.value * 0.5,
                  "ini log 1 - half hour karena <= 31 menit"
                );
                otIndex += tul.value * 0.5;
                step += 0.5;
              }

              hours = 0;

              let attIndex = {
                attend_id: absen.attend_id,
                ot_date: moment
                  .utc(getEarlyOvt.ot_date)
                  .format("YYYY-MM-DD HH:mm:ss"),
                otindex_code: "OT2",
                otindex_factor: otIndex,
                otindex_value: step,
                created_by: "SchedulerSLintas",
                created_date: moment().format("YYYY-MM-DD HH:mm:ss"),
              };
              let checkIndex = await TTADATTOVTINDEX.findOne({
                where: { attend_id: absen.attend_id, otindex_code: "OT2" },
              });
              if (!checkIndex) {
                await TTADATTOVTINDEX.create(attIndex);
              }
            } else {
              hours = 0;
            }
          }
        }
      }
      console.log(
        `🕒 Check-out difference for emp_id ${absen.emp_id}: ${diffOut} minutes`
      );
      let workTime = null;
      if (arrivalTime) {
        workTime = arrivalTime.diff(leaveTime, "minutes");
      }

      // Use a transaction to update safely
      console.log(diffOut);
      await sequelize.transaction(async (t) => {
        await TTADATTENDANCE.update(
          {
            endtime: leaveTime.format("YYYY-MM-DD HH:mm:ss"),
            actual_out: diffOut,
            actual_eao: checkEao,
            ip_starttime: "10.14.55.218",
            total_ot: timeOvt,
            total_otindex: otIndex,
            modified_by: "SchedulerSLintas",
            modified_date: moment().format("YYYY-MM-DD HH:mm:ss"),
            attend_code: "PRS",
            acctualworkmnt: workTime,
          },
          { where: { attend_id: absen.attend_id }, transaction: t }
        );

        if (diffOut < 0 && absen.status != "OFF") {
          let statusDetail = {
            attend_id: absen.attend_id,
            emp_id: absen.emp_id,
            attend_date: arrivalTime.format("YYYY-MM-DD HH:mm:ss"),
            company_id: "18929",
            attend_code: "EAO",
            remark: "",
            created_by: "SchedulerS3L",
            created_date: moment().format("YYYY-MM-DD HH:mm:ss"),
            modified_by: "SchedulerS3L",
            modified_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          };

          await TTADATTSTATUSDETAIL.create(statusDetail);
        }

        if (timeOvt > 30) {
          let checkStatus = await TTADATTSTATUSDETAIL.findOne({
            where: { attend_id: absen.attend_id, attend_code: "OVT" },
          });
          if (!checkStatus) {
            let statusDetail = {
              attend_id: absen.attend_id,
              emp_id: absen.emp_id,
              attend_date: arrivalTime.format("YYYY-MM-DD HH:mm:ss"),
              company_id: "18929",
              attend_code: "OVT",
              remark: "",
              created_by: "SchedulerS3L",
              created_date: moment().format("YYYY-MM-DD HH:mm:ss"),
              modified_by: "SchedulerS3L",
              modified_date: moment().format("YYYY-MM-DD HH:mm:ss"),
            };

            await TTADATTSTATUSDETAIL.create(statusDetail);
          }
          let ovtDetailId = `OVT-${absen.emp_id}-${moment().format(
            "YYYYMMDDHHmmssSSS"
          )}`;
          let checkOvtDetail = await TTADATTOVTDETAIL.findOne({
            where: { attend_id: absen.attend_id },
          });
          if (!checkOvtDetail) {
            let ovtDetail = {
              ovtdetail_id: ovtDetailId,
              attend_id: absen.attend_id,
              ot_date: `${startOvt.format("YYYY-MM-DD")} 00:00:00.000`,
              ot_starttime: startOvt.format("YYYY-MM-DD HH:mm:ss"),
              ot_endtime: endOvt.format("YYYY-MM-DD HH:mm:ss"),
              accepted_min: timeOvt,
              created_by: "SchedulerS3L",
              created_date: moment().format("YYYY-MM-DD HH:mm:ss"),
              modified_by: "SchedulerS3L",
              modified_date: moment().format("YYYY-MM-DD HH:mm:ss"),
              remark: ``,
              auto: 0,
              before: diffIn,
              break1: 0,
              break2: 0,
              break3: 0,
              break4: 0,
              break5: 0,
              after: diffOut,
              deducted: 0,
              ovttype: "ovt",
              ovtrequest_no: getEarlyOvt.requestno,
              deductbreaktim: "",
            };
            await TTADATTOVTDETAIL.create(ovtDetail);
          } else {
            await TTADATTOVTDETAIL.update(
              {
                accepted_min: timeOvt,
                modified_by: "SchedulerS3L",
                modified_date: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              { where: { ovtdetail_id: checkOvtDetail.ovtdetail_id } }
            );
          }

          let attOther = ["OTLEMBUR", "OTLEMBUROFF", "OTMEAL", "OTTRANSPORT"];

          let checkOtherData = await TTADATTOVTOTHER.findOne({
            where: { attend_id: absen.attend_id },
          });
          if (!checkOtherData) {
            for (const list of attOther) {
              let otherData = {
                attend_id: absen.attend_id,
                ot_date: moment
                  .utc(getEarlyOvt.ot_date)
                  .format("YYYY-MM-DD HH:mm:ss"),
                type_code: list,
                value: 0,
                created_by: "SchedulerS3L",
                created_date: moment().format("YYYY-MM-DD HH:mm:ss"),
              };

              await TTADATTOVTOTHER.create(otherData);
            }
          }
        }
      });
    } else {
      absStats += 2;
      diffOut = 0;
      console.log(`❌ No check-out record found for emp_id ${absen.emp_id}.`);
    }

    if (absStats > 0) {
      if (absStats == 1) {
        let statusDetail = {
          attend_id: absen.attend_id,
          emp_id: absen.emp_id,
          attend_date: shiftStartUTC.format("YYYY-MM-DD HH:mm:ss"),
          company_id: "18929",
          attend_code: "NSI",
          remark: "",
          created_by: "SchedulerS3L",
          created_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          modified_by: "SchedulerS3L",
          modified_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        await TTADATTSTATUSDETAIL.create(statusDetail);
        await TTADATTENDANCE.update(
          {
            starttime: null,
            actual_in: null,
            ip_starttime: "10.14.55.218",
            modified_by: "SchedulerSLintas",
            modified_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
          { where: { attend_id: absen.attend_id } }
        );
      } else if (absStats == 2) {
        let statusDetail = {
          attend_id: absen.attend_id,
          emp_id: absen.emp_id,
          attend_date: shiftStartUTC.format("YYYY-MM-DD HH:mm:ss"),
          company_id: "18929",
          attend_code: "NSO",
          remark: "",
          created_by: "SchedulerS3L",
          created_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          modified_by: "SchedulerS3L",
          modified_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        await TTADATTSTATUSDETAIL.create(statusDetail);
        await TTADATTENDANCE.update(
          {
            endtime: null,
            actual_out: null,
            ip_starttime: "10.14.55.218",
            modified_by: "SchedulerSLintas",
            modified_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
          { where: { attend_id: absen.attend_id } }
        );
      } else {
        let statusDetail = {
          attend_id: absen.attend_id,
          emp_id: absen.emp_id,
          attend_date: shiftStartUTC.format("YYYY-MM-DD HH:mm:ss"),
          company_id: "18929",
          attend_code: "ABS",
          remark: "",
          created_by: "SchedulerS3L",
          created_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          modified_by: "SchedulerS3L",
          modified_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        await TTADATTSTATUSDETAIL.create(statusDetail);

        await TTADATTENDANCE.update(
          {
            starttime: null,
            endtime: null,
            ip_starttime: "10.14.55.218",
            modified_by: "SchedulerSLintas",
            modified_date: moment().format("YYYY-MM-DD HH:mm:ss"),
            attend_code: "ABS",
          },
          { where: { attend_id: absen.attend_id } }
        );
      }
    }
  } catch (error) {
    console.error(`❌ Error processing emp_id: ${absen.emp_id}`, error);
  }
};

const startScheduler = () => {
  updateShift();
  cron.schedule("0 * * * *", async () => {
    console.log("Running updateShift at midnight...");
    await updateShift();
  });
};

module.exports = { startScheduler };
