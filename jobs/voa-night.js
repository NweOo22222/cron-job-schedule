const { exec } = require("shelljs");
const { schedule } = require("node-cron");
const { searchUntilLiveOnYoutube, fetchUntilLiveFromYoutube, broadcastLiveStream } = require("../src/_helpers");
const createLiveStream = require("../src/createLiveStream");
const updateLiveStream = require("../src/updateLiveStream");

const CRON_SCHEDULE = '55 59 18 * * *'; //  at every 5:59:54 AM
const QUERY_STRING = 'VOA Burmese';

schedule(CRON_SCHEDULE, () => start(), { timezone: 'Asia/Rangoon' });

function start() {
    let vid, is_live;
    console.log('> querying "', QUERY_STRING, '" at', new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
    searchUntilLiveOnYoutube(QUERY_STRING)
        .then(videoId => {
            vid = videoId;
            return fetchUntilLiveFromYoutube(vid);
        })
        .then(async ({ title, channelName, content, formats }) => {
            console.log(' >>', new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
            let format = formats.find(({ qualityLabel }) => qualityLabel === '720p') ||
                formats.find(({ qualityLabel }) => qualityLabel === '480p') ||
                formats.find(({ qualityLabel }) => qualityLabel === '360p');
            let { id, stream_url } = await createLiveStream({
                title: `${title} - ${channelName}`,
                description: content,
            });
            let { video_id } = await updateLiveStream(id);
            console.log(' >>', new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
            is_live = true;
            broadcastLiveStream(format.url, stream_url);
        })
        .catch(async (err) => {
            console.error(':throw', err);
            if (is_live) {
                process.exit(1);
            }
            console.log(':set argv.3', vid);
            console.log(' >>', new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
            exec(`node '${__dirname}/../live-stream2.js' '${process.argv[2]}' '${vid}'`);
        });
}
