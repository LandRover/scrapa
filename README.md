# Scrapa
Yet another Node 'web Scraper', converting HTML, XML and JSON structures to proper JSON objects.

## About the project

Scrapa uses 2 phases to process requests, both phases are separated and can be used apart from each other.
`parse` can be used without `scrape` and vice versa.

### 1. Scrape

`scrape` - Makes the HTTP request, fetches the page and also able to select a specific part of the page, for example, find a JSON string using a RegExp.

Scrape phase has 2 types for processing requests, both will yield plain response as a string.
 1. `get` - simple fetch
 2. `headless` - headless browser, to process dynamic applications like React that has complex Javascript rendering.

You also can use this library to get remote content without the parse phase.

#### Example for scraping Yahoo via headless browser.

```js
const { scrape } = require('scrapa');

scrape({ url: 'https://news.yahoo.com', type: 'headless' })
.then(body => console.debug(body))
```

### 2. Parse

`parse` - Parse is able to handle 3 types of inputs [HTML, XML, JSON] and convert them to a unified, easily consumed format.

### Anonymity

All requests currently sent with a basic hardcoded user agent `Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1`

Headless browser sends the same useragent.


## Setup

```sh
# npm
npm install --save scrapa
```


## Example

Extract the title of Yahoo website located in <head><title>Yahoo News<title/></head>

```js
const { scrape, parse } = require('scrapa');

// Promise
scrape({url: 'https://news.yahoo.com'})
.then(body => parse({body, fields: {
    title_now_is: 'head > title'}
}))
.then(parsed => console.info(parsed))
```

```js
{
  total: 1,
  fields: [
    { title_now_is: 'Yahoo News - Latest News & Headlines' }
  ]
}
```

Extract top 3 items from Yahoo News

```js
const { scrape, parse } = require('scrapa');

// Promise
scrape({url: 'https://news.yahoo.com'})
.then(body => parse({body, fields: {
    article_title: '.js-stream-content ul li h3'}
}))
.then(parsed => console.info(parsed))
```

```js
{
  total: 3,
  fields: [
    { article_title: 'COVID-affected tenants face eviction despite CDC ban' },
    { article_title: 'Cayman Islands jails U.S. student in COVID case' },
    { article_title: "Fla. scientist vows to speak COVID-19 'truth to power'" }
  ]
}
```


Extracting links from Yahoo, finding the JSON part (root.App.main), and using it instead of HTML parsing.
```js
const { scrape, parse } = require('scrapa');

scrape({
    url: 'https://news.yahoo.com',
    regExp: [new RegExp('root\.App\.main = (.*?);\n.*\}\\(this\\)\\);', 'gm')],
})
.then(body => parse({ 
    body,
    type: 'json',
    fields: { href: 'context.dispatcher.stores.PageStore.pageData.links.{Iterator}.href'},
    options: {
        
    },
})).then(parsed => console.log(parsed));
```
```js
{
  total: 23,
  fields: [
    { href: '//s.yimg.com' },
    { href: '//mbp.yimg.com' },
    ...
    { href: 'https://s.yimg.com/cv/apiv2/default/fp/20180826/icons/favicon_y19_32x32.ico' },
    { href: 'https://news.yahoo.com/' }
  ]
}
```

## Documentation and Usage
### `scrape({url, type='get|headless', regExp = []})`
Simple Scraper

#### Params

- **String** `url`: The page url or request options.
- **String** `type`: The type of scrape required, two options: 1. `get` - simple get operation via 'fetch' 2. `headless` for a full browser for Javascript heavy application that post render on a browser.
- **Array** `regExp`: Array of RegExp instances to clean the output, useful before passing to `parse`.

#### Return
- **Promise** Resolving with:
  - `body` (String): Scrapped raw body


### `parse({ body, type = 'html', fields = {}, options = {} })`
Parses finds the `fields` and extracts the data formatted in the output under the same field's name.

`parse` uses 3 input types
#### Type Options:

`html` - Using Cheeerio as a query selector. Fields should contain CSS style selectors to get find the data. All CSS Cheeerio selectors are valid. Example usage: {fields: {page_title: 'head > title'}} - The following will populate on the output the field `page_title` with the page's title.
Currently it takes all the .innerHTML from the selectors and populate them as output.

```js
const { parse } = require('scrapa');

parse({body, type: 'html', fields: {
    page_title: 'head > title'}
}))
.then(parsed => console.debug(parsed))
```

`json` - Fields should be mapped as you would regularly read from JSON with DOT notation (store.books.0.title). 

Array, should be accessed via DOT too, instead of [] as in the example.

Another operator used for objects containing many rows, for getting all objects, special operator should be used: {Iterator} instead of the number. This number will be replaced on runtime and process all items in the array.

Other than these, properties should behave as a regular JSON array address.

```js
const { parse } = require('scrapa');

parse({body, type: 'json', fields: {
    books_title: 'store.books.0.title'},
    books_price: 'store.books.{Iterator}.title'},
}))
.then(parsed => console.debug(parsed))
```

`xml` - Converts XML input to JSON. All syntax should be similar to JSON

:bulb: **More**: More examples can be found in the unit tests folder.


#### Params
- **String/Object** `body`: Input body to parse
- **String** `type`: The of `body` - 'html' or 'json' or 'xml'
- **Object** `fields`: Key/Value pairs of parsing properties according to the `type`. Examples above.
- **Object** `options`: Settings property to configure the parsing process and alter the output.
   - `limit` (Number): Splices the object to the desired amount.
   - `reverse` (Boolean): Reverses the output

#### Return
- **Promise** Resolving with:
  - `total` (Number): Amount of elements found.
  - `fields` (Array): Array of input `fields`, according to the `key` passed to `parse`


## TODO
- Debug output
- Status code responses
- Add referrer, parse automatically from the request URL
- Randomize useragent.
- Inject logger
- Parse tranfsormation, forexample parse date str to `Date` object.

