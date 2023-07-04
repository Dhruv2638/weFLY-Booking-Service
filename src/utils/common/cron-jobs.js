const cron = require("node-cron");

function scheduleCrons() {
  cron.schedule("", () => {});
}
module.exports = scheduleCrons;
