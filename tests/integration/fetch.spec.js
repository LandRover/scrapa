import { get } from '../../src/lib/http/fetch.js';
const url = 'https://agilemanifesto.org';

// 'When no price is specified, then the product status is pending approval'
describe('Fetch', function() {


    describe('fetching remote page', function () {


        it('When making an HTTP call to AgileManifesto, should retrieve a valid Manifesto page', async function () {
            let body = 'Manifesto for Agile Software Development';

            // Act
            let sut = await get(url);
            
            // Assert
            expect(sut).toContain(body);
        });


    });
});