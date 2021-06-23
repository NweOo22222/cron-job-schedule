const fetch = require("isomorphic-fetch");

class Yt1s {
    static getVideoInfo(input) {
        let data = new URLSearchParams();
        data.append('q', input.length === 11 ? `https://youtu.be/${input}` : input);
        data.append('vt', 'home');
        return fetch('https://yt1s.com/api/ajaxSearch/index', {
            method: 'POST',
            body: data.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then((res) => res.json());
    }

    static generateDownloadLink(vid, links) {
        links = Object.values(links);
        let selected = links.find(({ q }) => q === '720p') || links.find(({ q }) => q === '480p') || links.find(({ q }) => q === '480p');
        if (!selected) throw new Error('no selected video');
        let data = new URLSearchParams();
        data.append('vid', vid);
        data.append('k', selected['k']);
        return fetch('https://yt1s.com/api/ajaxConvert/convert', {
            method: 'POST',
            body: data.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then((res) => res.json());
    }
}

module.exports = Yt1s;