<?php
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "Setting up database tables...\n\n";
    
    // Read the SQL file
    $sqlFile = 'koletrash_db_new.sql';
    if (!file_exists($sqlFile)) {
        echo "Error: SQL file not found: $sqlFile\n";
        exit;
    }
    
    $sql = file_get_contents($sqlFile);
    
    // Split SQL statements (simple split by semicolon)
    $statements = explode(';', $sql);
    
    $successCount = 0;
    $errorCount = 0;
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (empty($statement) || strpos($statement, '--') === 0) {
            continue; // Skip empty statements and comments
        }
        
        try {
            $db->exec($statement);
            $successCount++;
            
            // Show what we're creating
            if (stripos($statement, 'CREATE TABLE') !== false) {
                preg_match('/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?`?(\w+)`?/i', $statement, $matches);
                if (isset($matches[1])) {
                    echo "✓ Created table: {$matches[1]}\n";
                }
            } elseif (stripos($statement, 'CREATE DATABASE') !== false) {
                echo "✓ Created database\n";
            } elseif (stripos($statement, 'INSERT INTO') !== false) {
                preg_match('/INSERT INTO\s+`?(\w+)`?/i', $statement, $matches);
                if (isset($matches[1])) {
                    echo "✓ Inserted data into: {$matches[1]}\n";
                }
            }
            
        } catch (Exception $e) {
            $errorCount++;
            echo "✗ Error executing statement: " . $e->getMessage() . "\n";
            echo "Statement: " . substr($statement, 0, 100) . "...\n\n";
        }
    }
    
    echo "\nDatabase setup completed!\n";
    echo "Successful statements: $successCount\n";
    echo "Failed statements: $errorCount\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
