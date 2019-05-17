const callSendAPI = require('../utils/facebook');
const WatchRequest = require('../models/WatchRequest');

require('dotenv').config();
require('../utils/dbConn');

const MAX_URL = 3;

const isValidMessage = (msg) => {
  const URL_REGEXP = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  const MAX_KEYWORDS = 3;

  const [url, ...keywords] = msg.split(/\s+/);

  return URL_REGEXP.test(url) && keywords && keywords.length > MAX_KEYWORDS;
};

const isUserExceedLimit = psid => new Promise((resolve) => {
  WatchRequest.countDocuments({ psid }, (err, count) => {
    resolve(count > MAX_URL);
  });
});

async function handleMessage(psid, receivedMessage) {
  const textMessage = receivedMessage.text;
  const response = {};

  if (!isValidMessage(textMessage)) {
    response.text = `Wrong format of message, please use:
      \`[url keyword1 keyword2 keyword3]\`
    `;
    return callSendAPI(psid, response);
  }

  if (await isUserExceedLimit(psid)) {
    response.text = 'You have already exceed request limit';
    return callSendAPI(psid, response);
  }

  const [url, ...keywords] = textMessage.split(/\s+/);
  const watchRequest = new WatchRequest({ psid, url, keywords });
  watchRequest.save();

  response.text = 'Request saved, we will keep in the loop!';

  return callSendAPI(psid, response);
}

module.exports = {
  handleMessage,
  isValidMessage,
};
