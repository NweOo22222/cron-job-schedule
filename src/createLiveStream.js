const { default: axios } = require('axios');
const { FACEBOOK_PAGE_TOKEN, FACEBOOK_GRAPH_URL } = require('../config');

function whoami() {
    return axios.get(`${FACEBOOK_GRAPH_URL}/me?access_token=${FACEBOOK_PAGE_TOKEN}`)
        .then(({ data: { id, name } }) => console.log('[fb:info] %s https://www.facebook.com/%s', name, id) || { id, name })
}

async function createLiveStream({ title, description }) {
    let url = `${FACEBOOK_GRAPH_URL}/me/live_videos`;
    let data = {
        access_token: FACEBOOK_PAGE_TOKEN,
        status: 'LIVE_NOW',
        title,
        description,
    };
    await whoami();
    let { data: { id, stream_url } } = await axios.post(url, data);
    console.log('[FB]', 'created live video', id);
    return { id, stream_url };
}

module.exports = createLiveStream;