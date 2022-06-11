const {  scrape, parse } = require('../../src/scrapa');

const dataUrls = {
    xml: 'https://raw.githubusercontent.com/LandRover/scrapa/master/tests/fixtures/books_list.xml',
    json: 'https://raw.githubusercontent.com/LandRover/scrapa/master/tests/fixtures/books_list.json',
    html: 'https://www.w3schools.com/js/js_json_parse.asp',
};

// 'When no price is specified, then the product status is pending approval'
describe('Sanity', function() {


    describe('Handle XML', function () {
        let url = dataUrls.xml;

        it('When parsing an XML from a book store, then extract "author" and "title" from the XML fetched', async function () {
            // Act
            let body = await scrape({
                url,
                type: 'get',
            });

            let sut = await parse({
                body,
                type: 'xml',
                fields: {
                    author: 'catalog.book.{Iterator}.author',
                    title: 'catalog.book.{Iterator}.title'
                },
            });
            
            // Assert
            expect(sut.total).toBe(12);
            expect(sut.total).toBe(sut.fields.length);
            expect(sut.fields[0].author).toBe('Gambardella, Matthew');
            expect(sut.fields[0].title).toBe("XML Developer's Guide");
            expect(sut.fields[0].description).toBeUndefined();
        });


    });


    describe('Handle JSON', function () {
        let url = dataUrls.json;

        it('When parsing an JSON user from github, then extract name, age, list and pets from seed url', async function () {
            // Act
            let body = await scrape({
                url,
                type: 'get',
            });

            console.log(['body', '"'+body+'"']);

            let sut = await parse({
                body,
                type: 'json',
                fields: {
                    author: 'catalog.book.{Iterator}.author',
                    title: 'catalog.book.{Iterator}.title'
                },
            });
            
            // Assert
            
            expect(sut.total).toBe(12);
            expect(sut.total).toBe(sut.fields.length);
            expect(sut.fields[0].author).toBe('Gambardella, Matthew');
            expect(sut.fields[0].title).toBe("XML Developer's Guide");
            expect(sut.fields[0].description).toBeUndefined();
        });


    }); 
});