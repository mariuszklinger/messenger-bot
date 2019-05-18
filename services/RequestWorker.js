require('dotenv').config();

const db = require('../utils/dbConn');
const WatchRequestModel = require('../models/WatchRequest');
const { checkURLforKeywords } = require('../utils/parser');
const callSendAPI = require('../utils/facebook');

const args = process.argv;

if (!args.length) {
  console.log('Not enough arguments');
  process.exit(1);
}

async function init() {
  const [node, filepath, offset, limit] = args;

  console.log(`Offset: ${offset}, elements: ${limit}`);

  const requests = await WatchRequestModel.find({})
    .limit(+limit)
    .skip(+offset)
    .exec();

  if (!requests.length) {
    console.log('No requests in DB');
    process.exit(0);
  }

  do {
    const request = requests.pop();
    const { url, psid, keywords } = request;
    const keywordsPresent = await checkURLforKeywords(url, keywords); // eslint-disable-line

    const response = {
      text: `Page: \`${url}\` has included some of keywords *${request.keywords}*`,
    };

    if (keywordsPresent) {
      callSendAPI(psid, response);
    }
  }
  while (requests.length);

  console.log('All request processed');
  process.exit(0);
}

db.once('open', init);
