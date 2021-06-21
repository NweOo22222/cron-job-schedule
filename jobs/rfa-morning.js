const { schedule } = require("node-cron");
const { searchUntilLiveOnYoutube, fetchUntilLiveFromYoutube, broadcastLiveStream } = require("../src/_helpers");
const createLiveStream = require("../src/createLiveStream");
const updateLiveStream = require("../src/updateLiveStream");
const deleteLiveStream = require("../src/deleteLiveStream");
                    /* s  m  h d  M D */
const CRON_SCHEDULE = '50 59 6 *  * *'; // at every 6:59:50 AM
const QUERY_STRING = 'RFA နေ့စဉ်တိုက်ရိုက်ထုတ်လွှင့်ချက်';

schedule(CRON_SCHEDULE, () => start(), { timezone: 'Asia/Rangoon' });

function start() {
    console.log('> querying "', QUERY_STRING, '" at', new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
    
    searchUntilLiveOnYoutube(QUERY_STRING)
        .then(videoId => fetchUntilLiveFromYoutube(videoId))
        .then(async ({ title, channelName, content, formats }) => {
            let format = formats.find(({ qualityLabel }) => qualityLabel === '720p' || qualityLabel === '480p');
            let { id, stream_url } = await createLiveStream({
                title: `${title} - ${channelName}`,
                description: content,
            });
            let { video_id } = await updateLiveStream(id);
        
            setTimeout(() => console.log('EXIT') | process.exit(0), 3800 * 1000);
        
            return broadcastLiveStream(format.url, stream_url);
        });
}

