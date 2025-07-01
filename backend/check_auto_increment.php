<?php
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->connect();
    
    echo "Checking auto-increment settings for primary keys...\n\n";
    
    // Check user_account table
    echo "=== USER_ACCOUNT TABLE ===\n";
    $query = "SHOW CREATE TABLE user_account";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo $result['Create Table'] . "\n\n";
    
    // Check resident table
    echo "=== RESIDENT TABLE ===\n";
    $query = "SHOW CREATE TABLE resident";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo $result['Create Table'] . "\n\n";
    
    // Check current auto_increment values
    echo "=== CURRENT AUTO_INCREMENT VALUES ===\n";
    $query = "SELECT TABLE_NAME, AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'kolektrash_db' AND AUTO_INCREMENT IS NOT NULL";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($results as $table) {
        echo "Table: {$table['TABLE_NAME']} - Next ID: {$table['AUTO_INCREMENT']}\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
