const fetch = require('node-fetch');
const regexp = /var data = (.*);/;
const NGRAM_ENDPOINT = 'https://books.google.com/ngrams/graph?';

async function fetchNgram(phrases) {
  const params = new URLSearchParams();
  let response, responseText, json, match;

  console.info(`Getting ngram phrases ("${phrases}")`);

  params.set('content', phrases.join(','));
  params.set('year_start', '1800');
  params.set('year_end', '2008');
  params.set('corpus', '15'); // English
  params.set('smoothing', '0');

  try {
    response = await fetch(`${NGRAM_ENDPOINT}${params.toString()}`);
    responseText = await response.text();
    match = regexp.exec(responseText);
    json = match[1];
  } catch (e) {
    return [{
      ngram: phrases.join(','),
      error: responseText
    }];
  }

  return JSON.parse(json);
}

module.exports = { fetchNgram };