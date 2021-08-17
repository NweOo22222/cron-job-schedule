const { default: axios } = require("axios");
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36";

/**
 *
 * @param {!string} id
 * @param {('channel'|'user')} [type='channel']
 * @returns
 */
async function getLiveVideoId(id, type = "channel") {
  const url = `https://www.youtube.com/${type}/${id}/live`;
  const option = {
    responseType: "text",
    headers: {
      "user-agent": USER_AGENT,
    },
  };
  const { data } = await axios(url, option);
  let [, script] = data.split("ytInitialPlayerResponse =");
  script = script.split("</script>");
  try {
    JSON.parse(script[0]);
  } catch (e) {
    let matched = e.message.match(/Unexpected token .+ (\d+)/);
    if (matched) {
      matched = matched[1];
      script = script[0].slice(0, parseInt(matched)).trim();
      let { playabilityStatus } = JSON.parse(script);
      let { liveStreamability } = playabilityStatus;
      let { liveStreamabilityRenderer } = liveStreamability;
      let { videoId } = liveStreamabilityRenderer;
      return videoId;
    }
    return null;
  }
  return script;
}

module.exports = getLiveVideoId;
