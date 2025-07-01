<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get POST data
    $data = json_decode(file_get_contents("php://input"));

    // Validate required fields
    if (!$data || !$data->username || !$data->password || !$data->email || !$data->fullName || !$data->barangay) {
        http_response_code(400);
        echo json_encode(array("message" => "All fields are required"));
        exit;
    }

    $username = trim($data->username);
    $email = trim($data->email);
    $fullName = trim($data->fullName);
    $barangay = trim($data->barangay);
    $phone = isset($data->phone) ? trim($data->phone) : null;
    $address = isset($data->address) ? trim($data->address) : null;

    // Check if username already exists in either table
    $checkQuery = "SELECT username FROM users WHERE username = :username 
                   UNION 
                   SELECT username FROM employees WHERE username = :username";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(":username", $username);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Username already exists"));
        exit;
    }

    // Check if email already exists in either table
    $checkEmailQuery = "SELECT email FROM users WHERE email = :email 
                        UNION 
                        SELECT email FROM employees WHERE email = :email";
    $checkEmailStmt = $db->prepare($checkEmailQuery);
    $checkEmailStmt->bindParam(":email", $email);
    $checkEmailStmt->execute();

    if ($checkEmailStmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Email already exists"));
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);

    // Insert new resident
    $query = "INSERT INTO users (username, password, email, fullName, phone, address, barangay) 
              VALUES (:username, :password, :email, :fullName, :phone, :address, :barangay)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":username", $username);
    $stmt->bindParam(":password", $hashedPassword);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":fullName", $fullName);
    $stmt->bindParam(":phone", $phone);
    $stmt->bindParam(":address", $address);
    $stmt->bindParam(":barangay", $barangay);

    if ($stmt->execute()) {
        $userId = $db->lastInsertId();

        // Create welcome notification
        $notificationQuery = "INSERT INTO notifications (recipient_type, recipient_id, title, message, type) 
                             VALUES ('user', :user_id, 'Welcome to Koletrash!', 'Your resident account has been successfully created. You can now request garbage collection and view schedules.', 'success')";
        $notificationStmt = $db->prepare($notificationQuery);
        $notificationStmt->bindParam(":user_id", $userId);
        $notificationStmt->execute();

        http_response_code(201);
        echo json_encode(array(
            "message" => "Resident registered successfully",
            "user" => array(
                "id" => $userId,
                "username" => $username,
                "email" => $email,
                "fullName" => $fullName,
                "barangay" => $barangay,
                "userType" => "resident"
            )
        ));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Failed to register resident"));
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Server error: " . $e->getMessage()));
}
?>
