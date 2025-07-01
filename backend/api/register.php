<?php
// Headers - Allow all origins for development
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include_once '../config/database.php';
include_once '../models/User.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

// Instantiate user object
$user = new User($db);

// Get raw posted data
$json = file_get_contents("php://input");
$data = json_decode($json);

// Debug logging
error_log("Registration request received: " . $json);

// Validate required fields
if (!$data || !isset($data->username) || !isset($data->password) || !isset($data->email) || !isset($data->fullName)) {
    echo json_encode(array('message' => 'Missing required fields'));
    exit;
}

// Check if username already exists
$user->username = $data->username;
if ($user->usernameExists()) {
    echo json_encode(array('message' => 'Username already exists'));
    exit;
}

// Check if email already exists
$user->email = $data->email;
if ($user->emailExists()) {
    echo json_encode(array('message' => 'Email already exists'));
    exit;
}

// Set user properties
$user->username = $data->username;
$user->password = $data->password;
$user->email = $data->email;
$user->fullName = $data->fullName;
$user->role = $data->role ?? 'resident';
$user->phone = $data->phone ?? null;
$user->assignedArea = $data->assignedArea ?? null;

// Create user
if($user->create()) {
    // Insert into resident table if role is resident
    if (($user->role ?? 'resident') === 'resident') {
        $user_id = $db->lastInsertId();
        // Split fullName into firstname and lastname (simple split)
        $names = explode(' ', $user->fullName, 2);
        $firstname = $names[0];
        $lastname = isset($names[1]) ? $names[1] : '';
        $barangay_id = $data->barangay_id ?? null;
        $contact_num = $data->phone ?? null;
        $address = $data->address ?? null;
        $query = "INSERT INTO resident (user_id, firstname, lastname, contact_num, address, barangay_id) VALUES (:user_id, :firstname, :lastname, :contact_num, :address, :barangay_id)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':firstname', $firstname);
        $stmt->bindParam(':lastname', $lastname);
        $stmt->bindParam(':contact_num', $contact_num);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':barangay_id', $barangay_id);
        $stmt->execute();
    }
    echo json_encode(
        array(
            'message' => 'User created successfully',
            'user' => array(
                'username' => $user->username,
                'email' => $user->email,
                'fullName' => $user->fullName,
                'role' => $user->role
            )
        )
    );
} else {
    echo json_encode(
        array('message' => 'User not created - database error')
    );
}
