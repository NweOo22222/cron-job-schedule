function __fixedManually() {
    const i = 326;
    const fixes = [
        "  url.searchParams.set('html5', '1');",
        // "  url.searchParams.set('c', 'TVHTML5');",
        // "  url.searchParams.set('cver', '6.20180913');",
        // "  url.searchParams.set('cver', '7.20190319');",
        "  url.searchParams.set('c', 'WEB');",
        "  url.searchParams.set('cver', '2.20210621.02.00');",
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
    .then(({ title, channelName, formats }) => {
        console.log('[ OK ] ytdl-core:getVideoID - title="%s" channelName="%s" formats.length=%d', title, channelName, formats.length)
    })
    .catch(err => {
        console.error('[FAIL]', err.message)
    });