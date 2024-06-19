import { scrape, parse } from '../../src/scrapa.js';
import { isValidURL } from '../helpers/is_valid_url.js';

//
describe('BP Top 100', function() {

    describe('Extract JSON from BP, parse it and structure', function () {
        let URLbase64 = 'aHR0cHM6Ly93d3cuYmVhdHBvcnQuY29tL3RvcC0xMDA=';
        let URLRaw = new Buffer(URLbase64, 'base64').toString('ascii'); // decode

        it('Extract chart BP data', async function () {
            // Act
            let scrapeResponse = await scrape({
                url: URLRaw,
                type: 'get',
                regExp: [new RegExp('<script id="__NEXT_DATA__" type="application/json">(.*?)</script>')],
            });

            let sut = await parse({
                body: scrapeResponse.body(),
                type: 'json',
                fields: {
                    id: 'props.pageProps.dehydratedState.queries.0.state.data.results.{Iterator}.id',
                    artist: 'props.pageProps.dehydratedState.queries.0.state.data.results.{Iterator}.artists.0.name',
                    title: 'props.pageProps.dehydratedState.queries.0.state.data.results.{Iterator}.name',
                    label: 'props.pageProps.dehydratedState.queries.0.state.data.results.{Iterator}.release.label.name',
                    mix: 'props.pageProps.dehydratedState.queries.0.state.data.results.{Iterator}.mix_name',
                    bpm: 'props.pageProps.dehydratedState.queries.0.state.data.results.{Iterator}.bpm',
                    price: 'props.pageProps.dehydratedState.queries.0.state.data.results.{Iterator}.price.value',
                    duration: 'props.pageProps.dehydratedState.queries.0.state.data.results.{Iterator}.length',
                    date: 'props.pageProps.dehydratedState.queries.0.state.data.results.{Iterator}.new_release_date',
                    image: 'props.pageProps.dehydratedState.queries.0.state.data.results.{Iterator}.release.image.uri'
                },
            });

            // Assert
            expect(sut.total).toBe(100);
            expect(sut.total).toBe(sut.fields.length);

            expect(sut.fields[0].id).toEqual(expect.any(Number))
            expect(sut.fields[0].artist).not.toHaveLength(0);
            expect(sut.fields[0].title).not.toHaveLength(0);
            expect(sut.fields[0].label).not.toHaveLength(0);
            expect(sut.fields[0].mix).not.toHaveLength(0);
            expect(sut.fields[0].bpm).toEqual(expect.any(Number))
            expect(sut.fields[0].price).toEqual(expect.any(Number))
            expect(sut.fields[0].duration).not.toHaveLength(0);
            expect(sut.fields[0].date).not.toHaveLength(0);
            expect(isValidURL(sut.fields[0].image)).toBe(true);
        });


    });

});