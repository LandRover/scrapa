import logger from '../../utils/logger.js';


const parse = async function ({ body, type = 'html', fields = {}, options = {} }) {
    try {

        let parse = await _loadParser(type);
        let response = parse({body, fields, options});

        return response;

    } catch (err) {
        logger.error(`Parse failed, ${type}! Error: ${err}.`);
    }
};


const _loadParser = async function(type) {
    let parser = null;

    // this uses a switch for static require analysis
    switch (type) {
        case 'json':
            parser = (await import('./types/json.js')).default;
            break;

        case 'xml':
            parser = (await import('./types/xml.js')).default;
            break;

        case 'csv':
            parser = (await import('./types/csv.js')).default;
            break;
            
        case 'html':
            parser = (await import('./types/html.js')).default;
            break;

        default:
            logger.error(`NOT IMPLEMENTED PARSER: ${type}`);
    }

    return parser;
};


export {
    parse
};
