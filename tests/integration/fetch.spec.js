import Fetch from '../../src/lib/http/fetch.js';
const url = 'https://agilemanifesto.org';

// 'When no price is specified, then the product status is pending approval'
describe('Fetch', function() {


    describe('fetching remote page', function () {


        it('When making an HTTP call to AgileManifesto, should retrieve a valid Manifesto page', async function () {
            let bodyExpected = 'Manifesto for Agile Software Development';

            // Act
            let sut = (await (new Fetch())
                    .setURL(url)
                    .load()
                )
                .serialize();

            // Assert
            expect(sut.body()).toContain(bodyExpected);
        });


    });


    describe('RegExp substitutions on loaded body', function () {


        it('reduceRegexpReplacements applies [RegExp, string] pairs from an array', async function () {
            let sut = new Fetch().setBody('20: aa<br />\n30: bb').reduceRegexpReplacements([
                [/<br\s*\/?>\s*/gi, '\n'],
                [/^\d+[:.]\s+/gm, ''],
            ]);

            expect(sut.getBody()).toBe('aa\nbb');
        });

    });


});