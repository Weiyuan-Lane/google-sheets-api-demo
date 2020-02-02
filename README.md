# google-sheets-api-demo for node

I created this as a way to explore with Google Sheets API, with a service account (to support another exploratory effort on backend related syncing with sheets). The requisites of running this project will be explained in the following.

This demo shows a simple application of node API for google sheets, and being able to read, write, and delete entities.

## Setup

1. Install NPM
2. Clone this project
3. Run `npm i` from the root of this project
4. Create a GCP project [here](https://console.cloud.google.com/projectcreate)
5. Enable Google Sheets API for the newly created project [here](https://console.cloud.google.com/apis/library/sheets.googleapis.com)
6. Create a service account for your project [here](https://console.cloud.google.com/iam-admin/serviceaccounts), and download the credentials indicated at the end of the setup process. Save this file in the `.tmp` hidden folder, or a separate location as long as you add the location in `.gitignore`
7. Create a new Google Sheet (private or public will both work with this demo)
8. Invite the service account above to this new sheet, with write access.
9. Copy `env.sample` to `.env`, and fill in the missing entries.
   1.  GOOGLE_APPLICATION_CREDENTIALS - location of service account credentials file from the end of step 6
   2.  GOOGLE_PROJECT - project id from the end of step 4
   3.  USERS_SHEET_DATABASE_ID - google sheet id from end of step 7. I found the id directly from the URL when accessing the sheet.
   4.  USERS_SHEET_ID - name of the active sheet that will act as your "users" table.

