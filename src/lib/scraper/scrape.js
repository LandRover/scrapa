const scrape = async ({ url, type = 'get' }) => {
    try {

        let body = await _loadScraper(type).get(url);
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

        case 'headless':
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
