<?php
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "Current database information:\n";
    
    // Get current database name
    $query = "SELECT DATABASE() as current_db";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Current database: " . $result['current_db'] . "\n\n";
    
    // Show all tables
    $query = "SHOW TABLES";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "Existing tables:\n";
    foreach ($tables as $table) {
        echo "  - $table\n";
    }
    
    if (empty($tables)) {
        echo "  No tables found\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
