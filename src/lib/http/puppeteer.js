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
            '--remote-allow-origins=*',
            '--no-first-run',
            '--no-service-autorun',
            '--no-default-browser-check',
            '--homepage=about:blank',
            '--no-pings',
            '--password-store=basic',
            '--disable-infobars',
            '--disable-breakpad',
            '--disable-dev-shm-usage',
            '--disable-session-crashed-bubble',
            '--disable-search-engine-choice-screen',
            '--disable-session-crashed-bubble',
            '--disable-features=IsolateOrigins,site-per-process',
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

        // Wrap the async body capture in a Promise so we can await it after goto()
        // without racing — page.goto resolves before the async response.text() call finishes.
        let captureResolve;
        const capturePromise = new Promise(resolve => { captureResolve = resolve; });
        page.on('response', async (response) => {
            if (response.url() === url && response.request().resourceType() === 'document') {
                let captured = null;
                try { captured = await response.text(); } catch (_) {}
                captureResolve(captured);
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

        // Wait for the intercepted body, falling back to page.content() if nothing was captured.
        // Preferring the raw intercepted body avoids page.content() throwing when the execution
        // context is destroyed by a Cloudflare/bot-protection redirect.
        const capturedBody = await Promise.race([
            capturePromise,
            new Promise(resolve => setTimeout(() => resolve(null), 2000)),
        ]);

        let body;
        if (capturedBody) {
            body = capturedBody;
        } else {
            try {
                body = await page.content();
            } catch (_) {
                body = null;
            }
        }

        await page.close();

        return {
            body,
            statusCode
        };
    }


}


export default Puppeteer;
