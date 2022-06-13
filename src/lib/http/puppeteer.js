import puppeteer from 'puppeteer';


const config = {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',


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


const get = async function (url) {
    let body = null;

    let browser = await _getBrowser(config.puppeteerLaunchOptions);

    try {
        body = await _loadPage(browser, url, config.pageOptions);
    } catch(err) {
        console.error('Puppeteer browser failed to load page', err);
    }

    await browser.close();

    return body;
};


const _getBrowser = async (launchOptions) => {
    return await puppeteer.launch(launchOptions);
};


const _loadPage = async (browser, url, pageOptions) => {
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

    return body;
};


export {
    get
};
