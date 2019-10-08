/**
 * xJournalism data
 * Get current dataset via Google Spreadsheets
 * Scrape various data sources, APIs
 */
require('dotenv').config();

const fs = require('fs');
const Spreadsheets = require('./apis/google_spreadsheets');
const Scholar = require('./apis/google_scholar');
const Ngrams = require('./apis/google_ngrams');
const Wikidata = require('./apis/wikidata');
const NYTimes = require('./apis/nytimes');

const spreadsheetId = '17VmqjUpKj7t6SWV0Xl_Cm3xp0Mdb0Et8_OVcWEg2aX0';
const range = 'xjournalism!B2:B';

const filenames = {
  gscholar_api_hits: './data/api_hits/gscholar_num_hits.json',
  wikidata_api_hits: './data/api_hits/wikidata_num_hits.json',
  ngram_api_hits: './data/api_hits/ngram_num_hits.json',
  nyt_api_oldest: './data/nyt_oldest.json',
};

// Prevent rate-limiting, blacklisting
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Random ms timing
const random = ({ min, max }) => Math.floor((Math.random() * (max - min) + min) * 1000);

// Fail-safe append to file
const fileStreamHandler = {
  getStream: filename => fs.createWriteStream(filename, { flags: 'a' })
};

// Scrape Google Books Batches
async function getNgramBatches() {
  const terms = await Spreadsheets.get({ spreadsheetId, range });
  const stream = fileStreamHandler.getStream(filenames.ngram_data);

  for (var i = 0; i <= terms.length; i = i + 5) {
    const batch = terms.slice(i, i + 5);
    const ngramBatch = batch.map(term => `${term} Journalism`);
    const nGramData = await Ngrams.fetchNgram(ngramBatch);

    await sleep(random);
    stream.write(JSON.stringify(nGramData) + '\n');
  }

  stream.end();
}

// Scrape Google Books individually
async function getSingleNgram() {
  const terms = await Spreadsheets.get({ spreadsheetId, range });
  const stream = fileStreamHandler.getStream(filenames.ngram_data);

  for (var i = 0; i <= terms.length - 1; i++) {
    const ngram = [`${terms[i]} Journalism`];
    const nGramData = await Ngrams.fetchNgram(ngram);

    stream.write(JSON.stringify(nGramData) + '\n');
    await sleep(random({ min: 35, max: 65}));
  }

  stream.end();
}

async function getGoogleScholarHits() {
  const terms = await Spreadsheets.get({ spreadsheetId, range });
  const stream = fileStreamHandler.getStream(filenames.gscholar_data);

  for (var i = 0; i <= terms.length - 1; i++) {
    const keywords = [terms[i], 'Journalism'];
    const htmlResult = await Scholar.queryHtml({ keywords });
    const numHits = Scholar.getNumHits({ html: htmlResult });

    stream.write(JSON.stringify({
      term: keywords.join(' '),
      numHits: numHits
    }) + '\n');

    await sleep(random({ min: 35, max: 65}));
  }

  stream.end();
}


async function getWikidataHits() {
  const terms = await Spreadsheets.get({ spreadsheetId, range });
  const stream = fileStreamHandler.getStream(filenames.wikidata_data);

  for (var i = 0; i <= terms.length - 1; i++) {
    const keywords = [terms[i], 'Journalism'];
    const jsonResult = await Wikidata.queryJson({ keywords });
    const numHits = jsonResult.query.searchinfo.totalhits;

    stream.write(JSON.stringify({
      term: keywords.join(' '),
      numHits: numHits
    }) + '\n');

    await sleep(random({ min: 35, max: 65 }));
  }

  stream.end();
}

async function getNytApiResult() {
  const terms = await Spreadsheets.get({ spreadsheetId, range });

  for (var i = 30; i <= terms.length - 1; i++) {
    const keywords = [terms[i], 'Journalism'];
    const times = new NYTimes({ apiKey: process.env.NYT_API_KEY });
    const jsonResult = await times.queryJson({ keywords });

    fs.writeFile(`./data/nyt_individual_terms/${keywords.join('+').replace('/', '\/').toLowerCase()}.json`,
      JSON.stringify(jsonResult), { flag: 'w' }, err => {
        if (err) {
          return console.info(err);
        }
      });

    await sleep(random({ min: 6, max: 6 }));
  }
}


async function getNytOldestArticleDates() {
  const terms = await Spreadsheets.get({ spreadsheetId, range });
  const stream = fileStreamHandler.getStream(filenames.nyt_api_oldest);

  for (var i = 0; i <= terms.length - 1; i++) {
    const keywords = terms[i];
    const times = new NYTimes({ apiKey: process.env.NYT_API_KEY });
    const result = await times.getOldestArticleDate({ keywords });

    console.info(result);

    stream.write(JSON.stringify({
      term: keywords,
      oldestArticleDate: result
    }) + '\n');

    await sleep(random({ min: 6, max: 6 }));
  }
}

getNytOldestArticleDates();

exports = {
  getGoogleScholarHits,
  getNgramBatches,
  getNytApiResult,
  getSingleNgram,
  getWikidataHits,
};
