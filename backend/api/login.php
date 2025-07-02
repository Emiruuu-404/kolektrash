<?php
file_put_contents(__DIR__ . '/debug.log', 'login.php reached\n', FILE_APPEND);

ini_set('display_errors', 0); // Suppress errors in output
ini_set('log_errors', 1);     // Log errors to server logs
error_reporting(E_ALL);       // Report all errors (for logging)

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

file_put_contents(__DIR__ . '/debug.log', 'After require_once\n', FILE_APPEND);

require_once '../config/Database.php';
require_once '../models/User.php';

file_put_contents(__DIR__ . '/debug.log', 'After DB connect\n', FILE_APPEND);

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

file_put_contents(__DIR__ . '/debug.log', 'After User object\n', FILE_APPEND);

// Instantiate user object
$user = new User($db);

file_put_contents(__DIR__ . '/debug.log', 'After User instantiation\n', FILE_APPEND);

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
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing Required Parameters'
    ]);
    exit();
}

$user->username = $data->username;
$user->password = $data->password;

// Login user
if($user->login()) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Login Successful',
        'data' => [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'fullName' => $user->fullName,
            'role' => $user->role
        ]
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid Credentials'
    ]);
}
