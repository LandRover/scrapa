const fetch = require('node-fetch');
const puppeteer = require('puppeteer');

const config = {
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1'
};


const get = async function (url) {
    let headers = {
        'User-Agent': config.userAgent
    };

    const response = await fetch(url, {headers})
    .then(res => res.text())
    .catch(err => console.error(err));

    return response;
};


module.exports = {
    get
};
