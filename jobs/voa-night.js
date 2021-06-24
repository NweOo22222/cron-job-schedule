const stream = require('./stream');
const { schedule } = require("node-cron");

const CRON_SCHEDULE = '55 59 18 * * *'; //  at every 6:59:55 PM
const QUERY_STRING = 'VOA Burmese';

schedule(CRON_SCHEDULE, () => stream(QUERY_STRING), { timezone: 'Asia/Rangoon' });
