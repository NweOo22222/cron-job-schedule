const { exec } = require('shelljs');
const { exec: execBG } = require('child_process');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const zg = require('is-zawgyi');
const { zg2uni } = require('rabbit-node');
const { FACEBOOK_PAGE_TOKEN, FACEBOOK_GRAPH_URL } = require('../config');
const { default: axios } = require('axios');
const BURMESE_MONTHS = [
    'ဇန်နဝါရီ',
    'ဖေဖော်ဝါရီ',
    'မတ်',
    'ဧပြီ',
    'မေ',
    'ဇွန်',
    'ဇူလိုင်',
    'ဩဂုတ်',
    'စက်တင်ဘာ',
    'အောက်တိုဘာ',
    'နိုဝင်ဘာ',
    'ဒီဇင်ဘာ'
];

const BURMESE_NUMBERS = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];

function toBurmeseMonth(num) {
    return BURMESE_MONTHS[num] || num;
}

function toBurmeseNumber(num) {
    return String(num).split('').map(n => BURMESE_NUMBERS[n] || n).join('');
}
function toUnicode(text) {
    return text.split('\n').map(txt => zg(txt) ? zg2uni(txt) : txt).join('\n');
}

function createContentForFacebook({
    title,
    description,
    video_url,
}) {
    title = toUnicode(title);
    description = toUnicode(description);
    return `${title}\n\n${description}\n\nOriginally uploaded from ${video_url}\n\n#NweOoBot #NweOoLive`;
}

function saveLiveStream(input, output) {
    console.log('[INFO] saving live streaming video to local file at %s', output);
    return execBG(`ffmpeg -re -i '${input}' '${output}' -y`)
}

function broadcastLiveStream(input, output) {
    console.log('[INFO] streaming live video RTMP url: %s', output);
    return exec(`ffmpeg -y -re -i '${input}' -c:v libx264 -preset veryfast -tune zerolatency -b:v 2M -minrate 1M -maxrate 2M -bufsize 2M -c:a aac -b:a 1M -bufsize 1M -f flv '${output}'`)
}

function optimizeLiveStream(source_url, path, stream_url, timeout = 30000) {
    saveLiveStream(source_url, path)
    setTimeout(() => {
        broadcastLiveStream(path, stream_url + 3820)
    }, timeout)
}

function searchUntilLiveOnYoutube(q) {
    let refresh_count = 0
    return new Promise((resolve) => {
        let search = async () => {
            let { live } = await yts(q);
            live = live.filter(({ status }) => status === 'LIVE')
            if (live.length) {
                console.log('live stream:', live.length, live[0].videoId)
                resolve(live[0].videoId)
            } else {
                console.log('refresh:', refresh_count++)
                setTimeout(() => search(), 3000)
            }
        }
        search();
    })
}

function fetchUntilLiveFromYoutube(youtube_url) {
    let refresh_count = 0
    return new Promise((resolve) => {
        let fetch = async () => {
            let data = await getVideoInfo(youtube_url);
            if (data.formats.length) {
                resolve(data);
            } else {
                console.log('refresh:', refresh_count++)
                setTimeout(() => fetch(), 3000)
            }
        }
        fetch();
    })
}

async function getVideoInfo(youtube_url) {
    if (youtube_url.length === '11') youtube_url = `https://www.youtube.com/watch?v=${youtube_url}`;
    let { videoDetails, formats } = await ytdl.getInfo(youtube_url);
    let data = {
        title: toUnicode(videoDetails.title),
        description: toUnicode(videoDetails.description),
        thumbnail: videoDetails.thumbnails.pop().url,
        channelName: videoDetails['ownerChannelName'] || videoDetails['author'],
        url: videoDetails['video_url'],
        content: createContentForFacebook(videoDetails),
        formats: [],
    };
    formats = formats.sort((a, b) => b.bitrate - a.bitrate);
    data.formats = formats.filter(({
        container,
        hasAudio,
        hasVideo
    }) => hasAudio && hasVideo && ['ts', 'mp4'].includes(container));
    return data;
}


function whoami() {
    return axios.get(`${FACEBOOK_GRAPH_URL}/me?access_token=${FACEBOOK_PAGE_TOKEN}`)
        .then(({ data: { id, name } }) => console.log('[INFO] live streaming as %s https://fb.me/%s', name, id) || { id, name })
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

async function updateLiveStream(id) {
    let url = `${FACEBOOK_GRAPH_URL}/${id}`;
    let data = {
        access_token: FACEBOOK_PAGE_TOKEN,
        status: 'LIVE_NOW',
        fields: 'video',
        embeddable: false,
    };
    let { data: { video } } = await axios.post(url, data);
    console.log('[FB] updated live video, watch live stream at: https://www.facebook.com/watch/live/?v=%s', video.id);
    return { video_id: video.id }
}

async function deleteLiveStream(id) {
    let url = `${FACEBOOK_GRAPH_URL}/${id}?access_token=${FACEBOOK_PAGE_TOKEN}`;
    const { data: { success } } = await axios.delete(url);
    console.log('[FB] Deleted Facebook Live Stream', id);
    return { success };
}

module.exports = {
    saveLiveStream,
    broadcastLiveStream,
    optimizeLiveStream,
    searchUntilLiveOnYoutube,
    toUnicode,
    createContentForFacebook,
    getVideoInfo,
    fetchUntilLiveFromYoutube,
    createLiveStream,
    updateLiveStream,
    deleteLiveStream,
}
