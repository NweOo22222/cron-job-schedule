const Yt1s = require('./lib/Yt1s');
const createLiveStream = require('./src/createLiveStream');
const updateLiveStream = require('./src/updateLiveStream');
const { broadcastLiveStream, toUnicode } = require('./src/_helpers');

const input = process.argv[3];

Yt1s
  .getVideoInfo(input)
  .then(async ({ q, vid, title, t, a, links, status }) => {
    let response;
    if (status !== 'ok') {
      throw new Error('Failed to get Youtube video info');
    }
    try {
      response = await Yt1s.generateDownloadLink(vid, links.mp4);
      if (response.status !== 'ok') {
        throw new Error('Failed to generate download link');
      }
    } catch(e) {
      console.log(e.message);
      response = { dlink: await getDashUrl(vid) };
    }
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

function getDashUrl(id) {
    const { default: axios } = require('axios');

    return axios.get(`https://www.youtube.com/get_video_info?video_id=${id}&eurl=https%3A%2F%2Fyoutube.googleapis.com%2Fv%2Fonz2k4zoLjQ&html5=1&c=TVHTML5&cver=6.20180913`).then(({ data }) => {
        let u = new URL('http://localhost?' + data);
        let r = JSON.parse(u.searchParams.get('player_response'));
        return r.streamingData.dashManifestUrl;
    });
}
