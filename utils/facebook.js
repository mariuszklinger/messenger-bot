const request = require('request');

function callSendAPI(psid, response) {
  const { PAGE_ACCESS_TOKEN } = process.env;

  const requestBody = {
    recipient: {
      id: psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: PAGE_ACCESS_TOKEN,
    },
    method: 'POST',
    json: requestBody,
  }, (err, res, body) => {
    if (!err) {
      console.log('[SUCCESS]');
    } else {
      console.error(`Unable to send message: ${err}`);
    }
  });
}

module.exports = callSendAPI;
