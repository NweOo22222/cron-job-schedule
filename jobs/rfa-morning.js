const stream = require('./stream');
const { schedule } = require("node-cron");

const CRON_SCHEDULE = '0 0 7 *  * *'; // at every 7:00:00 AM
const QUERY_STRING = 'RFA+Burmese';

schedule(CRON_SCHEDULE, () => stream(QUERY_STRING), { timezone: 'Asia/Rangoon' });
