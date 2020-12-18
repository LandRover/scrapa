const scrape = async ({ url, type }) => {
    try {
        body = await _loadScraper(type).get(url);
        return body;

    } catch (err) {
        console.log(`Load failed, ${type}! Error: ${err}.`);
    }
};


const _loadScraper = function (type) {
    let scraper = null;
    
    switch (type) {

        case 'get':
            scraper = require('../http/fetch');
            break;

        case 'browser':
            scraper = require('../http/puppeteer');
            break;

        default:
            console.error(`NOT IMPLEMENTED PARSER: ${scraperName}`);
    }

    return scraper;
};


module.exports = {
    scrape
};