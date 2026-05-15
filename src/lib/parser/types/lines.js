import json from './json.js';

/**
 * Splits a string body into rows (default: split on \\r?\\n, trim, drop empties),
 * then reuses the JSON iterator with a root string[] (`'{Iterator}'` per line).
 */
export default async function ({ body, fields, options }) {
    let text = 'string' === typeof body ? body : String(body ?? '');

    let splitExpr = options.lineSplit;
    if (!(splitExpr instanceof RegExp)) {
        splitExpr = /\r?\n/;
    }

    let lines = text.split(splitExpr);
    let trimLines = true !== options.noTrim;
    let skipEmpty = false !== options.skipEmptyLines;

    let rows = [];
    for (let i = 0, len = lines.length; i < len; i++) {
        let line = lines[i];
        if (true === trimLines) {
            line = line.trim();
        }
        if (true === skipEmpty && '' === line) {
            continue;
        }
        rows.push(line);
    }

    let skip = Number(options.linesSkip) || 0;
    if (0 < skip) {
        rows.splice(0, skip);
    }

    return json({ body: rows, fields, options });
}
