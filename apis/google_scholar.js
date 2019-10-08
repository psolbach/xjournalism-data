/**
 * Google Scholar Helper
 * Scrape number of results for keywords
 */

const fetch = require('node-fetch');

const headers = {
  'User-Agent': `Googlebot/2.1`
};

// await to avoid Google reques throttling
async function queryHtml({ keywords }) {
  const response = await fetch(`https://scholar.google.de/scholar?hl=en&q=${keywords.join('+')}`, { headers });

  if (response.status !== 200) {
    console.info(`Request to Google Scholar unsuccesful. Exiting with status code ${response.status}.`);
    process.exit();
  }

  const responseText = await response.text();

  console.info(`Looking up keywords ${keywords.join(' ')}.`);

  return responseText;
}

function getNumHits({ html }) {
  const regexTags = /<div class="[^"]*?gs_ab_mdw[^"]*?">(.*?)<\/div>/g;
  const regexResults = /About (.*?) results/;

  const matchTags = html.match(regexTags);

  if (!matchTags || matchTags.length !== 2) {
    return matchTags;
  }

  const matchResults = matchTags[1].match(regexResults);
  const numHits = matchResults ? matchResults[1].replace(/,/g, '') : matchResults;

  console.info(`Found ${numHits} hits.`);

  return numHits;
}

module.exports = {
  queryHtml,
  getNumHits,
};