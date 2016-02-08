<?php

    function get_session_data($conn, $token) {
        $query = 'SELECT * FROM session WHERE token=?';
        $prep = $conn->prepare($query);
        $prep->execute(array($token));
        $results = $prep->fetchAll();
        return $results; 
    }
    
    function start_session($conn) {
       //DEBUG
       //END DEBUG
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        $time = time();
        if (!isset($_COOKIE['token'])) {
            $workerId = $_GET['workerId']; 
            $assignmentId = $_GET['assignmentId'];
            $timeExpire = $time + 3600;
            $turkSubmitTo = $_GET['turkSubmitTo'];
            $token = create_token($workerId, $userAgent, $time);
            set_app_cookies($token, $workerId, $turkSubmitTo,
                           $timeExpire);
            store_session($conn, $assignmentId, $workerId,
                          $timeExpire, $time, $userAgent,
                          $token);
        } else {
            $truth = validate_session($conn, $_COOKIE['token'], 
                                     $_COOKIE['workerId'], 
                                     $userAgent);
            if (!$truth) {
                //GOTO FAIL
                echo 'failed';
                header('Location: /gotofail.html');
            }
        }   
    }

    function store_session($conn, $assignmentId, $workerId,
                           $timeExpire, $timeStart, $userAgent,
                           $token) {
        $insert = 'INSERT INTO session (assignmentId, workerId, ';
        $insert = $insert . 'timeExpire, timeStart, userAgent, ';
        $insert = $insert . 'token) VALUES (?,?,?,?,?,?)'; 
        $prep = $conn->prepare($insert);
        $prep->execute(array($assignmentId, $workerId, $timeExpire,
                             $timeStart, $userAgent, $token));
        $results = $prep->fetchAll();
    }

    function set_app_cookies($token, $workerId, $turkSubmitTo, 
                                                  $timeExpire) {
        setcookie('token', $token, $timeExpire, '/', null, true, true);
        setcookie('workerId', $workerId, $timeExpire, '/', 
                  null, true, true);
        setcookie('turkSubmitTo', $turkSubmitTo, 
                  $timeExpire, '/', null, true, true);
        setcookie('timeExpire', $workerId, $timeExpire, '/', 
                  null, true, true);
    }

    function validate_session($conn, $token, $workerId, 
                                             $userAgent) {
        $results = get_session_data($conn, $token);
        // If no results, fail. If results, check
        // If token is expired.
        if (! $results) {
           echo 'false';
           return false; 
        } else {
           $timeStart = $results[0]['timeStart'];
           $timeExpire = $results[0]['timeExpire'];
           $token_truth = validate_token($token, $workerId, $userAgent,
                                         $timeStart);
           $time_truth = $timeExpire > time();
           if ($token_truth && $time_truth) {
               return true;
           }
        } 
        return false;
    }

    function create_token($workerId, $userAgent, $timeStart) {
        $token = md5($workerId . $userAgent . $timeStart);
        return $token;
    }

    function validate_token($token, $workerId, $userAgent, $timeStart) {
        // Check to see whether the hash of the 
        // components matches
        $prehash = $workerId . $userAgent . $timeStart;
        if ($token == md5($prehash)) {
            return true;
        }
        return false;
    }
?>
