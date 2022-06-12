const _JSON = (body, fields, options) => {
    let output = {
        total: 0,
        fields: []
    };

    for (let el of Object.keys(fields)) {
        let selector = fields[el],
            len = 1; //default

        // Handle dynamic iterator, @todo: move somewhere.. not clean, not testable.
        if (0 <= selector.indexOf('{Iterator}')) {
            let [prefixTree] = selector.split('{Iterator}');

            let reduceList = body;

            if ('' !== prefixTree) {
                // clean dots, prefix and sufix
                prefixTree = prefixTree.replace(/\.+$/g, '').replace(/^\.+/, '');

                reduceList = prefixTree.split('.').reduce(
                    function (memo, token) {
                        return memo != null && memo[token];
                    },
                    body
                );
            }

            len = reduceList.length;
        }

        for (let i = 0; i < len; i++) {
            let selectorLocal = selector.replace('{Iterator}', i);

            // https://stackoverflow.com/questions/13369746/nodejs-json-dynamic-property
            let reduceRes = selectorLocal.split('.').reduce(
                function (memo, token) {
                    return memo != null && memo[token];
                },
                body
            );

            if (undefined === output.fields[i]) {
                output.fields[i] = {};
            }

            output.fields[i][el] = reduceRes;
        }

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


module.exports = async function ({ body, fields, options }) {
    // try parsing
    if ('object' !== typeof (body)) {
        body = JSON.parse(body);
    }

    return _JSON(body, fields, options);
};
