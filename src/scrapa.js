import { parse } from './lib/parser/parse.js';
import { scrape } from './lib/scraper/scrape.js';

import logger, { setLogger } from './utils/logger.js';


export {
    scrape,
    parse,
    setLogger,
};
