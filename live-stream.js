const getVideoInfo = require('./src/getVideoInfo');
const createLiveStream = require('./src/createLiveStream');
const updateLiveStream = require('./src/updateLiveStream');

const { exec } = require('shelljs');

getVideoInfo('https://www.youtube.com/watch?v=WiwfiVdfRIc&t=342s')
  .then(async ({ title, channelName, content, formats }) => {
    let format = formats.filter(({ hasVideo, hasAudio }) => hasVideo && hasAudio)[0];
    if (!format) throw "no video source is available.";
    let { id, stream_url } = await createLiveStream({
      title: `${title} - ${channelName}`,
      description: content,
    });
    let { video_id } = await updateLiveStream(id);
    exec(`ffmpeg -re -i '${format.url}' -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -ar 44100 -f flv '${stream_url}'`);
  });