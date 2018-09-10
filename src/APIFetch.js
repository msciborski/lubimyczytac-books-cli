const rp = require('request-promise');
const cherio = require('cherio');

const BASE_URL = 'http://lubimyczytac.pl/szukaj/ksiazki?phrase=';

const setupOptions = (method = 'GET', uri, queryStrings = {}) => ({
  uri,
  qs: queryStrings,
  method,
  transform: body => cherio.load(body),
});

const filterUrls = urls => urls.filter(url => url.match(/\/ksiazka\//));

const fetchBookUrlsForPhrase = phrase => rp(setupOptions('GET', BASE_URL, { phrase }))
  .then(($) => {
    const results = $('.books-list .bookTitle')
      .map((_, el) => $(el).attr('href')).get();
    return filterUrls(results);
  });

const fetchBookDetails = ($) => {
  const isbn = $('dd span[itemprop="isbn"]').text();
  const publishingDate = $('dd[itemprop="datePublished"]').attr('content');

  return {
    isbn,
    publishingDate,
  };
};

const fetchBook = url => rp(setupOptions('GET', url))
  .then(($) => {
    const title = $('h1[itemprop="name"] a').text();
    const author = $('.author-info-container a[itemprop="name"]').map((_, el) => $(el).text()).get().join(' ,');
    const bookDetails = fetchBookDetails($);
    return {
      title,
      author,
      isbn: bookDetails.isbn,
      publishingDate: bookDetails.publishingDate,
    };
  });

const getBooks = phrase => fetchBookUrlsForPhrase(phrase)
  .then((urls) => {
    const books = [];
    urls.forEach(url => books.push(Promise.resolve(fetchBook(url))));
    return books;
  });


module.exports.getBooks = getBooks;
