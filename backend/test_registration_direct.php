<?php
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->connect();
    
    echo "Testing registration with auto-increment...\n\n";
    
    // Test data
    $testData = [
        'username' => 'testuser' . time(), // Make username unique
        'email' => 'test' . time() . '@example.com',
        'firstName' => 'Juan',
        'lastName' => 'Dela Cruz',
        'contactNum' => '09123456789',
        'barangay' => 'Aldezar',
        'password' => 'testpass123'
    ];
    
    echo "Test data:\n";
    foreach ($testData as $key => $value) {
        echo "  $key: $value\n";
    }
    echo "\n";
    
    // Get barangay_id
    $barangayQuery = "SELECT barangay_id FROM barangay WHERE barangay_name = :barangay_name";
    $barangayStmt = $db->prepare($barangayQuery);
    $barangayStmt->bindParam(":barangay_name", $testData['barangay']);
    $barangayStmt->execute();
    $barangayResult = $barangayStmt->fetch(PDO::FETCH_ASSOC);
    $barangayId = $barangayResult ? $barangayResult['barangay_id'] : null;
    
    echo "Barangay ID for '{$testData['barangay']}': $barangayId\n\n";
    
    if (!$barangayId) {
        throw new Exception("Barangay not found in database");
    }
    
    // Start transaction
    $db->beginTransaction();
    
    try {
        // Insert into user_account table (user_id will auto-increment)
        $userQuery = "INSERT INTO user_account (username, email, password, role) 
                      VALUES (:username, :email, :password, 'resident')";
        
        $userStmt = $db->prepare($userQuery);
        $userStmt->bindParam(":username", $testData['username']);
        $userStmt->bindParam(":email", $testData['email']);
        $userStmt->bindParam(":password", $testData['password']);
        
        if (!$userStmt->execute()) {
            throw new Exception("Failed to create user account");
        }
        
        $userId = $db->lastInsertId();
        echo "✓ Created user account with ID: $userId\n";
        
        // Insert into resident table (resident_id will auto-increment)
        $residentQuery = "INSERT INTO resident (user_id, firstname, lastname, contact_num, address, barangay_id) 
                         VALUES (:user_id, :firstname, :lastname, :contact_num, :address, :barangay_id)";
        
        $residentStmt = $db->prepare($residentQuery);
        $residentStmt->bindParam(":user_id", $userId);
        $residentStmt->bindParam(":firstname", $testData['firstName']);
        $residentStmt->bindParam(":lastname", $testData['lastName']);
        $residentStmt->bindParam(":contact_num", $testData['contactNum']);
        $address = null; // Create a variable for null value
        $residentStmt->bindParam(":address", $address);
        $residentStmt->bindParam(":barangay_id", $barangayId);
        
        if (!$residentStmt->execute()) {
            throw new Exception("Failed to create resident profile");
        }
        
        $residentId = $db->lastInsertId();
        echo "✓ Created resident profile with ID: $residentId\n";
        
        // Commit transaction
        $db->commit();
        
        echo "\n🎉 Registration successful!\n";
        echo "User ID: $userId\n";
        echo "Resident ID: $residentId\n";
        echo "Username: {$testData['username']}\n";
        echo "Email: {$testData['email']}\n";
        echo "Full Name: {$testData['firstName']} {$testData['lastName']}\n";
        echo "Barangay: {$testData['barangay']} (ID: $barangayId)\n";
        
    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
