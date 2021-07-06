const stream = require('./stream');
const { schedule } = require("node-cron");

const CRON_SCHEDULE = '00 45 20 * * *'; //  at every 8:45:00 PM
const QUERY_STRING = 'BBC News မြန်မာ';

schedule(CRON_SCHEDULE, () => stream(QUERY_STRING), { timezone: 'Asia/Rangoon' });
