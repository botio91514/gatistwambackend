const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

/**
 * Appends contact data to a Google Sheet
 * @param {Object} contactData 
 * @returns {Promise<boolean>}
 */
const appendToSheet = async (contactData) => {
    try {
        const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

        // Check if spreadsheet ID is configured
        if (!spreadsheetId) {
            console.warn('GOOGLE_SPREADSHEET_ID not configured in environment variables');
            return false;
        }

        // Auth setup
        let auth;

        // Check for service account file
        const serviceAccountPath = path.join(__dirname, '../service-account.json');
        if (fs.existsSync(serviceAccountPath)) {
            auth = new google.auth.GoogleAuth({
                keyFile: serviceAccountPath,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
        } else if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
            // Use env vars if file doesn't exist (handle newlines in private key)
            auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: process.env.GOOGLE_CLIENT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
        } else {
            console.warn('Google Sheets credentials (service-account.json or env vars) not found');
            return false;
        }

        const sheets = google.sheets({ version: 'v4', auth });

        // Prepare data row
        const row = [
            new Date().toISOString(), // Timestamp
            contactData.name,
            contactData.email,
            contactData.phone || '',
            contactData.subject || '',
            contactData.message || '',
            contactData.status || 'new'
        ];

        // Append to Sheet1 (or configured sheet name)
        const range = process.env.GOOGLE_SHEET_NAME ? `${process.env.GOOGLE_SHEET_NAME}!A:G` : 'Sheet1!A:G';

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [row],
            },
        });

        console.log('Successfully appended contact to Google Sheet');
        return true;

    } catch (error) {
        console.error('Error appending to Google Sheet:', error);
        return false;
    }
};

module.exports = {
    appendToSheet
};
