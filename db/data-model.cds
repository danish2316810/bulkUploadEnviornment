namespace app;

entity STUDENTS {
          key ID : String(100);
      FIRST_NAME : String(100);
      LAST_NAME  : String(100);
      DOB        : String(100);
      ADDRESS    : String(100);

}

entity ERROR {
    
      ERROR_CODE : Int32;
      ERROR_MSG  : String(500);
}
