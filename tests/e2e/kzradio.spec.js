import { scrape, parse } from '../../src/scrapa.js';

const KZ_CHART_FEED = 'https://www.kzradio.net/shows/weekly-alternative-chart/feed';

/** Browser-like UA avoids intermittent 403s from some CDNs/WAF rules on non-browser clients. */
const KZ_HEADERS = {
    'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
};

/** Stepwise `reduceRegExp`: RSS → first `<item>` → its `<description>` CDATA → chart `<p>` inner (before “The post”). */
const KZ_CHART_REGEX = [
    /<item>([\s\S]*?)<\/item>/,
    /<description>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/description>/,
    /^\s*<p>([\s\S]*?)<\/p>\s*<p>The post/i,
];

const KZ_REPLACEMENTS = [
    [/<br\s*\/?>\s*/gi, '\n'],
    [/^\d+[:.]\s+/gm, ''],
    [/^\s+/, ''],
    [/\s+$/, ''],
];

describe('KZ Radio weekly chart feed', function () {


    it('scrape regExp + replacements[], then parse() body as newline rows with fields', async function () {
        let scrapeResponse = await scrape({
            url: KZ_CHART_FEED,
            type: 'get',
            headers: KZ_HEADERS,
            regExp: KZ_CHART_REGEX,
            replacements: KZ_REPLACEMENTS,
        });

        expect(scrapeResponse.statusCode()).toBe(200);
        expect(scrapeResponse.body()).not.toMatch(/<[\w!/]/);

        let sut = await parse({
            body: scrapeResponse.body(),
            type: 'lines',
            fields: {
                chartLine: '{Iterator}',
            },
        });

        expect(sut.total).toBe(sut.fields.length);
        expect(sut.fields.length).toBeGreaterThanOrEqual(20);
        expect(sut.fields[0].chartLine).toMatch(/M\.I\.A\.|Everything/);
        expect(sut.fields.some((row) => /Heidi Curtis|Siren/.test(row.chartLine))).toBe(true);
        expect(sut.fields.some((row) => /^\d+[:.]/.test(row.chartLine))).toBe(false);
    });


    it('uses {Iterator} on rss.channel.item for one row per episode', async function () {
        let scrapeResponse = await scrape({
            url: KZ_CHART_FEED,
            type: 'get',
            headers: KZ_HEADERS,
        });

        expect(scrapeResponse.statusCode()).toBe(200);

        let sut = await parse({
            body: scrapeResponse.body(),
            type: 'xml',
            fields: {
                title: 'rss.channel.item.{Iterator}.title',
                link: 'rss.channel.item.{Iterator}.link',
            },
        });

        expect(sut.fields.length).toBeGreaterThan(5);
        expect(sut.fields[0].link).toMatch(/kzradio\.net\/shows\/weekly-alternative-chart\//);
        expect(String(sut.fields[0].title).length).toBeGreaterThan(0);
    });

});
