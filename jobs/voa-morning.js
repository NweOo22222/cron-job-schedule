const stream = require("./stream");
const { schedule } = require("node-cron");

const CRON_SCHEDULE = '0 0 6 * * *'; // at every 6:00:00 AM
const QUERY_STRING = 'ဗီြအိုေအ ျမန္မာနံနက္ခင္း';

schedule(CRON_SCHEDULE, () => stream(QUERY_STRING), { timezone: 'Asia/Rangoon' });
