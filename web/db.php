<?php

  class trustDB {

   protected static $conn;
   private $_db_user;
   private $_db_pass;
   private $_db_host;
   private $_db;

    function __construct() {
         include 'config.php';
         $this->_db_user = $DB_USER;
         $this->_db_pass = $DB_PASS;
         $this->_db_host = $DB_HOST;
         $this->_db = $DB;
    }

    public function connect() {
      // Returns a PDO MySQL Connection Object
      if (!isset(self::$conn)) {
        $DSN = 'mysql:dbname='. $this->_db. ';host=' . $this->_db_host;
        try {
          self::$conn = new PDO($DSN, $this->_db_user, $this->_db_pass);
        } catch (PDOException $e) {
          echo 'DB Connection failed: $e';
        }
      }
      return self::$conn;
    }
  }

?>
