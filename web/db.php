<?php
    include 'config.php';
    
    function connect_to_db() {
        $DSN = 'mysql:dbname='. $DB_USER . ';host=' . $DB_HOST;
        try {
            $conn = new PDO($DSN, $DB_USER, $DB_PASS);
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
        return $conn;
    }

    function get_session_data($conn, $token) {
        $query = 'SELECT * FROM session WHERE token=?';
        $prep = $conn->prepare($query);
        $prep->execute(array($token));
        $results = $prep->fetchAll();
        return $results 
    }
?>
