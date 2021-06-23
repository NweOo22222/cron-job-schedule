const { schedule } = require("node-cron");
const stream = require("./stream");

const CRON_SCHEDULE = '55 59 18 * * *'; //  at every 5:59:55 AM
const QUERY_STRING = 'RFA နေ့စဉ်တိုက်ရိုက်ထုတ်လွှင့်ချက်';

schedule(CRON_SCHEDULE, () => stream(QUERY_STRING), { timezone: 'Asia/Rangoon' });