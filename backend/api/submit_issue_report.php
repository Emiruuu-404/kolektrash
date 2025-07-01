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
if (!isset($input['reporter_id']) || !isset($input['issue_type']) || !isset($input['description'])) {
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Missing required fields: reporter_id, issue_type, description'
    ));
    exit();
}

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

try {
    // Insert into issue_reports table
    $query = "INSERT INTO issue_reports (reporter_id, reporter_name, barangay, issue_type, description, photo_path, status, created_at) 
              VALUES (:reporter_id, :reporter_name, :barangay, :issue_type, :description, :photo_path, 'pending', NOW())";
    
    $stmt = $db->prepare($query);
    
    // Bind parameters
    $stmt->bindParam(':reporter_id', $input['reporter_id']);
    $stmt->bindParam(':reporter_name', $input['reporter_name']);
    $stmt->bindParam(':barangay', $input['barangay']);
    $stmt->bindParam(':issue_type', $input['issue_type']);
    $stmt->bindParam(':description', $input['description']);
    
    // Handle photo upload if provided
    $photo_path = null;
    if (isset($input['photo']) && !empty($input['photo'])) {
        // In a real implementation, you would handle file upload here
        // For now, we'll just store the photo data as a placeholder
        $photo_path = $input['photo'];
    }
    $stmt->bindParam(':photo_path', $photo_path);
    
    // Execute the query
    if ($stmt->execute()) {
        $issue_id = $db->lastInsertId();
        
        echo json_encode(array(
            'status' => 'success',
            'message' => 'Issue report submitted successfully',
            'data' => array(
                'issue_id' => $issue_id,
                'status' => 'pending'
            )
        ));
    } else {
        echo json_encode(array(
            'status' => 'error',
            'message' => 'Failed to submit issue report'
        ));
    }
    
} catch (PDOException $e) {
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ));
}
?>
