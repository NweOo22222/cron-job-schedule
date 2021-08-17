const input = process.argv[3];

const {
  broadcastLiveStream,
  getVideoInfo,
  createLiveStream,
  updateLiveStream,
} = require("./src/_helpers");

let liveId;

getVideoInfo(input)
  .then(async ({ title, content, formats }) => {
    if (!formats.length) throw "no video source is available.";
    let format = formats.find(
      ({ qualityLabel }) =>
        qualityLabel === "720p" ||
        qualityLabel === "480p" ||
        qualityLabel === "360p"
    );
    let { id, stream_url } = await createLiveStream({
      title,
      description: content,
    });
    liveId = id;
    await updateLiveStream(id);
    broadcastLiveStream(format.url, stream_url);
  })
  .catch((e) => {
    if (liveId) {
      console.log("[FB:DELETE] Live #%s is deleted due to failure!", liveId);
    }
    e.response && console.log(e.response?.headers, e.response?.data);
    console.log(e.message);
    process.exit(1);
  });
