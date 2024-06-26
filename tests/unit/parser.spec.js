import * as fs from 'fs';
import { parse } from '../../src/lib/parser/parse.js';

const readFixtureFile = filePath => fs.readFileSync(`./tests/fixtures/${filePath}`, 'utf8');


//
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
      
            let body = readFixtureFile('books_list.xml');

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

            let body = readFixtureFile('books_list.xml');

            // Act
            let sut = await parse({ type, body, fields });
            
            // Assert
            expect(sut.fields.length).toBeGreaterThan(12);
            expect(sut.fields[sut.fields.length-2].title).toBe('Visual Studio 7: A Comprehensive Guide');
        });


    });


    describe('Parsering CSV', function () {


        it('When parsing an CVS names response, should be able to behave as JSON and extract the first name', async function () {
            // Arrange
            let type = 'csv',
                fields = {
                    firstName: '{Iterator}.firstName',
                    lastName: '{Iterator}.lastName',
                    email: '{Iterator}.email',
                    age: '{Iterator}.age',
                    gender: '{Iterator}.gender',
                    birthday: '{Iterator}.birth',
                    zipCode: '{Iterator}.zip',
                    registered: '{Iterator}.registered',
                };
      
            let body = readFixtureFile('names_list.csv');

            // Act
            let sut = await parse({ type, body, fields });

            // Assert
            expect(sut.fields[0].firstName).toBe('William');
            expect(sut.fields[0].lastName).toBe('Phillips');
            expect(sut.fields[0].email).toBe('williamphillips@example.com');
            expect(sut.fields[0].gender).toBe('Male');
            expect(sut.fields[0].age).toBe(51);
            expect(sut.fields[0].age).toEqual(expect.any(Number))
            expect(sut.fields[0].birthday).toBe('05.01.1942');
            expect(sut.fields[0].zipCode).toBe(58944);
            expect(sut.fields[0].zipCode).toEqual(expect.any(Number))
            expect(sut.fields[0].registered).toEqual(expect.any(Boolean))
        });

        
        it('When parsing an CSV books response, should be able to extract all 12 books from an array via dynamic iterator and compare the last book in the array', async function () {
            // Arrange
            let type = 'csv',
                fields = {
                    firstName: '{Iterator}.firstName',
                    lastName: '{Iterator}.lastName',
                    email: '{Iterator}.email',
                    age: '{Iterator}.age',
                    gender: '{Iterator}.gender',
                    birthday: '{Iterator}.birth',
                    zipCode: '{Iterator}.zip',
                    registered: '{Iterator}.registered',
                };
      
            let body = readFixtureFile('names_list.csv');

            // Act
            let sut = await parse({ type, body, fields });
            
            // Assert
            expect(sut.fields.length).toBe(20);
            expect(sut.fields[sut.fields.length-1].firstName).toBe('Amelia');
        });


        it('When parsing an CSV with songs, should be able to extract all 10 songs from an array via dynamic iterator and compare the last song in the array', async function () {
            // Arrange
            let type = 'csv',
                fields = {
                    Rank: '{Iterator}.Rank',
                    Artist: '{Iterator}.Artist',
                    Title: '{Iterator}.Title',
                };
      
            let body = readFixtureFile('songs_list.csv');

            // Act
            let options = {
                    delimiter: {
                        field: ',',
                        wrap: '"',
                        eol: '\n',
                    },
                    regExp: new RegExp('\n\n(.*)', 's'),
            };
            let sut = await parse({ type, body, fields, options });
            
            // Assert
            expect(sut.fields.length).toBe(10);
            expect(sut.fields[sut.fields.length-1].Title).toBe('Time Itself');
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