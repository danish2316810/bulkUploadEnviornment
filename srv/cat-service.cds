
using app from '../db/data-model';


service catalog {
// @cds.persistence.skip
// @odata.singleton
//  entity ExcelUpload {
//         @Core.MediaType : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         excel : LargeBinary;
//     };

entity STUDENTS as projection on app.STUDENTS;
entity ERROR as projection on app.ERROR;
 action UploadStudents (file: String);
}
