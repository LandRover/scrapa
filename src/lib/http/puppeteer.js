import puppeteer from 'puppeteer';


const config = {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',


    puppeteerLaunchOptions: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ],

        //dumpio: true,
        headless: true,
        defaultViewport: null,
        userDataDir: './.tmp/cache/browser',
    },
    

    pageOptions: {
        waitUntil: ['load', 'domcontentloaded', 'networkidle2'],
        timeout: 25000,
    }
};


const get = async function (url) {
    let browser = await _getBrowser(config.puppeteerLaunchOptions);
    let body = await _loadPage(browser, url, config.pageOptions);
    await browser.close();

    return body;
};


const _getBrowser = async (launchOptions) => {
    return await puppeteer.launch(launchOptions);
};


const _loadPage = async (browser, url, pageOptions) => {
    return new Promise(async (resolve, reject) => {
        try {
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

            await page.goto(url, pageOptions);
            let body = await page.content();

            await page.close();

            resolve(body);
        } catch (error) {
            reject(error);
        }
    });
};


export {
    get
};
