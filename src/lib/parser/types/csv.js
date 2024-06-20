import { csv2json } from 'json-2-csv';

import logger from '../../../utils/logger.js';
import json from './json.js';

export default async function ({ body, fields, options }) {
    let csvData = body;

    if (undefined !== options.regExp) {
        let res = options.regExp.exec(csvData);

        if (undefined !== res[1]) {
            csvData = res[1];
        }
    }

    try {
        let csvOptions = {
            delimiter: { 
                field: options?.delimiter?.field || ';',
                wrap: options?.delimiter?.wrap || '"',
                eol: options?.delimiter?.eol || '\n',
            }
        };

        let convertedToJSON = csv2json(csvData, csvOptions);
        let jsonConvertedObject = json({ body: convertedToJSON, fields, options });

        return jsonConvertedObject;

    } catch (err) {
        logger.error(err.message);
    }
};
