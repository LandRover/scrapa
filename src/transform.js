const { scrape } = require('./lib/scraper/scrape');
const { parse } = require('./lib/parser/parse');

parsingSitesList.forEach(async (options) => {

    let body = await scrape({
        url: options.scraper.url,
        type: options.scraper.type
    });
    
    let parsed = await parse({
        type: options.parser.type,
        body,
        fields: options.parser.fields,
        options: options.parser.options
    });

    console.debug(parsed);
});
