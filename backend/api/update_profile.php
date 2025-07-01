<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/Database.php';

$database = new Database();
$db = $database->connect();

$json_input = file_get_contents("php://input");
$data = json_decode($json_input);

if (!$data || !isset($data->id)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'User ID is required'
    ]);
    exit();
}

try {
    $query = "UPDATE users SET fullName = :fullName, email = :email, phone = :phone WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $data->id);
    $stmt->bindParam(':fullName', $data->fullName);
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':phone', $data->phone);
    
    if ($stmt->execute()) {
        // Get updated user data
        $userQuery = "SELECT id, username, email, fullName, role, phone, assignedArea FROM users WHERE id = :id";
        $userStmt = $db->prepare($userQuery);
        $userStmt->bindParam(':id', $data->id);
        $userStmt->execute();
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to update profile'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 