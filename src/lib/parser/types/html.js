import Strings from '../../../utils/strings';
import * as cheerio from 'cheerio';

export default async function ({ body, fields, options }) {
    let output = {
        total: 0,
        fields: []
    };

    const $ = cheerio.load(body);

    for (let el of Object.keys(fields)) {
        let selector = fields[el];

        $(selector).each(function (i, elem) {
            if (output.fields[i] === undefined) {
                output.fields[i] = {};
            }

            output.fields[i][el] = Strings.sanitize($(this).text());
        });

        output.total = output.fields.length;
    }

    if (true === options.reverse) {
        output.fields.reverse();
    }

    if (0 < options.limit && options.limit < output.fields.length) {
        output.fields.splice(options.limit);
    }

    return output;
};