<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once("../config/database.php");

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$role = $data['role'] ?? '';

if (!$username || !$email || !$password || !$role) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit;
}

// Map frontend role names to database role names
$roleMapping = [
    'Truck Driver' => 'truck_driver',
    'Garbage Collector' => 'garbage_collector', 
    'Barangay Head' => 'barangay_head'
];

$role = $roleMapping[$data['role']] ?? $data['role'];

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$conn = (new Database())->connect();

try {
    $stmt = $conn->prepare("INSERT INTO user_account (username, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute([$username, $email, $passwordHash, $role]);
    echo json_encode(["success" => true, "message" => "Personnel account created."]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
