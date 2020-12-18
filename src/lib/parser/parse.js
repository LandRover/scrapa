
const parse = function ({type, body, fields, options}) {
    try {
        options = options || {};
        let parse = _loadParser(type);
        let response = parse({body, fields, options});

        return response;
    } catch (err) {
        console.log(`Parse failed, ${type}! Error: ${err}.`);
    }
};


const _loadParser = function(type) {
    // this uses a switch for static require analysis
    switch (type) {
        case 'json':
            parser = require('./types/json')
            break;

        case 'xml':
            parser = require('./types/xml')
            break;
            
        case 'html':
            parser = require('./types/html')
            break;

        default:
            console.log(`NOT IMPLEMENTED PARSER: ${type}`);
    }

    return parser;
};

module.exports = {
    parse
};
