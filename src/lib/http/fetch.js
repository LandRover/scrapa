import fetch from 'node-fetch';
import userAgent from '../../utils/useragent.js';


const get = async function (url) {
    let body = '';

    let headers = {
        'User-Agent': userAgent.getUserAgentRandom()
    };

    let referrer = await _getDomainName(url);

    try {
        const response = await fetch(url, {
            headers,
            referrer,
        });

        body = await response.text();

    } catch(err) {
        console.error(err);
    }

    return body;
};


const _getDomainName = async function (url) {
    let domain = (new URL(url));

    return domain.origin;
};


export {
    get
};
