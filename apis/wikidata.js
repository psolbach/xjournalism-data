/**
 * Wikidata Search Query
 */

const fetch = require('node-fetch');

const WIKIDATA_API = 'https://www.wikidata.org/w/api.php?action=query&list=search&&format=json&srsearch=';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:42.0) Gecko/20100101 Firefox/42.0',
};

async function queryJson({ keywords }) {
  const response = await fetch(`${WIKIDATA_API}${keywords.join('+')}`, { headers });

  if (response.status !== 200) {
    console.info(`Request to Wikidata unsuccesful. Exiting with status code ${response.status}.`);
    process.exit();
  }

  const responseJson = await response.json();

  console.info(`Looking up keywords ${keywords.join(' ')}.`);

  return responseJson;
}

module.exports = {
  queryJson
};