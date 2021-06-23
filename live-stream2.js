const Yt1s = require('./lib/Yt1s');
const createLiveStream = require('./src/createLiveStream');
const updateLiveStream = require('./src/updateLiveStream');
const { broadcastLiveStream, toUnicode } = require('./src/_helpers');

const input = process.argv[3];

Yt1s
  .getVideoInfo(input)
  .then(async ({ q, vid, title, t, a, links, status }) => {
    if (status !== 'ok') throw new Error('Failed to get Youtube video info');
    let response = await Yt1s.generateDownloadLink(vid, links.mp4);
    if (response.status !== 'ok') throw new Error('Failed to generate download link');
    title = toUnicode(`${title} - ${a}`);
    if (title.length > 125) title = title.slice(0, 120);
    let { id, stream_url } = await createLiveStream({
      title,
      description: `${title}\n\nOriginally uploaded from ${a} on Youtube at https://www.youtube.com/watch?v=${vid}\n\n#NweOoBot #NweOoLive`,
    });
    let { video_id } = await updateLiveStream(id);
    broadcastLiveStream(response.dlink, stream_url);
  }).catch(e => {
    console.log('ERROR::', e.response?.headers, e.response?.data || e.message);
    console.log(e.message);
  });