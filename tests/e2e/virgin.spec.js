import { scrape, parse } from '../../src/scrapa.js';
import { isValidURL } from '../helpers/is_valid_url.js';

//
describe('Virgin', function() {

    describe('Fetch Virgin', function () {
        let URLbase64 = 'aHR0cHM6Ly92aXJnaW5yYWRpby5jby51ay9hcGkvZ2V0LXN0YXRpb24tZGF0YT9zdGF0aW9uPXZpcmdpbnJhZGlvdWsmd2l0aFNvbmdzPTEmaGFzUHJvZ3JhbXM9MSZudW1iZXJPZlNvbmdzPTIw';
        let URLRaw = new Buffer(URLbase64, 'base64').toString('ascii'); // decode

        it('Extract chart Virgin data', async function () {
            // Act
            let scrapeResponse = await scrape({
                url: URLRaw,
                type: 'headless',
            });

            let sut = await parse({
                body: scrapeResponse.body(),
                type: 'json',
                fields: {
                    artist: 'recentlyPlayed.{Iterator}.artist',
                    title: 'recentlyPlayed.{Iterator}.title',
                },
            });

            // Assert
            expect(sut.total).toBe(20);

            expect(sut.fields[0].artist).not.toHaveLength(0);
            expect(sut.fields[0].title).not.toHaveLength(0);
        });


    });

});