const {
  TTADATTENDANCE,
  Sequelize,
  TTADATTENDANCETEMP,
  EmployeeView,
  TTADATTSTATUSDETAIL,
} = require("../models");
const cron = require("node-cron");
const { Op, where } = require("sequelize");
const moment = require("moment");

let checkOvt = async () => {
  try {
    // let startOfMonth = moment().startOf("month").format("YYYY-MM-DD 00:00:00");
    // let endOfMonth = moment().endOf("month").format("YYYY-MM-DD 23:59:59");

    let startOfMonth = "2025-03-01 00:00:00.000";
    let endOfMonth = "2025-03-31 23:59:59.000";

    // Ambil attend_id dari TTADATTSTATUSDETAIL
    let getLti = await TTADATTSTATUSDETAIL.findAll({
      attributes: ["attend_id"],
      where: {
        attend_code: "LTI",
        attend_date: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
        company_id: "18929",
      },
      raw: true, // Mengubah hasil menjadi array objek biasa
    });

    // Ekstrak attend_id menjadi array
    let attendIds = getLti.map((item) => item.attend_id);

    // Jika tidak ada data, langsung return
    if (attendIds.length === 0) {
      console.log("No LTI records found this month.");
      return;
    }

    // Cari attend_id yang ada di TTADATTENDANCE dengan actual_in >= 0
    let getNotLTI = await TTADATTENDANCE.findAll({
      attributes: ["attend_id"],
      where: {
        attend_id: {
          [Op.in]: attendIds, // Gunakan Op.in untuk array attend_id
        },
        actual_in: {
          [Op.gte]: 0, // Perbaikan penggunaan Op.gte
        },
        company_id: "18929",
      },
      raw: true,
    });

    // Ekstrak attend_id dari getNotLTI
    let notLtiAttendIds = getNotLTI.map((item) => item.attend_id);

    // Jika ada data, hapus dari TTADATTSTATUSDETAIL
    if (notLtiAttendIds.length > 0) {
      await TTADATTSTATUSDETAIL.destroy({
        where: {
          attend_id: {
            [Op.in]: notLtiAttendIds, // Hapus attend_id yang ditemukan di TTADATTENDANCE
          },
          attend_code: "LTI",
        },
      });
      console.log(
        `Deleted ${notLtiAttendIds.length} records from TTADATTSTATUSDETAIL.`
      );
    } else {
      console.log("No records to delete.");
    }

    console.log(getNotLTI, "ini getNotLTI");
  } catch (error) {
    console.error("Error:", error);
  }
};

const startSchedulerOvt = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Running updateShift at midnight...");
    await checkOvt();
  });
};

module.exports = { startSchedulerOvt };
