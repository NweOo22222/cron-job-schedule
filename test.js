function __fixedManually() {
    const i = 326;
    const fixes = [
        "  url.searchParams.set('html5', '1');",
        "  url.searchParams.set('c', 'TVHTML5');",
        "  url.searchParams.set('cver', '6.20180913');",
        // "  url.searchParams.set('cver', '7.20190319');",
    ];
    const fs = require('fs');
    const file_path = __dirname + '/node_modules/ytdl-core/lib/info.js';
    const code = fs.readFileSync(file_path, 'utf-8').split('\n');

    if (code.includes(fixes[0]) && code.includes(fixes[1]) && code.includes(fixes[2])) {
        return console.log('already updated')
    }
    console.log('updated')
    const [head, body, tail] = [code.slice(0, i), fixes, code.slice(i)];
    const output = [...head, ...body, ...tail].join('\n');
    fs.writeFileSync(file_path, output, 'utf-8');
}

__fixedManually()

console.log('[TEST] testing ytdl-core:getVideoID')

require('./src/_helpers')
    .getVideoInfo('qMtcWqCL_UQ')
    .then(({ title, ownerChannelName, formats }) => {
        console.log('[ OK ] ytdl-core:getVideoID - title="%s" channelName="%s" formats.length=%d', title, ownerChannelName, formats.length)
        if (!formats.length) {
            return getDashUrl('qMtcWqCL_UQ').then((res) => console.log('>> %s', res))
        }
    })
    .catch(err => {
        console.error('[FAIL]', err.message)
    });

function getDashUrl(id) {
    const { default: axios } = require('axios');

    return axios.get(`https://www.youtube.com/get_video_info?video_id=${id}&eurl=https%3A%2F%2Fyoutube.googleapis.com%2Fv%2Fonz2k4zoLjQ&html5=1&c=TVHTML5&cver=6.20180913`).then(({ data }) => {
        let u = new URL('http://localhost?' + data);
        let r = JSON.parse(u.searchParams.get('player_response'));
        return r.streamingData.dashManifestUrl;
    });
}

module.exports = getDashUrl;