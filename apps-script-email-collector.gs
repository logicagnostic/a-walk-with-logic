/**
 * A WALK WITH LOGIC — email collector backend
 *
 * SETUP (one-time):
 * 1. Go to sheets.google.com, create a new blank Sheet. Name it whatever you like
 *    (e.g. "AWWL email list"). In row 1, add a header: "email" in A1, "timestamp" in B1.
 * 2. In that Sheet, go to Extensions > Apps Script.
 * 3. Delete any starter code in the editor, and paste this entire file in its place.
 * 4. Click Deploy > New deployment.
 *    - Click the gear icon next to "Select type" and choose "Web app".
 *    - Description: anything (e.g. "email collector").
 *    - Execute as: "Me".
 *    - Who has access: "Anyone" (this allows your public site to submit to it;
 *      it does NOT give access to your Sheet itself, only to this one submit action).
 * 5. Click Deploy. Google will ask you to authorize permissions — approve it
 *    (it's your own script, running under your own account).
 * 6. Copy the "Web app URL" it gives you — this is what goes into hugo.yaml as
 *    apps_script_url.
 *
 * That's it — no other setup needed. This script only ever writes new rows;
 * it never reads or sends anything.
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  try {
    var data = JSON.parse(e.postData.contents);
    var email = (data.email || "").trim();

    // Basic sanity check — reject empty or obviously invalid submissions
    if (!email || email.indexOf("@") === -1) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "invalid email" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([email, new Date()]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
