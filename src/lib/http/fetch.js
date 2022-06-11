const fetch = require('node-fetch');
const puppeteer = require('puppeteer');


const config = {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1'
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
