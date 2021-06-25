const { exec } = require("shelljs");
const { searchUntilLiveOnYoutube } = require("../src/_helpers");
const channel = process.argv[2];

console.log(' >>', new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }), 'INIT');

async function stream(q) {
    console.log(' >>', new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }), 'PRE_LIVE');
    searchUntilLiveOnYoutube(q)
        .then(async (videoId) => {
            setTimeout(() => console.log('  live stream in next %d seconds...', 8), 1000);
            setTimeout(() => console.log('  live stream in next %d seconds...', 7), 2000);
            setTimeout(() => console.log('  live stream in next %d seconds...', 6), 3000);
            setTimeout(() => console.log('  live stream in next %d seconds...', 5), 4000);
            setTimeout(() => console.log('  live stream in next %d seconds...', 4), 5000);
            setTimeout(() => console.log('  live stream in %d seconds...', 3), 6000);
            setTimeout(() => console.log('  live stream in %d seconds...', 2), 7000);
            setTimeout(() => console.log('  live stream in %d second...', 1), 8000);
            setTimeout(() => {
                console.log(' >>', new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }), 'LIVE');
                exec(`node ${__dirname}/../dev.js '${channel}' '${videoId}'`);
            }, 9000);
        })
        .catch((e) => {
            console.log('[ERROR]', e);
            process.exit(1);
        })
        .finally(() =>
            console.log('> querying "', q, '" at', new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }), 'END')
        )
}

module.exports = stream;
