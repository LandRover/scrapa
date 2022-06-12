import * as fetch from '../http/fetch';
import * as puppeteer from '../http/puppeteer';


const scrape = async ({ url, type = 'get', regExp = [] }) => {
    try {

        let body = await _loadScraper(type).get(url);

        for (let i = 0, len = regExp.length; i < len; i++) {
            let pattern = regExp[i];

            if (pattern instanceof RegExp) {
                let res = pattern.exec(body);

                if (undefined !== res[1]) {
                    body = res[1];
                }
            }
        }

        return body;

    } catch (err) {
        console.log(`Load failed, ${type}! Error: ${err}.`);
    }
};


const _loadScraper = function (type) {
    let scraper = null;
    
    switch (type) {

        case 'get':
            scraper = fetch;
            break;

        case 'headless':
            scraper = puppeteer;
            break;

        default:
            console.error(`NOT IMPLEMENTED PARSER: ${scraperName}`);
    }

    return scraper;
};


export {
    scrape
};
