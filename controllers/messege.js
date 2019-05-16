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
    const { sender_psid, message } = webhook_event;

    if (message) {
      ENABLE_LOGS && console.log(`[MESSAGE] ${message}`);
      handleMessage(sender_psid, message);
    }
  });

  res
    .status(200)
    .send('EVENT_RECEIVED');
};

function handleMessage(sender_psid, received_message) {
  let response;

  const isTextMessage = received_message.text;

  // Checks if the message contains text
  if (isTextMessage) {
    response = {
      'text': `Thanks for the message: ${received_message.text}, prepare for surprise soon!`,
    }

    setTimeout(() => callSendAPI(sender_psid, {
      text: 'Surprise!'
    }), 60000);

  } else {
      response = {
        'text': 'Got nothing :('
      };
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}



module.exports = onNewMessage;