const { parse } = require('./lib/parser/parse');
const { scrape } = require('./lib/scraper/scrape');

module.exports = {
    scrape,
    parse,
};
