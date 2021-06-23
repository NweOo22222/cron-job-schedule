const { exec } = require("shelljs");
const { schedule } = require("node-cron");
const { searchUntilLiveOnYoutube, fetchUntilLiveFromYoutube, broadcastLiveStream } = require("../src/_helpers");
const createLiveStream = require("../src/createLiveStream");
const updateLiveStream = require("../src/updateLiveStream");

/* s  m  h d  M D */
const CRON_SCHEDULE = '55 59 5 * * *'; // at every 5:59:54 AM
const QUERY_STRING = 'ဗီြအိုေအ ျမန္မာနံနက္ခင္း';

schedule(CRON_SCHEDULE, start, { timezone: 'Asia/Rangoon' });

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
            if (is_live) {
                console.error(err);
                process.exit(1);
            }
            Yt1s
                .getVideoInfo(input)
                .then(async ({ q, vid, title, t, a, links, status }) => {
                    if (status !== 'ok') throw new Error('Failed to get Youtube video info');
                    let response = await Yt1s.generateDownloadLink(vid, links.mp4, ['22', '135', '18']);
                    if (response.status !== 'ok') throw new Error('Failed to generate download link');
                    title = `${title} - ${a}`;
                    if (title.length > 125) title = title.slice(0, 120);
                    let { id, stream_url } = await createLiveStream({
                        title,
                        description: `${title} - ${a}\n\nOriginally uploaded from ${a} on Youtube at https://www.youtube.com/watch?v=${vid}`,
                    });
                    let { video_id } = await updateLiveStream(id);
                    broadcastLiveStream(response.dlink, stream_url);
                }).catch(e => {
                    console.log('ERROR::', e.response?.headers, e.response?.data || e.message);
                    console.log(e.message);
                });
        });
}
