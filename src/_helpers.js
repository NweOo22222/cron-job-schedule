exports.saveLiveStreamToLocal = function saveLiveStreamToLocal(input, output) {
    console.log('[1/2] saving live streaming video to local file at %s', output);
    return execBG(`ffmpeg -i '${input}' -c:v libx264 -b:v 5M -bufsize 5M -maxrate 5M -threads 32 -g 120 -r 60 -c:a aac -ar 44100 '${output}' -y`)
}

exports.broadcastLiveStreamFromLocal = function broadcastLiveStreamFromLocal(input, output) {
    console.log('[2/2] streaming live video RTMP url: %s', output);
    return exec(`ffmpeg -re -i '${input}' -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -f flv '${output}'`)
}

exports.optimizeLiveStream = function optimizeLiveStream(source_url, path, stream_url, timeout = 10000) {
    saveLiveStreamToLocal(source_url, path)
    setTimeout(() => {
        broadcastLiveStreamFromLocal(path, stream_url)
    }, timeout)
}