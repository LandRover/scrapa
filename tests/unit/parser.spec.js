let fs = require('fs');
const { parse } = require('../../src/lib/parser/parse');
//const mocks = require('./fixtures/http_mocks');

const readFixtureFile = filePath => fs.readFileSync(`./tests/unit/fixtures/${filePath}`, 'utf8');

// 'When no price is specified, then the product status is pending approval'
describe('Parser', function() {


    describe('Parsering HTML', function () {


        it('When extracting an H1 title from an HTML, then it should return the title', async function () {
            // Arrange
            let type = 'html',
                fields = {
                    title_is: 'h1',
                };
            let body = readFixtureFile('html_simple_list.html');

            // Act
            let sut = await parse({ type, body, fields });
            
            // Assert
            expect(sut.fields[0].title_is).toMatch('THIS IS A TITLE');
        });


        it('When extracting a news site, then it should extract all article properties and compare them', async function () {
            // Arrange
            let type = 'html',
                fields = {
                    title: '.news-item .title',
                    date: '.news-item .date',
                    author: '.news-item .author',
                    text: '.news-item .text',
                };

            let body = readFixtureFile('html_news_list.html');

            // Act
            let sut = await parse({ type, body, fields });
            
            // Assert
            expect(sut.fields[0].title).toBe('this is title 1');
            expect(sut.fields[0].date).toBe('01/01/2001');
            expect(sut.fields[0].author).toBe('Test01');
            expect(sut.fields[0].text).toBe('text text 01');
        });


        it('When extracting a news site, reverse the response array', async function () {
            // Arrange
            let type = 'html',
                fields = {
                    title: '.news-item .title',
                },
                options = {
                    reverse: true
                };

            let body = readFixtureFile('html_news_list.html');

            // Act
            let sut = await parse({ type, body, fields, options });

            // Assert
            expect(sut.fields[0].title).toBe('this is title 4');
        });


        it('When extracting a list of items, leave only the last element in the array', async function () {
            // Arrange
            let type = 'html',
                fields = {
                    title: '.news-item .title',
                },
                options = {
                    reverse: true,
                    limit: 1
                };

            let body = readFixtureFile('html_news_list.html');

            // Act
            let sut = await parse({ type, body, fields, options });

            // Assert
            expect(sut.fields[0].title).toBe('this is title 4');
            expect(sut.fields.length).toBe(1);
        });


    });


    describe('Parsering XML', function () {


        it('When parsing an XML books response, should be able to behave as JSON and extract the first book', async function () {
            // Arrange
            let type = 'xml',
                fields = {
                    title: 'catalog.book.0.title',
                    author: 'catalog.book.0.author',
                    price: 'catalog.book.0.price',
                };
      
            let body = readFixtureFile('xml_books_list.xml');

            // Act
            let sut = await parse({ type, body, fields });

            // Assert
            expect(sut.fields[0].title).toBe("XML Developer's Guide");
        });

        
        it('When parsing an XML books response, should be able to extract all 12 books from an array via dynamic iterator and compare the last book in the array', async function () {
            // Arrange
            let type = 'xml',
                fields = {
                    title: 'catalog.book.{Iterator}.title',
                    author: 'catalog.book.{Iterator}.author',
                    price: 'catalog.book.{Iterator}.price',
                };

            let body = readFixtureFile('xml_books_list.xml');

            // Act
            let sut = await parse({ type, body, fields });
            
            // Assert
            expect(sut.fields.length).toBe(12);
            expect(sut.fields[sut.fields.length-1].title).toBe('Visual Studio 7: A Comprehensive Guide');
        });


    });

    
    describe('Parsering JSON', function () {


        it("When parsing an JSON response, should be able to find the Google's first employee's name", async function () {
            // Arrange
            let type = 'json',
                fields = {
                    name_is: 'google.employees.0.name',
                };

            let body = {
                google: {
                    employees: [
                        { name: 'Larry Page' },
                        { name: 'Sergey Brin' },
                        { name: 'Craig Silverstein' },
                        { name: 'Heather Cairns' },
                        { name: 'Ray Sidney' }
                    ]
                }
            };

            // Act
            let sut = await parse({ type, body, fields });

            // Assert
            expect(sut.fields[0].name_is).toBe('Larry Page');
        });


        it('When parsing HTML, extract the JSON part using RegExp and parse internal articles', async function () {
            // Arrange
            let type = 'json',
                fields = {
                    author_is: 'news.articles.0.title',
                    date_is: 'news.articles.0.date',
                }, 
                options = {
                    regExp: new RegExp('AppData = \'(.*?)\';'),
                };
            
            let body = readFixtureFile('json_single_news_in_html.html');

            // Act
            let sut = await parse({ type, body, fields, options });

            // Assert
            expect(sut.fields[0].author_is).toMatch('this is title 1');
            expect(sut.fields[0].date_is).toMatch('01/01/2001');
        });


        describe('Dynamic iterator options', function () {
            //
            it("When parsing an JSON response with iterator in mid object xxx.yyy.{Iterator}.prop, should be able to get all google employees, find the last one's name", async function () {
                // Arrange
                let type = 'json',
                    fields = {
                        name_is: 'google.employees.{Iterator}.name',
                    };

                let body = {
                    google: {
                        employees: [
                            { name: 'Larry Page' },
                            { name: 'Sergey Brin' },
                            { name: 'Craig Silverstein' },
                            { name: 'Heather Cairns' },
                            { name: 'Ray Sidney' }
                        ]
                    }
                };

                // Act
                let sut = await parse({ type, body, fields });

                // Assert
                expect(sut.fields.length).toBe(5);
                expect(sut.fields[sut.fields.length - 1].name_is).toBe('Ray Sidney');
            });


            it("When parsing an JSON response with iterator in mid object {Iterator}.prop, should be able to get all google employees, find the second's name", async function () {
                // Arrange
                let type = 'json',
                    fields = {
                        name_is: '{Iterator}.name',
                    };

                let body = [
                            { name: 'Larry Page' },
                            { name: 'Sergey Brin' },
                            { name: 'Craig Silverstein' },
                            { name: 'Heather Cairns' },
                            { name: 'Ray Sidney' }
                        ];
                // Act
                let sut = await parse({ type, body, fields });

                // Assert
                expect(sut.fields.length).toBe(5);
                expect(sut.fields[1].name_is).toBe('Sergey Brin');
            });


            //
            it("When parsing an JSON response with iterator in suffix of an object xxx.yyy.{Iterator}, should be able to get all google employees, find the third's name", async function () {
                // Arrange
                let type = 'json',
                    fields = {
                        name_is: 'google.employees.{Iterator}',
                    };

                let body = {
                    google: {
                        employees: [
                            'Larry Page',
                            'Sergey Brin',
                            'Craig Silverstein',
                            'Heather Cairns',
                            'Ray Sidney'
                        ]
                    }
                };

                // Act
                let sut = await parse({ type, body, fields });

                // Assert
                expect(sut.fields.length).toBe(5);
                expect(sut.fields[2].name_is).toBe('Craig Silverstein');
            });

        });
    });

});