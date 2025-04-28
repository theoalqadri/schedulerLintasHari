const scheduler = require("./controller/schedulerAbsenSunfish");
const schedulerOvt = require("./controller/schedulerOvtSunfish");

const startSchedulers = async () => {
  try {
    console.log("Starting scheduler...");
    await scheduler.startScheduler(); // Tunggu hingga selesai

    console.log("Scheduler finished, starting schedulerOvt...");
    await schedulerOvt.startSchedulerOvt(); // Jalankan setelah yang pertama selesai
  } catch (error) {
    console.error("Error running schedulers:", error);
  }
};

startSchedulers();
