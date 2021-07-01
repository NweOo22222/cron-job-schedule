let liveId;
const vid = process.argv[3];
const getYTInfo = require('./getYTInfo');
const { toUnicode, broadcastLiveStream, createLiveStream, deleteLiveStream, updateLiveStream } = require('./src/_helpers');

/*
const { default: axios } = require('axios');
const config = {
    headers: {
        'user-agent': user_agent,
    }
};
const user_agent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
const c = 'TVHTML5'
const cver = '6.20180913'
const eurl = 'https://youtube.googleapis.com/v/onz2k4zoLjQ';
const url = new URL('https://www.youtube.com/get_video_info');

url.searchParams.append('video_id', vid);
url.searchParams.append('eurl', eurl);
url.searchParams.append('html5', '1');
url.searchParams.append('c', c);
url.searchParams.append('cver', cver);
*/

getYTInfo(vid)
    .then(({ videoDetails, streamingData }) => {
        let source_url;
        const { formats, dashManifestUrl, hlsManifestUrl } = streamingData;
        const { title, shortDescription, author } = videoDetails;
        const video_url = `https://www.youtube.com/watch?v=${vid}`;
        const description = `"${toUnicode(title)}" - ${author}\n\n${toUnicode(shortDescription)}\n\nOriginally uploaded from ${author} at ${video_url}\n#NweOoBot #NweOoLive`;
        if (hlsManifestUrl) {
            console.log('[INFO] live streaming from HLS...', hlsManifestUrl);
            source_url = hlsManifestUrl;
        } else if (dashManifestUrl) {
            console.log('[INFO] live streaming from DASH...', dashManifestUrl);
            source_url = dashManifestUrl;
        } else {
            let selectedFormat = formats.find(({ qualityLabel }) => qualityLabel === '720p')
                || formats.find(({ qualityLabel }) => qualityLabel === '480p')
                || formats.find(({ qualityLabel }) => qualityLabel === '360p');
            source_url = selectedFormat.url;
        }
        return {
            title: toUnicode(title),
            description,
            source_url,
        };
    }).then(async ({ title, description, source_url }) => {
        const { id, stream_url } = await createLiveStream({ title, description });
        liveId = id;
        await updateLiveStream(id);
        broadcastLiveStream(source_url, stream_url);
    }).catch(err => {
        if (liveId) deleteLiveStream(liveId);
        console.log(err);
        process.exit(1);
    });
