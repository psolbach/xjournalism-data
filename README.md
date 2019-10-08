## xJournalism Data Queries
Data collection on our glossary of journalism terms via various sources e.g.   
Times API, Wikidata, Google Scholar, Google nGrams, Ebsco.
  
https://xjournalism.org/de

### Prerequisites

1. Node 8.10+
4. GCP Service Account
5. Enabled Sheets API

### Develop
```bash
npm i # install deps
touch {service_account}.json # add gcp credentials
node index.js
```    

### Exploration
Google Scholar does not allow sorting results reverse-chronologically, is unsuited to get results over time. Google Scholar also employs aggressive rate-limiting, making it relatively unwieldy to scrape. Wikidata API returns subject ids in the form of e.g. **Q4518252** (Churnalism). These ids are hit-and-miss, often having a seemingly random correlation with the queried keywords.

### Todo
- [x] Add Wikidata Query Hits
- [x] Add NYTimes Search API Metadata
- [x] NYTimes Oldest Article Dates
- [x] Move to sanitized, denormalized keys/uids

### Author
Paul Solbach, Leibniz HBI  
<p.solbach@leibniz-hbi.de>
