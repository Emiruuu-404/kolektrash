<?php
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->connect();
    
    echo "Checking barangay table structure:\n";
    
    $query = "DESCRIBE barangay";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($columns as $column) {
        echo "  {$column['Field']} - {$column['Type']} - {$column['Null']} - {$column['Key']} - {$column['Default']} - {$column['Extra']}\n";
    }
    
    echo "\nExisting data:\n";
    $query = "SELECT * FROM barangay LIMIT 10";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($data as $row) {
        echo "  ID: {$row['barangay_id']} - Name: {$row['barangay_name']}\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
