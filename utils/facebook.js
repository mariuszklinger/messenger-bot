const request = require('request');

const { ENABLE_LOGS } = process.env;

function callSendAPI(sender_psid, response) {
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

  const request_body = {
    'recipient': {
      'id': sender_psid,
    },
    'message': response,
  };

  ENABLE_LOGS && console.log(`[RESPONSE] ${request_body}`);

  // Send the HTTP request to the Messenger Platform
  request({
    'uri': 'https://graph.facebook.com/v2.6/me/messages',
    'qs': {
      'access_token': PAGE_ACCESS_TOKEN,
    },
    'method': 'POST',
    'json': request_body,
  }, (err, res, body) => {
    if (!err) {
      console.log('[SUCCESS] ', res);
    } else {
      console.error('Unable to send message:' + err);
    }
  });
}

module.exports = callSendAPI;