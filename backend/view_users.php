<?php
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->connect();
    
    echo "Current registered users:\n\n";
    
    // Get all users with their resident information
    $query = "SELECT 
                ua.user_id,
                ua.username,
                ua.email,
                ua.role,
                r.resident_id,
                r.firstname,
                r.lastname,
                r.contact_num,
                r.address,
                b.barangay_name
              FROM user_account ua
              LEFT JOIN resident r ON ua.user_id = r.user_id
              LEFT JOIN barangay b ON r.barangay_id = b.barangay_id
              ORDER BY ua.user_id DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($users)) {
        echo "No users registered yet.\n";
    } else {
        foreach ($users as $user) {
            echo "═══════════════════════════════════════\n";
            echo "User ID: {$user['user_id']}\n";
            echo "Username: {$user['username']}\n";
            echo "Email: {$user['email']}\n";
            echo "Role: {$user['role']}\n";
            
            if ($user['resident_id']) {
                echo "Resident ID: {$user['resident_id']}\n";
                echo "Name: {$user['firstname']} {$user['lastname']}\n";
                echo "Contact: {$user['contact_num']}\n";
                echo "Address: " . ($user['address'] ?: 'Not provided') . "\n";
                echo "Barangay: {$user['barangay_name']}\n";
            } else {
                echo "No resident profile found\n";
            }
            echo "\n";
        }
        
        echo "Total users: " . count($users) . "\n";
    }
    
    // Show next auto-increment values
    echo "\n=== NEXT AUTO-INCREMENT VALUES ===\n";
    $query = "SELECT TABLE_NAME, AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'kolektrash_db' AND TABLE_NAME IN ('user_account', 'resident') ORDER BY TABLE_NAME";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($results as $table) {
        echo "Next {$table['TABLE_NAME']} ID: {$table['AUTO_INCREMENT']}\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
