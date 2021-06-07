const { exec, cat } = require('shelljs');
const createLiveStream = require("./src/createLiveStream");
const updateLiveStream = require("./src/updateLiveStream");
const { getBasicInfo } = require('ytdl-core');

const [/* node */, /* __filename */, /* env */, source_url, payload] = process.argv;

!async function () {
    let title, description;
    try {
        const data = JSON.parse(payload);
        title = data.title;
        description = `${data.title}\n\n${data.description}\n\n#NweOoBot #NweOoLive`
    } catch (e) {
        console.log('b')
        const { videoDetails } = await getBasicInfo(payload)
        title = videoDetails.title
        description = `${videoDetails.title}\n\n${videoDetails.description}\n\nOriginally uploaded from ${videoDetails.ownerChannelName} at ${videoDetails.video_url}\n\n#NweOoBot #NweOoLive`
    }
    const { id, stream_url } = await createLiveStream({ title, description })
    const { video_id } = await updateLiveStream(id)
    // console.log('watch live stream on Facebook at https://facebook.com/watch/live?v=' + video_id);
    const cmd = `ffmpeg -i '${source_url}' -c copy -f flv '${stream_url}'`
    exec(cmd)
}()