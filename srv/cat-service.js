const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');
const { PassThrough } = require('stream');
const XLSX = require('xlsx');


module.exports = srv => {
    srv.on('UploadStudents', async (req) => {
        const { STUDENTS } = srv.entities;
    
        try {
            const fileContent = req.data.file.split(',')[1]; // Get base64 content after the comma
            const buffer = Buffer.from(fileContent, 'base64');
    
            // Create a Uint8Array directly from the buffer
            const bytes = new Uint8Array(buffer);
    
            const workbook = XLSX.read(bytes.buffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const studentsData = XLSX.utils.sheet_to_json(sheet);
    
            console.log('Parsed Data:', studentsData);
            const formattedStudentsData = studentsData.map(record => ({
                ...record,
                ID: String(record.ID) // Convert ID to string
            }));
    
            // Insert parsed data into Students table
            await INSERT.into(STUDENTS).entries(formattedStudentsData);
    
            return { message: 'File uploaded successfully.' };
        } catch (error) {
            console.error("Error during upload:", error);
            return req.error(400, 'Invalid file content');
        }
    });
    
    srv.before('CREATE', 'STUDENTS', async (req) => {
        if (req.data.ID) {
            console.log('Original ID:', req.data.ID, 'Type:', typeof req.data.ID);

            // Convert ID to an integer, add 5, and update the ID in the request data
            req.data.ID = (parseInt(req.data.ID, 10) + 5).toString();

            console.log('Updated ID:', req.data.ID, 'Type:', typeof req.data.ID);
        }
    });

    srv.on('CREATE', 'STUDENTS', async (req) => {
        try {
            console.log('Request Data:', req.data);

            const insertedData = await cds.transaction(req).run(
                INSERT.into('APP.STUDENTS').entries(req.data)
            );
            console.log('Inserted Data:', insertedData);
            return req.data;
        } catch (error) {
            console.error('Error during insertion:', error);

            const errorDetails = {
                ERROR_CODE: error.code,
                ERROR_MSG: error.message
            };

            // Use fully qualified name for ERROR_LOG entity
            await cds.transaction(req).run(
                INSERT.into('APP.ERROR').entries(errorDetails)
            );
            console.log('Error logged into ERROR entity.');

            // Return error response
            return req.error(400, errorDetails.ERROR_MSG);
        }
    });
};
