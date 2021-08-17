const { default: axios } = require("axios");

function getYTInfo(id) {
  const url =
    "https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
  const options = {
    url,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20210623.00.00",
        },
      },
      videoId: id,
    },
  };

  return axios(options).then(({ data }) => data);
}

module.exports = getYTInfo;
