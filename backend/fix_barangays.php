<?php
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->connect();
    
    echo "Fixing barangay table and adding data...\n\n";
    
    // First, let's modify the table to make barangay_id auto-increment
    $alterQuery = "ALTER TABLE barangay MODIFY barangay_id INT(11) NOT NULL AUTO_INCREMENT";
    $db->exec($alterQuery);
    echo "✓ Made barangay_id auto-increment\n";
    
    // Delete the existing invalid entry
    $deleteQuery = "DELETE FROM barangay WHERE barangay_id = 0";
    $db->exec($deleteQuery);
    echo "✓ Removed invalid entry\n";
    
    // Reset auto-increment to start from 1
    $resetQuery = "ALTER TABLE barangay AUTO_INCREMENT = 1";
    $db->exec($resetQuery);
    echo "✓ Reset auto-increment\n";
    
    // Now add barangays
    $barangayList = [
        'Aldezar', 'Alteza', 'Anib', 'Awayan', 'Azucena', 'Bagong Sirang', 'Binahian',
        'Bolo Norte', 'Bolo Sur', 'Bulan', 'Bulawan', 'Cabuyao', 'Caima', 'Calagbangan',
        'Calampinay', 'Carayrayan', 'Cotmo', 'Gabi', 'Gaongan', 'Impig', 'Lipilip',
        'Lubigan Jr.', 'Lubigan Sr.', 'Malaguico', 'Malubago', 'Manangle', 'Mangapo',
        'Mangga', 'Manlubang', 'Mantila', 'North Centro (Poblacion)', 'North Villazar',
        'Sagrada Familia', 'Salanda', 'Salvacion', 'San Isidro', 'San Vicente',
        'Serranzana', 'South Centro (Poblacion)', 'South Villazar', 'Taisan', 'Tara',
        'Tible', 'Tula-tula', 'Vigaan', 'Yabo'
    ];
    
    $insertQuery = "INSERT INTO barangay (barangay_name) VALUES (:barangay_name)";
    $insertStmt = $db->prepare($insertQuery);
    
    foreach ($barangayList as $barangayName) {
        $insertStmt->bindParam(":barangay_name", $barangayName);
        $insertStmt->execute();
        echo "Added: $barangayName\n";
    }
    
    echo "\n✓ All barangays added successfully!\n";
    
    // Show final count
    $countQuery = "SELECT COUNT(*) as total FROM barangay";
    $countStmt = $db->prepare($countQuery);
    $countStmt->execute();
    $count = $countStmt->fetch(PDO::FETCH_ASSOC);
    echo "Total barangays in database: {$count['total']}\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
