-- Create pickup_requests table for storing special pickup requests from barangay heads
CREATE TABLE IF NOT EXISTS pickup_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    requester_id INT NOT NULL,
    requester_name VARCHAR(255) NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    pickup_date DATE NOT NULL,
    waste_type VARCHAR(255) NOT NULL,
    notes TEXT,
    status ENUM('pending', 'approved', 'scheduled', 'completed', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    scheduled_time TIME NULL,
    assigned_driver_id INT NULL,
    completed_at TIMESTAMP NULL,
    
    INDEX idx_requester (requester_id),
    INDEX idx_barangay (barangay),
    INDEX idx_status (status),
    INDEX idx_pickup_date (pickup_date),
    INDEX idx_created (created_at)
);

-- Insert sample data for testing
INSERT INTO pickup_requests (requester_id, requester_name, barangay, contact_number, pickup_date, waste_type, notes, status) VALUES
(1, 'Juan Dela Cruz', 'Aldezar', '09123456789', '2025-07-05', 'Bulky items (old furniture)', 'Please bring a bigger truck for sofa and dining table', 'pending'),
(2, 'Maria Santos', 'Alteza', '09987654321', '2025-07-03', 'Hazardous waste (old paint cans)', 'Need special handling for paint disposal', 'approved'),
(3, 'Pedro Garcia', 'Anib', '09555123456', '2025-07-02', 'Recyclable materials', 'Large amount of cardboard and plastic bottles', 'scheduled');
