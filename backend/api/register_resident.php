<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
require_once("../config/database.php");

// Get POST data as JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$required = ['username', 'email', 'password', 'firstname', 'lastname', 'contact_num', 'address', 'barangay_id'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        echo json_encode(["success" => false, "message" => "Missing field: $field"]);
        exit;
    }
}

$username = $data['username'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$firstname = $data['firstname'];
$lastname = $data['lastname'];
$contact_num = $data['contact_num'];
$address = $data['address'];
$barangay_id = $data['barangay_id'];

$conn = (new Database())->connect();

try {
    $conn->beginTransaction();

    // 1. Insert into user_account
    $stmt = $conn->prepare("INSERT INTO user_account (username, email, password, role) VALUES (?, ?, ?, 'resident')");
    $stmt->execute([$username, $email, $password]);
    $user_id = $conn->lastInsertId();

    // 2. Insert into user_profile
    $stmt = $conn->prepare("INSERT INTO user_profile (user_id, firstname, lastname, contact_num, address) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $firstname, $lastname, $contact_num, $address]);

    // 3. Insert into resident
    $stmt = $conn->prepare("INSERT INTO resident (user_id, barangay_id) VALUES (?, ?)");
    $stmt->execute([$user_id, $barangay_id]);

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Resident registered successfully"]);
} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(["success" => false, "message" => "Registration failed: " . $e->getMessage()]);
}
?>
