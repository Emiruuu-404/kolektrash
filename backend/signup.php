<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get posted data
    $data = json_decode(file_get_contents("php://input"));
    
    if (
        !empty($data->fullName) &&
        !empty($data->email) &&
        !empty($data->username) &&
        !empty($data->barangay) &&
        !empty($data->password)
    ) {
        // Check if email already exists
        $email_check_query = "SELECT id FROM users WHERE email = :email LIMIT 1";
        $email_check_stmt = $db->prepare($email_check_query);
        $email_check_stmt->bindParam(":email", $data->email);
        $email_check_stmt->execute();
        
        if ($email_check_stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(array("message" => "Email already exists."));
            exit();
        }
        
        // Check if username already exists
        $username_check_query = "SELECT id FROM users WHERE username = :username LIMIT 1";
        $username_check_stmt = $db->prepare($username_check_query);
        $username_check_stmt->bindParam(":username", $data->username);
        $username_check_stmt->execute();
        
        if ($username_check_stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(array("message" => "Username already exists."));
            exit();
        }
        
        // Hash the password
        $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
        
        // Create query
        $query = "INSERT INTO users (full_name, email, username, barangay, password, created_at) 
                  VALUES (:full_name, :email, :username, :barangay, :password, NOW())";
        
        // Prepare statement
        $stmt = $db->prepare($query);
        
        // Bind data
        $stmt->bindParam(":full_name", $data->fullName);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":username", $data->username);
        $stmt->bindParam(":barangay", $data->barangay);
        $stmt->bindParam(":password", $hashed_password);
        
        // Execute query
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "User created successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create user."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?> 