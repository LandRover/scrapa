const fetch = require('node-fetch');
const puppeteer = require('puppeteer');


const config = {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1'
};


const get = async function (url) {
    let body = '';

    let headers = {
        'User-Agent': config.userAgent
    };

    let referrer = await _getDomainName(url);

    try {
        const response = await fetch(url, {
            headers,
            referrer,
        });

        body = await response.text();

    } catch(err) {
        console.error(err);
    }

    return body;
};


const _getDomainName = async function (url) {
    let domain = (new URL(url));

    return domain.origin;
};

module.exports = {
    get
};
