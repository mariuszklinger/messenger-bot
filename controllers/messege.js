const { handleMessage } = require('../utils/messageHandler');

function onNewMessage(req, res) {
  const { body } = req;
  if (body.object !== 'page') {
    res.sendStatus(404);
  }

  // Check the webhook event is from a Page subscription
  body.entry.forEach((entry) => {
    const webhookEvent = entry.messaging[0];
    const { sender: { id: psid }, message } = webhookEvent;

    if (message) {
      handleMessage(psid, message);
    }
  });

  res
    .status(200)
    .send('EVENT_RECEIVED');
}

module.exports = onNewMessage;
