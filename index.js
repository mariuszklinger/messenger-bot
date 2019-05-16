'use strict';

const PORT = process.env.PORT || 5000

const onPost = require('./controllers/messege');
const handleFBVerification = require('./controllers/fb-verify');

const
  path = require('path'),
  body_parser = require('body-parser'),
  express = require('express');

const app = express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .use(body_parser.json());

// Sets server port and logs message on success
app.listen(PORT, () => console.log('webhook is listening'));

app.post('/webhook', onPost);
app.get('/webhook', handleFBVerification);