-- Create issue_reports table for storing issue reports from barangay heads and residents
CREATE TABLE IF NOT EXISTS issue_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reporter_id INT NOT NULL,
    reporter_name VARCHAR(255) NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    issue_type ENUM('Missed Collection', 'Overflowing Bins', 'Illegal Dumping', 'Damaged Bin', 'Irregular Schedule', 'Uncollected Waste', 'Other') NOT NULL,
    description TEXT NOT NULL,
    photo_path TEXT,
    status ENUM('pending', 'in_progress', 'resolved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    
    INDEX idx_reporter (reporter_id),
    INDEX idx_barangay (barangay),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);

-- Insert sample data for testing
INSERT INTO issue_reports (reporter_id, reporter_name, barangay, issue_type, description, status) VALUES
(1, 'Juan Dela Cruz', 'Aldezar', 'Missed Collection', 'Garbage truck did not show up for scheduled collection yesterday.', 'pending'),
(2, 'Maria Santos', 'Alteza', 'Overflowing Bins', 'The community bin is overflowing and attracting pests.', 'pending'),
(3, 'Pedro Garcia', 'Anib', 'Damaged Bin', 'One of the garbage bins has a broken lid and cannot be closed properly.', 'in_progress');
