let liveId;
const vid = process.argv[3];
const getYTInfo = require('./getYTInfo');
const { default: axios } = require('axios');
const { toUnicode, broadcastLiveStream, createLiveStream, deleteLiveStream, updateLiveStream } = require('./src/_helpers');

getYTInfo(vid)
    .then(async ({ videoDetails, streamingData }) => {
        let source_url;
        const { formats, dashManifestUrl, hlsManifestUrl } = streamingData;
        const { title, shortDescription, author } = videoDetails;
        const video_url = `https://www.youtube.com/watch?v=${vid}`;
        const description = `"${toUnicode(title)}" - ${author}\n\n${toUnicode(shortDescription)}\n\nOriginally uploaded from ${author} at ${video_url}\n#NweOoBot #NweOoLive`;
        if (hlsManifestUrl) {
            console.log('[INFO] live streaming from HLS...');
            let result = [];
            let { data } = await axios(hlsManifestUrl);
            data = data.split('#EXT-X-STREAM-INF').slice(1);
            for (let text of data) {
              text = text.trim();
              if (text.includes(':BANDWIDTH')) {
                let resolution = text.match(/RESOLUTION=(\d{3,4}x\d{3,4}),/)[1];
		let [, url] = text.split('\n');
                result.push({ resolution, url });
              }
            }
            console.log(result)
            source_url = result.find(video => video.resolution === '1280x720')
                || result.find(video => video.resolution === '854x480');
            source_url = source_url['url'] || hlsManifestUrl;
        } else if (dashManifestUrl) {
            console.log('[INFO] live streaming from DASH...');
            source_url = dashManifestUrl;
        } else {
            let selectedFormat = formats.find(({ qualityLabel }) => qualityLabel === '720p')
                || formats.find(({ qualityLabel }) => qualityLabel === '480p')
                || formats.find(({ qualityLabel }) => qualityLabel === '360p');
            source_url = selectedFormat.url;
        }
        console.log('source url: %s', source_url);
        return {
            title: toUnicode(title),
            description,
            source_url,
        };
    }).then(async ({ title, description, source_url }) => {
        const { id, stream_url } = await createLiveStream({ title, description });
        liveId = id;
        await updateLiveStream(id);
        broadcastLiveStream(source_url, stream_url, () => setTimeout(() => process.exit(1), 3000));
    }).catch(err => {
        if (liveId) deleteLiveStream(liveId);
        console.log(err);
        process.exit(1);
    });
