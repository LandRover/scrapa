import { XMLParser } from 'fast-xml-parser';
import logger from '../../../utils/logger.js';
import json from './json.js';

export default async function ({ body, fields, options }) {
    let xmlData = body;

    if (undefined !== options.regExp) {
        let res = options.regExp.exec(xmlData);

        if (undefined !== res[1]) {
            data = res[1];
        }
    }

    try {
        const parser = new XMLParser();
        let convertedToJSON = parser.parse(xmlData);
        let jsonConvertedObject = json({ body: convertedToJSON, fields, options });

        return jsonConvertedObject;

    } catch (err) {
        logger.error(err.message);
    }
};
