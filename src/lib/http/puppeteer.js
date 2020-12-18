const fetch = require('node-fetch');
const puppeteer = require('puppeteer');


const config = {
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',


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
        userDataDir: './.tmp/cache/browser'
    },
    

    pageOptions: {
        waitUntil: ['load', 'domcontentloaded', 'networkidle2'],
            timeout: 25000
    }
};


const get = async function (url) {
    let browser = await _getBrowser(config.puppeteerLaunchOptions);
    let body = await _loadPage(browser, url, config.pageOptions);

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
            await page.goto(url, pageOptions);

            let body = await page.content();

            await page.close();

            resolve(body);
        } catch (error) {
            reject(error);
        }
    });
};


module.exports = {
    get
};
