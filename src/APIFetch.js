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

const fetchBookUrls = ($) => {
  const results = $('.books-list .bookTitle')
    .map((_, el) => $(el).attr('href')).get();
  return filterUrls(results);
};

const fetchNextPageUrl = ($) => {
  const nextPageUrl = $('.pager-default li.next-page a').attr('href');
  return nextPageUrl === '#' ? null : nextPageUrl;
};

const fetchPrevPageUrl = ($) => {
  const prevPageUrl = $('.pager-default li.prev-page a').attr('href');
  return prevPageUrl === '#' ? null : prevPageUrl;
};

const fetchBookUrlsForPhrase = async (phrase) => {
  const $ = await rp(setupOptions('GET', BASE_URL, { phrase }));
  const bookUrls = fetchBookUrls($);
  const nextPageUrl = fetchNextPageUrl($);
  const prevPageUrl = fetchPrevPageUrl($);
  return {
    books: bookUrls,
    prevPageUrl,
    nextPageUrl,
  };
};

const fetchBookDetails = ($) => {
  const isbn = $('dd span[itemprop="isbn"]').text();
  const publishingDate = $('dd[itemprop="datePublished"]').attr('content');

  return {
    isbn,
    publishingDate,
  };
};

const fetchBook = async (url) => {
  const $ = await rp(setupOptions('GET', url));

  let title = $('h1[itemprop="name"] a').text();
  if (title === '') {
    title = $('h1[itemprop="name"]').text();
  }

  const author = $('.author-info-container a[itemprop="name"]').map((_, el) => $(el).text()).get().join(' ,');
  const bookDetails = fetchBookDetails($);
  return {
    title,
    author,
    isbn: bookDetails.isbn,
    publishingDate: bookDetails.publishingDate,
  };
};

const getBooks = async (phrase) => {
  const urls = await fetchBookUrlsForPhrase(phrase);
  const booksPromises = urls.books.map(book => fetchBook(book));

  const books = await Promise.all(booksPromises);
  return {
    books,
    nextPageUrl: urls.nextPageUrl,
    prevPageUrl: urls.prevPageUrl,
  };
};

module.exports.getBooks = getBooks;
