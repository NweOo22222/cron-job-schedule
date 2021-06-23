const { broadcastLiveStream, getVideoInfo } = require('./src/_helpers');
const createLiveStream = require('./src/createLiveStream');
const updateLiveStream = require('./src/updateLiveStream');
const getDashUrl = require('./test');

const input = process.argv[3];

getVideoInfo(input)
    .then(async ({ title, channelName, content, formats }) => {
        if (!formats.length) throw "no video source is available.";
        let format = formats.find(({ qualityLabel }) => qualityLabel === '720p' || qualityLabel === '480p' || qualityLabel === '360p');
        let { id, stream_url } = await createLiveStream({
            title: `${title} - ${channelName}`,
            description: content,
        });
        if (!format) {
            format = { url: await getDashUrl(input) }
        }
        let { video_id } = await updateLiveStream(id);
        broadcastLiveStream(format.url, stream_url);
    }).catch(e => {
        console.log(e.response?.headers, e.response?.data);
        console.log(e.message);
    });
