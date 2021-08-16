const { searchUntilLiveOnYoutube } = require("../src/_helpers");

console.log(' >>', new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }), 'INIT');

async function stream(q) {
    console.log(' >>', new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }), 'PRE_LIVE');
    searchUntilLiveOnYoutube(q, 20, 'RFA Burmese လွတ်လပ်တဲ့အာရှအသံ')
        .then(async (videoId) => {
            process.argv[3] = videoId;
            setTimeout(() => console.log('  live stream in %d seconds...', 3), 1000);
            setTimeout(() => console.log('  live stream in %d seconds...', 2), 2000);
            setTimeout(() => console.log('  live stream in %d second...', 1), 3000);
            setTimeout(() => {
                console.log(' >>', new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' }), 'LIVE');
                require('../dev');
            }, 4000);
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
