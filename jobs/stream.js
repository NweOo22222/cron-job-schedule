module.exports = function stream(q) {
    let vid, is_live;

    const { exec } = require("shelljs");
    const { searchUntilLiveOnYoutube, fetchUntilLiveFromYoutube, broadcastLiveStream } = require("../src/_helpers");
    const createLiveStream = require("../src/createLiveStream");
    const updateLiveStream = require("../src/updateLiveStream");

    console.log('> querying "', q, '" at', new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
    searchUntilLiveOnYoutube(q)
        .then(videoId => {
            vid = videoId;
            return fetchUntilLiveFromYoutube(vid);
        })
        .then(async({ title, channelName, content, formats }) => {
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
        .catch(async(err) => {
            console.error(':throw', err);
            if (is_live) {
                process.exit(1);
            }
            console.log(':set argv.3', vid);
            console.log(' >>', new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
            exec(`node '${__dirname}/../live-stream2.js' '${process.argv[2]}' '${vid}'`);
        });
}