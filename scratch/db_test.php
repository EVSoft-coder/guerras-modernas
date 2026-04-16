<?php
try {
    $pdo = new PDO("mysql:host=localhost;port=3306;dbname=mw_guerras", "root", "");
    echo "CONNECTED AS ROOT";
} catch (Exception $e) {
    echo "ROOT FAILED: " . $e->getMessage() . "\n";
}

try {
    $pdo = new PDO("mysql:host=localhost;port=3306;dbname=mw_guerras", "mw_user", "ULBBhlq1981");
    echo "CONNECTED AS MW_USER";
} catch (Exception $e) {
    echo "MW_USER FAILED: " . $e->getMessage() . "\n";
}
