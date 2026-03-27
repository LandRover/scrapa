import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import BaseRequest from './base_request.js';
import userAgent from '../../utils/useragent.js';
import logger from '../../utils/logger.js';

puppeteerExtra.use(StealthPlugin());

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
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--ignore-certificate-errors'
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
        let launchOptions = { ...config.puppeteerLaunchOptions, args: [...config.puppeteerLaunchOptions.args] };

        if (this.getProxy()) {
            const proxyUrl = new URL(this.getProxy());
            launchOptions.args.push(`--proxy-server=${proxyUrl.origin}`);
        }

        let browser = await this.#_getBrowser(launchOptions);

        try {
            const page = await this.#_loadPage(browser, this.getURL(), config.pageOptions, this.getProxy());

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
        return await puppeteerExtra.launch(launchOptions);
    }


    async #_loadPage(browser, url, pageOptions, proxy = null) {
        const page = await browser.newPage();

        if (proxy) {
            const proxyUrl = new URL(proxy);
            if (proxyUrl.username && proxyUrl.password) {
                await page.authenticate({ username: proxyUrl.username, password: proxyUrl.password });
            }
        }

        await page.setUserAgent(config.userAgent);
        await page.setRequestInterception(true);

        // Intercept the main document response to capture raw body (e.g. JSON APIs)
        let capturedBody = null;
        let capturedContentType = null;
        page.on('response', async (response) => {
            if (response.url() === url && response.request().resourceType() === 'document') {
                capturedContentType = response.headers()['content-type'] || '';
                try {
                    capturedBody = await response.text();
                } catch (_) {}
            }
        });

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
        let statusCode = reply.status();

        // For JSON API responses use the raw intercepted body; fall back to rendered page HTML
        let body;
        if (capturedBody && capturedContentType && capturedContentType.includes('json')) {
            body = capturedBody;
        } else {
            body = await page.content();
        }

        await page.close();

        return {
            body,
            statusCode
        };
    }


}


export default Puppeteer;
