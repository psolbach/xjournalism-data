const { google } = require('googleapis');
const service_account = require('../leibniz-hbi-20ead2b90c9a.json');

// configure a JWT auth client
const jwtClient = new google.auth.JWT(
  service_account.client_email,
  null,
  service_account.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

// authenticate request
jwtClient.authorize((err, tokens) => {
  if (err) {
    console.warn(err);
    process.exit(1);
  }

  console.info('Connected to Google Spreadsheets.');
});

function get({ spreadsheetId, range }) {
  const sheets = google.sheets('v4');

  return new Promise((resolve, reject) => {
    const auth = jwtClient;

    // e.g. range: 'Class Data!A2:E',
    sheets.spreadsheets.values.get({ auth, spreadsheetId, range }, (err, res) => {
      if (err || !res) {
        reject(`The API returned an error or range is empty: ${err}`);
        return;
      }

      resolve(res.data.values);
    });
  });
}

module.exports = {
  get
};
