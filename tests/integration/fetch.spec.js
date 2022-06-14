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
});