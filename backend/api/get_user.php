<?php
// Headers - Allow all origins for development
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

// Get user ID from query parameter
$user_id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$user_id) {
    echo json_encode(array(
        'status' => 'error',
        'message' => 'User ID is required'
    ));
    exit();
}

try {
    // Query to get user data from user_account and resident tables
    $query = "SELECT 
                ua.user_id as id,
                ua.username,
                ua.email,
                ua.role,
                r.firstname,
                r.lastname,
                r.contact_num as phone,
                b.barangay_name as barangay
              FROM user_account ua
              LEFT JOIN resident r ON ua.user_id = r.user_id
              LEFT JOIN barangay b ON r.barangay_id = b.barangay_id
              WHERE ua.user_id = :id LIMIT 1";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $user_id);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Combine first and last name to create fullName
        $fullName = trim(($user['firstname'] ?? '') . ' ' . ($user['lastname'] ?? ''));
        if (empty($fullName)) {
            $fullName = $user['username']; // Fallback to username if no names
        }
        
        echo json_encode(array(
            'status' => 'success',
            'data' => array(
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'fullName' => $fullName,
                'firstName' => $user['firstname'],
                'lastName' => $user['lastname'],
                'role' => $user['role'],
                'phone' => $user['phone'],
                'barangay' => $user['barangay'],
                'assignedArea' => $user['barangay'] // For compatibility
            )
        ));
    } else {
        echo json_encode(array(
            'status' => 'error',
            'message' => 'User not found'
        ));
    }
} catch (PDOException $e) {
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ));
}
?>
