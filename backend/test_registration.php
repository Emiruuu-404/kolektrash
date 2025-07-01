<?php
require_once 'config/database.php';

// Test data
$testData = [
    'username' => 'testuser123',
    'password' => 'testpass123',
    'email' => 'test@example.com',
    'firstName' => 'Juan',
    'lastName' => 'Dela Cruz',
    'contactNum' => '09123456789',
    'barangay' => 'Aldezar'
];

// Simulate POST request
$_SERVER['REQUEST_METHOD'] = 'POST';

// Create mock php://input
$json = json_encode($testData);
file_put_contents('php://memory', $json);

echo "Testing registration endpoint...\n";
echo "Test data: " . json_encode($testData, JSON_PRETTY_PRINT) . "\n\n";

// Test the registration
ob_start();
$_POST = [];
$_GET = [];

// Simulate the POST data
$GLOBALS['HTTP_RAW_POST_DATA'] = $json;

// Include the registration file
try {
    include 'api/register_resident_new.php';
} catch (Exception $e) {
    echo "Error including file: " . $e->getMessage() . "\n";
}

$output = ob_get_clean();
echo "Response:\n$output\n";
?>
