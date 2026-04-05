import logger from '../../utils/logger.js';
import Fetch from '../http/fetch.js';
import Puppeteer from '../http/puppeteer.js';
import Websocket from '../http/websocket.js';


const scrape = async ({ url, type = 'get', regExp = [], payload = {}, proxy = null, headers = null }) => {
    try {
        let scraper = _loadScraper(type)
            .setURL(url)
            .setPayload(payload);

        if (proxy) {
            scraper.setProxy(proxy);
        }

        if (headers) {
            scraper.setHeaders(headers);
        }

        let result = (await scraper.load())
            .reduceRegExp(regExp)
            .serialize();

        return result;

    } catch (err) {
        logger.error(`Load failed, ${type}! Error: ${err}.`);
    }
};


const _loadScraper = function (type) {
    let scraper = null;
    
    switch (type) {

        case 'get':
            scraper = new Fetch();
            break;

        case 'headless':
            scraper = new Puppeteer();
            break;

        case 'websocket':
            scraper = new Websocket();
            break;

        default:
            logger.error(`NOT IMPLEMENTED PARSER: ${scraperName}`);
    }

    return scraper;
};


export {
    scrape
};
