const callSendAPI = require('../utils/facebook');
const User = require('../models/User');
const WatchRequest = require('../models/WatchRequest');

require('dotenv').config();
require('../utils/dbConn');

const MAX_URL = 3;

const isValidMessage = (msg) => {
  const URL_REGEXP = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  const MAX_KEYWORDS = 3;

  const [url, ...keywords] = msg.split(/\s+/);

  return (!URL_REGEXP.test(url) || !keywords || keywords.length > MAX_KEYWORDS);
};

const isUserExceedLimit =
  async psid => await WatchRequest.count({ psid }) > MAX_URL;

const getOrCreateUser = async (psid) => {
  const user = await (async () => User.findOne({ psid }))();

  if (user) {
    return user;
  }

  const newUser = new User({ psid });
  newUser.save();

  return newUser;
};

async function handleMessage(psid, receivedMessage) {
  const textMessage = receivedMessage.text;
  const response = {};

  if (!isValidMessage(textMessage)) {
    response.text = `Wrong format of message, please use:
      [url keyword1 keyword2 keyword3]
    `;
  } else if (isUserExceedLimit(psid)) {
    response.text = 'You have already exceed request limit';
  } else {
    const [url, ...keywords] = textMessage.split(/\s+/);
    const watchRequest = new WatchRequest({ psid, url, keywords });
    watchRequest.save();

    response.text = 'Request saved!';
  }

  // const user = await getOrCreateUser(psid);

  callSendAPI(psid, response);
}

// handleMessage(888, { text: '123' });

module.exports = {
  handleMessage,
  isValidMessage,
};
