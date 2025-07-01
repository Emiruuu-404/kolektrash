<?php
// Headers - Allow all origins for development
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->connect();

    // Get POST data
    $data = json_decode(file_get_contents("php://input"));

    // Validate required fields
    if (!$data || !$data->username || !$data->password || !$data->email || !$data->firstName || !$data->lastName || !$data->barangay) {
        http_response_code(400);
        echo json_encode(array("message" => "All fields are required"));
        exit;
    }

    $username = trim($data->username);
    $email = trim($data->email);
    $firstName = trim($data->firstName);
    $lastName = trim($data->lastName);
    $barangay = trim($data->barangay);
    $contactNum = isset($data->contactNum) ? trim($data->contactNum) : null;
    $address = isset($data->address) ? trim($data->address) : null;

    // Check if username already exists
    $checkQuery = "SELECT username FROM user_account WHERE username = :username";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(":username", $username);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Username already exists"));
        exit;
    }

    // Check if email already exists
    $checkEmailQuery = "SELECT email FROM user_account WHERE email = :email";
    $checkEmailStmt = $db->prepare($checkEmailQuery);
    $checkEmailStmt->bindParam(":email", $email);
    $checkEmailStmt->execute();

    if ($checkEmailStmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Email already exists"));
        exit;
    }

    // Get barangay_id from barangay name
    $barangayQuery = "SELECT barangay_id FROM barangay WHERE barangay_name = :barangay_name";
    $barangayStmt = $db->prepare($barangayQuery);
    $barangayStmt->bindParam(":barangay_name", $barangay);
    $barangayStmt->execute();
    
    $barangayResult = $barangayStmt->fetch(PDO::FETCH_ASSOC);
    $barangayId = $barangayResult ? $barangayResult['barangay_id'] : null;

    // Start transaction
    $db->beginTransaction();

    try {
        // Insert into user_account table
        $userQuery = "INSERT INTO user_account (username, email, password, role) 
                      VALUES (:username, :email, :password, 'resident')";
        
        $userStmt = $db->prepare($userQuery);
        $userStmt->bindParam(":username", $username);
        $userStmt->bindParam(":email", $email);
        $userStmt->bindParam(":password", $data->password); // For demo: plain password
        
        if (!$userStmt->execute()) {
            throw new Exception("Failed to create user account");
        }

        $userId = $db->lastInsertId();

        // Insert into resident table
        $residentQuery = "INSERT INTO resident (user_id, firstname, lastname, contact_num, address, barangay_id) 
                         VALUES (:user_id, :firstname, :lastname, :contact_num, :address, :barangay_id)";
        
        $residentStmt = $db->prepare($residentQuery);
        $residentStmt->bindParam(":user_id", $userId);
        $residentStmt->bindParam(":firstname", $firstName);
        $residentStmt->bindParam(":lastname", $lastName);
        $residentStmt->bindParam(":contact_num", $contactNum);
        $residentStmt->bindParam(":address", $address);
        $residentStmt->bindParam(":barangay_id", $barangayId);
        
        if (!$residentStmt->execute()) {
            throw new Exception("Failed to create resident profile");
        }

        // Commit transaction
        $db->commit();

        http_response_code(201);
        echo json_encode(array(
            "message" => "Resident registered successfully",
            "user" => array(
                "id" => $userId,
                "username" => $username,
                "email" => $email,
                "firstName" => $firstName,
                "lastName" => $lastName,
                "barangay" => $barangay,
                "userType" => "resident"
            )
        ));

    } catch (Exception $e) {
        // Rollback transaction
        $db->rollback();
        throw $e;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Server error: " . $e->getMessage()));
}
?>
