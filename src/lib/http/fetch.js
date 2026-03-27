import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

import BaseRequest from './base_request.js';
import userAgent from '../../utils/useragent.js';
import logger from '../../utils/logger.js';

class Fetch extends BaseRequest {
    async load() {
        let headers = {
            'User-Agent': userAgent.getUserAgentRandom()
        };

        let referrer = await this.#_getDomainName();

        let fetchOptions = { headers, referrer };

        if (this.getProxy()) {
            fetchOptions.agent = new HttpsProxyAgent(this.getProxy());
        }

        try {
            const response = await fetch(this.getURL(), fetchOptions);

            const body = await response.text();

            this.setBody(body);
            this.setStatusCode(response.status);
            this.loadingCompleted();
        } catch(err) {
            logger.error(err);
        }

        return this;
    };


    async #_getDomainName() {
        let domain = (new URL(this.getURL()));

        return domain.origin;
    }


}


export default Fetch;
