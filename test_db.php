<?php
try {
    $db = new PDO('mysql:host=127.0.0.1;dbname=mw_guerras', 'mw_user', 'ULBBhlq1981');
    echo 'Connected';
} catch (Exception $e) {
    echo $e->getMessage();
}
