const facebookApiVideoUpload = require('facebook-api-video-upload');
const getVideoInfo = require('./src/getVideoInfo');
const { FACEBOOK_PAGE_TOKEN, FACEBOOK_GRAPH_URL } = require("./config");
const { default: axios } = require('axios');
const input = process.argv[3];
const url = input.length === '11' ? `https://www.youtube.com/watch?v=${input}` : input;

getVideoInfo(url)
    .then(async ({ title, channelName, description, url, formats, thumbnail }) => {
            let format = formats.find(({ qualityLabel }) => qualityLabel === '720p' || qualityLabel === '480p' || qualityLabel === '360p');

        const { data: { id } } = await axios(`${FACEBOOK_GRAPH_URL}/me?access_token=${FACEBOOK_PAGE_TOKEN}`);
        const data = await facebookApiVideoUpload({
            id,
            title,
            token: FACEBOOK_PAGE_TOKEN,
            stream: (await axios({ url: format.url, responseType: 'stream' })).data,
            description: `${title}\n\n${description}\n\nOriginally uploaded from Youtube at ${url}\n\n#NweOoBot`,
        });
        console.log(data);
    }).catch(e => {
        console.log(e.response?.headers, e.response?.data);
        console.log(e.message);
    });
