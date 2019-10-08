/**
 * New York Times API
 * Article Search
 */

const NYT_BASE_URL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

const fetch = require('node-fetch');
const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:42.0) Gecko/20100101 Firefox/42.0',
};

class NYTimes {
  constructor({ apiKey }) {
    this.API_KEY = apiKey;
  }

  getOldestArticleIsoDate() {
    return false;
  }

  getNewestArticleIsoDate() {
    return false;
  }

  async queryJson({ keywords }) {
    console.info(`Looking up keywords ${keywords.join(' ')}.`);

    const NYT_QUERY_URL = `${NYT_BASE_URL}?api-key=${this.API_KEY}&fq=source:("The New York Times")&q=%22${keywords.join('+')}%22`;
    const response = await fetch(NYT_QUERY_URL, { headers });
    const responseJson = await response.json();

    if (response.status !== 200) {
      console.info(`Request to NYTimes API unsuccessful. Exiting with status code ${response.status}.`);
      process.exit();
    }

    return responseJson;
  }

  async getOldestArticleDate({ keywords }) {
    const NYT_QUERY_URL = `${NYT_BASE_URL}?api-key=${this.API_KEY}&fq=source:("The New York Times")&q=%22${keywords.join('+')}%22&sort=oldest&`;
    const response = await fetch(NYT_QUERY_URL, { headers });
    const responseJson = await response.json();

    if (response.status !== 200) {
      console.info(`Request to NYTimes API unsuccessful. Exiting with status code ${response.status}.`);
      process.exit();
    }

    return {
      oldestArticleDate: responseJson.response.docs.length
        ? responseJson.response.docs[0].pub_date : null
    };
  }
}

module.exports = NYTimes;
