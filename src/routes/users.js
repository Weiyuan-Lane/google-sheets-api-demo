'use strict';

const { google } = require('googleapis'); 
const sheets = google.sheets('v4');
const express = require('express');
const router = express.Router();
const path = require('path');
const getGoogleClient = require(path.resolve('src/auth/google-client'));

// This is the Sheet id, think of it as the "database name"
const sheetDatabaseName = process.env.USERS_SHEET_DATABASE_ID;

// The range can consist of the "table", or sheet used and the range.
// Only A and B (representing two columns) from the table are used
// A : email
// B : name
const usersModelRange = `'${process.env.USERS_SHEET_ID}'!A1:B`;
const sheetId = 0;

router.get('', async function(_, res) {
  const googleClient = await getGoogleClient();
  sheets.spreadsheets.values.get({
    auth: googleClient,
    spreadsheetId: sheetDatabaseName,
    range: usersModelRange,
  }, (err, apiRes) => {
    if (err) {
      console.error('The API returned an error.');
      return res.status(400).send(err);
    }

    const rows = apiRes.data.values || [];
    const rowsWithId = rows.map((element, idx) => {
      return {
        value: element,
        id: idx,
      }    
    });

    return res.render('pages/users/index', {
      rows: rowsWithId.reverse(),
    });
  });
});

router.post('', async function(req, res) {
  const googleClient = await getGoogleClient();
  const request = {
    spreadsheetId: sheetDatabaseName,
    range: usersModelRange,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [
        [req.body.email, req.body.name],
      ],
    },
    auth: googleClient,
  };

  sheets.spreadsheets.values.append(request, function() {
    return res.status(204).send('');
  });
});

router.delete('/:id', async function(req, res) {
  const googleClient = await getGoogleClient();
  const userId = parseInt(req.params.id);

  const request = {
    spreadsheetId: sheetDatabaseName,
    resource: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheetId,
            dimension: 'ROWS',
            startIndex: userId,
            endIndex: userId + 1,
          },
        },
      }],
    },
    auth: googleClient,
  };

  sheets.spreadsheets.batchUpdate(request, function() {
    return res.status(200).send(req.params.id);
  });
})

module.exports = router