const callSendAPI = require('../utils/facebook');

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
  });

  res
    .status(200)
    .send('EVENT_RECEIVED');
};

function handleMessage(sender_psid, received_message) {
  const isTextMessage = received_message.text;
  const response = {
    test: isTextMessage ? `Your request ${received_message.text} is saved`: 'Something went wrong...',
  };

  if (isTextMessage) {
    setTimeout(() => callSendAPI(sender_psid, {
      text: `Surprise! (Response to: ${received_message.text}`
    }), 60000);
  }

  callSendAPI(sender_psid, response);
}

module.exports = onNewMessage;