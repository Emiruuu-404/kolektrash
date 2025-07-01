<?php
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->connect();
    
    echo "Fixing auto-increment settings for primary keys...\n\n";
    
    // Fix user_account table
    echo "Fixing user_account table...\n";
    $query = "ALTER TABLE user_account MODIFY user_id INT(11) NOT NULL AUTO_INCREMENT";
    $db->exec($query);
    echo "✓ Set user_id to auto-increment\n";
    
    // Set starting value for user_account
    $query = "ALTER TABLE user_account AUTO_INCREMENT = 1";
    $db->exec($query);
    echo "✓ Set user_account auto-increment start value to 1\n";
    
    // Fix resident table
    echo "\nFixing resident table...\n";
    $query = "ALTER TABLE resident MODIFY resident_id INT(11) NOT NULL AUTO_INCREMENT";
    $db->exec($query);
    echo "✓ Set resident_id to auto-increment\n";
    
    // Set starting value for resident
    $query = "ALTER TABLE resident AUTO_INCREMENT = 1";
    $db->exec($query);
    echo "✓ Set resident auto-increment start value to 1\n";
    
    echo "\n=== VERIFICATION ===\n";
    
    // Verify the changes
    $query = "SELECT TABLE_NAME, AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'kolektrash_db' AND AUTO_INCREMENT IS NOT NULL ORDER BY TABLE_NAME";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($results as $table) {
        echo "Table: {$table['TABLE_NAME']} - Next ID: {$table['AUTO_INCREMENT']}\n";
    }
    
    echo "\n✅ Auto-increment setup completed successfully!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
