<?php
// Headers - Allow all origins for development
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/Database.php';
require_once '../models/User.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

// Instantiate user object
$user = new User($db);

// Get raw posted data
$json_input = file_get_contents("php://input");
$data = json_decode($json_input);

// Always return debug info to see what's happening
$debug_info = array(
    'raw_input' => $json_input,
    'decoded_data' => $data,
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'not set'
);

// Check if username and password are set
if(!$data || !isset($data->username) || !isset($data->password)) {
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Missing Required Parameters',
        'debug' => $debug_info
    ));
    exit();
}

$user->username = $data->username;
$user->password = $data->password;

// Login user
if($user->login()) {
    echo json_encode(array(
        'status' => 'success',
        'message' => 'Login Successful',
        'data' => array(
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'fullName' => $user->fullName,
            'role' => $user->role,
            'phone' => $user->phone,
            'assignedArea' => $user->assignedArea
        )
    ));
} else {
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Invalid Credentials',
        'debug' => array(
            'attempted_username' => $data->username,
            'attempted_password' => $data->password,
            'note' => 'Check if user exists in database and password hash matches'
        )
    ));
}
