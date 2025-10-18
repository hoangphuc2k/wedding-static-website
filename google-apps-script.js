/**
 * Google Apps Script for Wedding Wishes Form Integration
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet with these column headers in row 1:
 *    Timestamp | Name | Message
 *
 * 2. Go to Extensions → Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click "Deploy" → "New deployment"
 * 5. Select type: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone"
 * 8. Click "Deploy"
 * 9. Copy the Web App URL
 * 10. Paste the URL into script.js as GOOGLE_SCRIPT_URL value
 */

// Configuration - Replace with your sheet name if different
const SHEET_NAME = 'messages';

/**
 * Handle POST requests from the wedding website form
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Validate required fields
    if (!data.name || !data.message) {
      return createResponse(false, 'Thiếu thông tin bắt buộc');
    }

    // Sanitize input data
    const name = String(data.name).trim().substring(0, 200);
    const message = String(data.message).trim().substring(0, 1000);
    const timestamp = data.timestamp || new Date().toISOString();

    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // If sheet doesn't exist, create it with headers
    if (!sheet) {
      const newSheet = spreadsheet.insertSheet(SHEET_NAME);
      newSheet.appendRow(['Timestamp', 'Name', 'Message']);
      newSheet.appendRow([timestamp, name, message]);
    } else {
      // Append the data as a new row
      sheet.appendRow([timestamp, name, message]);
    }

    // Return success response
    return createResponse(true, 'Đã lưu lời chúc thành công!');

  } catch (error) {
    // Log error for debugging
    console.error('Error processing form submission:', error);

    // Return error response
    return createResponse(false, 'Có lỗi xảy ra, vui lòng thử lại');
  }
}

/**
 * Handle GET requests (optional - for testing)
 */
function doGet(e) {
  return createResponse(true, 'Wedding Wishes API is running');
}

/**
 * Create standardized JSON response
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    data: data,
    timestamp: new Date().toISOString()
  };

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional: Get all wishes (for admin dashboard)
 * Call this function manually from Apps Script editor
 */
function getAllWishes() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    return [];
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const wish = {};
    headers.forEach((header, index) => {
      wish[header] = row[index];
    });
    return wish;
  });
}

/**
 * Optional: Clear all wishes (use with caution!)
 * Call this function manually from Apps Script editor
 */
function clearAllWishes() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    Logger.log('Sheet not found');
    return;
  }

  // Keep header row, delete all data rows
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
    Logger.log(`Deleted ${lastRow - 1} rows`);
  } else {
    Logger.log('No data to delete');
  }
}
