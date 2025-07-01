<?php
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->connect();
    
    echo "Available barangays in database:\n\n";
    
    $query = "SELECT barangay_id, barangay_name FROM barangay ORDER BY barangay_name";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $barangays = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($barangays)) {
        echo "No barangays found in database. Let me add some...\n\n";
        
        // Insert some barangays if none exist
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
        
        foreach ($barangayList as $index => $barangayName) {
            $insertQuery = "INSERT INTO barangay (barangay_name) VALUES (:barangay_name)";
            $insertStmt = $db->prepare($insertQuery);
            $insertStmt->bindParam(":barangay_name", $barangayName);
            $insertStmt->execute();
            echo "Added: $barangayName\n";
        }
        
        echo "\nBarangays added successfully!\n";
    } else {
        foreach ($barangays as $barangay) {
            echo "ID: {$barangay['barangay_id']} - {$barangay['barangay_name']}\n";
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
