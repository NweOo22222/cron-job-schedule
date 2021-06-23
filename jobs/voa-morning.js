const stream = require("./stream");
const { schedule } = require("node-cron");

const CRON_SCHEDULE = '55 59 5 * * *'; // at every 5:59:54 AM
const QUERY_STRING = 'ဗီြအိုေအ ျမန္မာနံနက္ခင္း';

schedule(CRON_SCHEDULE, () => stream(QUERY_STRING), { timezone: 'Asia/Rangoon' });