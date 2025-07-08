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
$firstname = $data['firstname'] ?? '';
$lastname = $data['lastname'] ?? '';
$contact_num = $data['contact_num'] ?? '';
$address = $data['address'] ?? '';
$barangay_id = $data['barangay_id'] ?? '';
$barangay_head_id = $data['barangay_head_id'] ?? '';

if (!$username || !$email || !$password || !$role || !$firstname || !$lastname || !$contact_num || !$address) {
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
    $conn->beginTransaction();
    // 1. Insert into user_account
    $stmt = $conn->prepare("INSERT INTO user_account (username, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute([$username, $email, $passwordHash, $role]);
    $user_id = $conn->lastInsertId();

    // 2. Insert into user_profile
    $stmt = $conn->prepare("INSERT INTO user_profile (user_id, firstname, lastname, contact_num, address) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $firstname, $lastname, $contact_num, $address]);

    // 3. Insert into the appropriate role table
    if ($role === 'barangay_head') {
        if (!$barangay_head_id || !$barangay_id) {
            throw new Exception('Barangay Head ID and Barangay ID are required for Barangay Head role.');
        }
        $stmt = $conn->prepare("INSERT INTO barangay_head (barangay_head_id, user_id, barangay_id) VALUES (?, ?, ?)");
        $stmt->execute([$barangay_head_id, $user_id, $barangay_id]);
    } elseif ($role === 'truck_driver') {
        $stmt = $conn->prepare("INSERT INTO truck_driver (user_id) VALUES (?)");
        $stmt->execute([$user_id]);
    } elseif ($role === 'garbage_collector') {
        $stmt = $conn->prepare("INSERT INTO garbage_collector (user_id) VALUES (?)");
        $stmt->execute([$user_id]);
    }
    $conn->commit();
    echo json_encode(["success" => true, "message" => "Personnel account created."]);
} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
