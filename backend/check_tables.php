<?php
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "Checking database structure...\n\n";
    
    // Check if users table exists
    $query = "SHOW TABLES LIKE 'users'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo "✓ Users table exists\n";
        
        // Show table structure
        $query = "DESCRIBE users";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "Users table structure:\n";
        foreach ($columns as $column) {
            echo "  - {$column['Field']} ({$column['Type']})\n";
        }
    } else {
        echo "✗ Users table does not exist\n";
    }
    
    echo "\n";
    
    // Check if employees table exists
    $query = "SHOW TABLES LIKE 'employees'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo "✓ Employees table exists\n";
    } else {
        echo "✗ Employees table does not exist\n";
    }
    
    // Check if notifications table exists
    $query = "SHOW TABLES LIKE 'notifications'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo "✓ Notifications table exists\n";
    } else {
        echo "✗ Notifications table does not exist\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
