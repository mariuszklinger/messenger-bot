const callSendAPI = require('../utils/facebook');
const { getPage, checkForKeywords } = require('../utils/parser');

const { ENABLE_LOGS } = process.env;

function onNewMessage (req, res) {
  const { body } = req;
  if (body.object !== 'page') {
    res.sendStatus(404);
  }

  // Check the webhook event is from a Page subscription
  body.entry.forEach(function(entry) {

    const webhook_event = entry.messaging[0];
    const { sender: { id: psid }, message } = webhook_event;

    if (message) {
      handleMessage(psid, message);
    }
    else {
      ENABLE_LOGS && console.log(`[EVENT] `, webhook_event);
    }
  });

  res
    .status(200)
    .send('EVENT_RECEIVED');
};

async function handleMessage(sender_psid, received_message) {
  const isTextMessage = received_message.text;
  const response = {
    text: isTextMessage ? `Your request "${received_message.text}" is saved`: 'Something went wrong...',
  };

  const [ url, keyword ] = received_message.text.split(' ');

  const src = await getPage(url);
  console.log(checkForKeywords(src, keyword));

  if (isTextMessage) {
    setTimeout(() => callSendAPI(sender_psid, {
      text: `Surprise! (Response to: ${received_message.text})`
    }), 60000);
  }

  callSendAPI(sender_psid, response);
}

module.exports = onNewMessage;