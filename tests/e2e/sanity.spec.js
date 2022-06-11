const {  scrape, parse } = require('../../src/scrapa');

const dataUrls = {
    xml: 'https://raw.githubusercontent.com/LandRover/scrapa/master/tests/fixtures/books_list.xml',
    json: 'https://raw.githubusercontent.com/LandRover/scrapa/master/tests/fixtures/books_list.json',
    html: 'https://raw.githubusercontent.com/LandRover/scrapa/master/tests/fixtures/html_simple_list.html',
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

        it('When parsing an JSON document from github, then extract author, title fields only', async function () {
            // Act
            let body = await scrape({
                url,
                type: 'get',
            });

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
            expect(sut.fields[sut.fields.length-1].author).toBe('Galos, Mike');
            expect(sut.fields[sut.fields.length-1].title).toBe('Visual Studio 7: A Comprehensive Guide');
            expect(sut.fields[sut.fields.length-1].description).toBeUndefined();
        });


    });


    describe('Handle HTML', function () {
        let url = dataUrls.html;

        it('When parsing an HTML page from github, extract a UL element and return a list of drinks', async function () {
            // Act
            let body = await scrape({
                url,
                type: 'get',
            });

            let sut = await parse({
                body,
                type: 'html',
                fields: {
                    first: 'ul li.first',
                    third: 'ul li.third',
                },
            });
            
            // Assert
            
            expect(sut.total).toBe(1);
            expect(sut.total).toBe(sut.fields.length);
            expect(sut.fields[sut.fields.length-1].first).toBe('Coffee');
            expect(sut.fields[sut.fields.length-1].third).toBe('Milk');
            expect(sut.fields[sut.fields.length-1].second).toBeUndefined();
        });


    });


});