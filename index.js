require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const onMessage = require('./controllers/messege');
const handleFBVerification = require('./controllers/fb-verify');

const PORT = process.env.PORT || 5000;
const app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .use(bodyParser.json());

app.listen(PORT, () => console.log('webhook is listening'));

app.post('/webhook', onMessage);
app.get('/webhook', handleFBVerification);

require('./index-worker');
require('./utils/dbConn');
