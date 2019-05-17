const http = require('http');
const https = require('https');

function getPage(url) {
  return new Promise((resolve, reject) => {
    const isURLHttps = url.toString().indexOf('https') === 0;
    const client = isURLHttps ? https : http;

    client.get(url, (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function checkForKeywords(pageSource, ...keywords) {
  const rows = pageSource.split('\n');

  if (!rows.length) {
    return false;
  }

  const isRowContainAnyKeyword = row => keywords
    .some(word => row.includes(word));

  return rows.some(isRowContainAnyKeyword);
}

async function checkURLforKeywords(url, keywords) {
  const src = await getPage(url);
  return checkForKeywords(src, keywords);
}

module.exports = {
  getPage,
  checkForKeywords,
  checkURLforKeywords,
};
