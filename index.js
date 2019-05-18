require('dotenv').config();

require('./utils/dbConn');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const onMessage = require('./controllers/messege');
const handleFBVerification = require('./controllers/fb-verify');
const startWorker = require('./index-worker');

const PORT = process.env.PORT || 5000;

const app = express()
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(bodyParser.json());

app.listen(PORT, () => console.log('webhook is listening'));

// routes:
app.post('/webhook', onMessage);
app.get('/webhook', handleFBVerification);
app.get('/', (req, res) => res.render('pages/index'));

// background workers:
const { WORKER_INTERVAL } = process.env;
const timeInterval = 1000 * 60 * (WORKER_INTERVAL || 15); // 15 min
setInterval(startWorker, timeInterval);