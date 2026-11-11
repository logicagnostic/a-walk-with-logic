/**
 * A WALK WITH LOGIC: audio plays collector
 *
 * This is a standalone Apps Script project. It writes to its own spreadsheet
 * ("AWWL audio plays"), separate from the email list and from Logic Agnostic
 * MGMT. It only ever adds rows to the "audio plays" tab. It never reads or
 * sends anything.
 *
 * Each row: date (Pacific), post (audio file name), milestone, where.
 * No cookies, no visitor IDs, no IP addresses, no device or location.
 */

var SPREADSHEET_ID = "16giGSdzXkbpcNlN7aYiiwpKzTcM9Oolcoj39lu3qlB0";
var SHEET_NAME = "audio plays";
var MILESTONES = ["play", "25", "50", "75", "finished"];
var PLACES = ["post page", "home page"];
var FILE_PATTERN = /^[a-z0-9-]{1,100}\.mp3$/;

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var post = String(data.post || "");
    var milestone = String(data.milestone || "");
    var where = String(data.where || "");

    if (!FILE_PATTERN.test(post) || MILESTONES.indexOf(milestone) === -1 || PLACES.indexOf(where) === -1) {
      return respond("error");
    }

    var date = Utilities.formatDate(new Date(), "America/Los_Angeles", "yyyy-MM-dd");
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    sheet.appendRow([date, post, milestone, where]);

    return respond("ok");
  } catch (err) {
    return respond("error");
  }
}

function respond(status) {
  return ContentService.createTextOutput(JSON.stringify({ status: status }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test without visiting the site: select testAudioPlay in the toolbar and
 * click Run. One row marked "test" should appear in the audio plays tab.
 * Delete that row afterward.
 */
function testAudioPlay() {
  var fake = { postData: { contents: JSON.stringify({ post: "test.mp3", milestone: "play", where: "post page" }) } };
  var result = doPost(fake).getContent();
  Logger.log(result);
}
