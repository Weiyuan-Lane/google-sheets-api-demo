'use strict';

require('dotenv').config();
const bodyParser = require('body-parser');
const { google } = require('googleapis'); 
const sheets = google.sheets('v4');
const express = require('express');
const path = require('path');
const getGoogleClient = require(path.resolve('src/auth/google-client'));
const app = express();

const usersRouter = require(path.resolve('src/routes/users'));

app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use('/users', usersRouter);

app.get('', function(_, res) {
  res.redirect('/users');
})

app.get('/docs/:id/sheets/:sheetName/range/:range', async function(req, res) {
  const googleClient = await getGoogleClient();
  sheets.spreadsheets.values.get({
    auth: googleClient,
    spreadsheetId: req.params.id,
    range: `${req.params.sheetName}!${req.params.range}`,
  }, (err, apiRes) => {
    if (err) {
      console.error('The API returned an error.');
      return res.status(400).json(err);
    }
    const rows = apiRes.data.values || [];
    return res.json(rows);
  });
});

app.listen(3000);