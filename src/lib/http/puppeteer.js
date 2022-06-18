import puppeteer from 'puppeteer';

import BaseRequest from './base_request.js';
import userAgent from '../../utils/useragent.js';
import logger from '../../utils/logger.js';

const config = {
    userAgent: userAgent.getUserAgentRandom(),

    puppeteerLaunchOptions: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ],

        //dumpio: true,
        headless: true,
        defaultViewport: null,
        userDataDir: './.tmp/cache/browser',
    },
    

    pageOptions: {
        waitUntil: ['load', 'domcontentloaded', 'networkidle2'],
        timeout: 40000,
    }
};

class Puppeteer extends BaseRequest {
    async load() {
        let browser = await this.#_getBrowser(config.puppeteerLaunchOptions);

        try {
            const page = await this.#_loadPage(browser, this.getURL(), config.pageOptions);

            this.setBody(page.body);
            this.setStatusCode(page.statusCode);

            this.loadingCompleted();
            
        } catch(err) {
            logger.error('Puppeteer browser failed to load page', err);
        }

        await browser.close();

        return this;
    }


    async #_getBrowser(launchOptions) {
        return await puppeteer.launch(launchOptions);
    }


    async #_loadPage(browser, url, pageOptions) {
        const page = await browser.newPage();

        await page.setUserAgent(config.userAgent);
        await page.setRequestInterception(true);

        // filter images, fonts and css
        page.on('request', (interceptedRequest) => {
            if (/(stylesheet|image|font)/.test(interceptedRequest.resourceType())) {
                interceptedRequest.abort();
            }
            else {
                interceptedRequest.continue();
            }
        });

        let reply = await page.goto(url, pageOptions);
        let body = await page.content();
        let statusCode = reply.status();

        await page.close();

        return {
            body,
            statusCode
        };
    }


}


export default Puppeteer;
