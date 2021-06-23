function __fixedManually() {
    const i = 326;
    const fixes = [
        '  url.searchParams.set(\'c\', \'TVHTML5\');',
        '  url.searchParams.set(\'cver\', \'6.20180913\');'
    ];
    const fs = require('fs');
    const file_path = __dirname + '/node_modules/ytdl-core/lib/info.js';
    const code = fs.readFileSync(file_path, 'utf-8').split('\n');

    if (code.includes(fixes[0]) && code.includes(fixes[1])) {
        return console.log('already updated')
    }
    console.log('updated')
    const [head, body, tail] = [code.slice(0, i), fixes, code.slice(i)];
    const output = [...head, ...body, ...tail].join('\n');
    fs.writeFileSync(file_path, output, 'utf-8');
}

__fixedManually()

console.log('[TEST] testing ytdl-core:getVideoID')

require('ytdl-core')
    .getInfo('TLVlOAe0tpI')
    .then(({ formats }) => {
        if (formats.length) console.log('[ OK ] ytdl-core:getVideoID')
    })
    .catch(err => {
        console.error('[FAIL]', err.message)
    });