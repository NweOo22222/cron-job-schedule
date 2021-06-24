const stream = require('./stream');
const { schedule } = require("node-cron");

const CRON_SCHEDULE = '55 44 20 * * *'; //  at every 8:44:55 AM
const QUERY_STRING = 'BBC မြန်မာ';

schedule(CRON_SCHEDULE, () => stream(QUERY_STRING), { timezone: 'Asia/Rangoon' });
