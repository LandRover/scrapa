const parse = async function ({ body, type = 'html', fields = {}, options = {} }) {
    try {

        let parse = await _loadParser(type);
        let response = parse({body, fields, options});

        return response;

    } catch (err) {
        console.error(`Parse failed, ${type}! Error: ${err}.`);
    }
};


const _loadParser = async function(type) {
    let parser = null;

    // this uses a switch for static require analysis
    switch (type) {
        case 'json':
            parser = (await import('./types/json')).default;
            break;

        case 'xml':
            parser = (await import('./types/xml')).default;
            break;
            
        case 'html':
            parser = (await import('./types/html')).default;
            break;

        default:
            console.error(`NOT IMPLEMENTED PARSER: ${type}`);
    }

    return parser;
};


export {
    parse
};
