const RFA_CHANNEL_ID = "UCE75dgnEYPacknHHg3a3sJg";
const getLiveVideoId = require("../src/getLiveVideoId");

console.log(
  " >>",
  new Date().toLocaleString("en-US", { timeZone: "Asia/Yangon" }),
  "INIT"
);

async function stream(q) {
  console.log(
    " >>",
    new Date().toLocaleString("en-US", { timeZone: "Asia/Yangon" }),
    "PRE_LIVE"
  );
  try {
    let videoId = await getLiveVideoId(RFA_CHANNEL_ID);
    process.argv[3] = videoId;
    setTimeout(() => {
      console.log(
        " >>",
        new Date().toLocaleString("en-US", { timeZone: "Asia/Yangon" }),
        "LIVE"
      );
      require("../dev");
    }, 4000);
  } catch (e) {
    console.log("[ERROR]", e);
    process.exit(1);
  } finally {
    console.log(
      '> querying "',
      q,
      '" at',
      new Date().toLocaleString("en-US", { timeZone: "Asia/Yangon" }),
      "END"
    );
  }
}

module.exports = stream;
