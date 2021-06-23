const stream = require('./stream');
const { schedule } = require("node-cron");

const CRON_SCHEDULE = '55 59 6 *  * *'; // at every 6:59:55 AM
const QUERY_STRING = 'RFA နေ့စဉ်တိုက်ရိုက်ထုတ်လွှင့်ချက်';

schedule(CRON_SCHEDULE, () => stream(QUERY_STRING), { timezone: 'Asia/Rangoon' });