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

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Method not allowed'
    ));
    exit();
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($input['requester_id']) || !isset($input['contact']) || !isset($input['pickup_date']) || !isset($input['waste_type'])) {
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Missing required fields: requester_id, contact, pickup_date, waste_type'
    ));
    exit();
}

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

try {
    // Insert into pickup_requests table
    $query = "INSERT INTO pickup_requests (requester_id, requester_name, barangay, contact_number, pickup_date, waste_type, notes, status, created_at) 
              VALUES (:requester_id, :requester_name, :barangay, :contact_number, :pickup_date, :waste_type, :notes, 'pending', NOW())";
    
    $stmt = $db->prepare($query);
    
    // Bind parameters
    $stmt->bindParam(':requester_id', $input['requester_id']);
    $stmt->bindParam(':requester_name', $input['requester_name']);
    $stmt->bindParam(':barangay', $input['barangay']);
    $stmt->bindParam(':contact_number', $input['contact']);
    $stmt->bindParam(':pickup_date', $input['pickup_date']);
    $stmt->bindParam(':waste_type', $input['waste_type']);
    $stmt->bindParam(':notes', $input['notes']);
    
    // Execute the query
    if ($stmt->execute()) {
        $request_id = $db->lastInsertId();
        
        echo json_encode(array(
            'status' => 'success',
            'message' => 'Pickup request submitted successfully',
            'data' => array(
                'request_id' => $request_id,
                'status' => 'pending'
            )
        ));
    } else {
        echo json_encode(array(
            'status' => 'error',
            'message' => 'Failed to submit pickup request'
        ));
    }
    
} catch (PDOException $e) {
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ));
}
?>
