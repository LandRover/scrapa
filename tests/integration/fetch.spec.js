const { get } = require('../../src/lib/http/fetch');
const url = 'https://agilemanifesto.org';

// 'When no price is specified, then the product status is pending approval'
describe('Fetch', function() {


    describe('fetching HTML', function () {


        it('When making an HTTP call, should retrieve a valid HTML page', async function () {
            let body = 'Manifesto for Agile Software Development';

            // Act
            let sut = await get(url);
            
            // Assert
            expect(sut).toContain(body);
        });


    });
});