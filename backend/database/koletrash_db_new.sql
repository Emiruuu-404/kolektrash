-- Create database
CREATE DATABASE IF NOT EXISTS koletrash_db;
USE koletrash_db;

-- =====================================================
-- USERS TABLE - For residents only
-- =====================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fullName VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    barangay VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_barangay (barangay)
);

-- =====================================================
-- EMPLOYEES TABLE - For MENRO staff and barangay officials
-- =====================================================
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fullName VARCHAR(100) NOT NULL,
    role ENUM('admin', 'barangayhead', 'truckdriver', 'garbagecollector') NOT NULL,
    phone VARCHAR(20),
    assignedArea VARCHAR(100),
    department VARCHAR(100) DEFAULT 'MENRO',
    employment_date DATE,
    supervisor_id INT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_employee_id (employee_id),
    INDEX idx_role (role),
    INDEX idx_assigned_area (assignedArea),
    FOREIGN KEY (supervisor_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- =====================================================
-- ADDITIONAL EMPLOYEE PROFILE TABLES
-- =====================================================

-- Garbage Collectors additional info
CREATE TABLE garbage_collectors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    vehicle_assigned VARCHAR(50),
    route_assigned TEXT,
    shift_start TIME DEFAULT '06:00:00',
    shift_end TIME DEFAULT '14:00:00',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Truck Drivers additional info
CREATE TABLE truck_drivers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    license_expiry DATE,
    vehicle_assigned VARCHAR(50),
    routes_assigned TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Barangay Heads additional info
CREATE TABLE barangay_heads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    barangay_assigned VARCHAR(100) NOT NULL,
    term_start DATE,
    term_end DATE,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- =====================================================
-- NOTIFICATIONS TABLE - Updated to handle both users and employees
-- =====================================================
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipient_type ENUM('user', 'employee') NOT NULL,
    recipient_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'success', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_recipient (recipient_type, recipient_id),
    INDEX idx_created (created)
);

-- =====================================================
-- COLLECTION SCHEDULES TABLE - Updated to reference employees
-- =====================================================
CREATE TABLE collection_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    area_name VARCHAR(100) NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    collection_day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    collection_time TIME NOT NULL,
    truck_driver_id INT,
    status ENUM('pending', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (truck_driver_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- =====================================================
-- COLLECTION TASKS TABLE - Updated to reference employees
-- =====================================================
CREATE TABLE collection_tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    schedule_id INT NOT NULL,
    collector_id INT NOT NULL,
    task_type ENUM('regular', 'special', 'emergency') DEFAULT 'regular',
    status ENUM('pending', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    notes TEXT,
    estimated_duration INT DEFAULT 60, -- in minutes
    actual_duration INT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES collection_schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (collector_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- =====================================================
-- COLLECTION REPORTS TABLE - Updated to handle both users and employees as reporters
-- =====================================================
CREATE TABLE collection_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT,
    reporter_type ENUM('user', 'employee') NOT NULL,
    reporter_id INT NOT NULL,
    waste_type VARCHAR(50),
    waste_quantity DECIMAL(10,2),
    location VARCHAR(255),
    issues TEXT,
    images TEXT,
    status ENUM('pending', 'verified', 'resolved') DEFAULT 'pending',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES collection_tasks(id) ON DELETE SET NULL,
    
    INDEX idx_reporter (reporter_type, reporter_id),
    INDEX idx_status (status)
);

-- =====================================================
-- PICKUP REQUESTS TABLE - For residents to request pickup
-- =====================================================
CREATE TABLE pickup_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    waste_type VARCHAR(50) NOT NULL,
    quantity_estimate VARCHAR(50),
    location_details TEXT,
    preferred_date DATE,
    preferred_time TIME,
    special_instructions TEXT,
    status ENUM('pending', 'approved', 'scheduled', 'completed', 'cancelled') DEFAULT 'pending',
    assigned_collector_id INT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_collector_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample residents
INSERT INTO users (username, password, email, fullName, phone, address, barangay) VALUES
('resident1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'resident1@example.com', 'Juan Dela Cruz', '09123456780', '123 Main St', 'Looc'),
('resident2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'resident2@example.com', 'Maria Santos', '09123456781', '456 Oak Ave', 'Looc'),
('resident3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'resident3@example.com', 'Pedro Reyes', '09123456782', '789 Pine St', 'Poblacion');

-- Insert sample employees
INSERT INTO employees (employee_id, username, password, email, fullName, role, phone, assignedArea, employment_date) VALUES
('ADMIN-001', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@menro.mandaue.gov.ph', 'Administrator', 'admin', '09123456789', 'All Areas', '2024-01-01'),
('BH-001', 'barangayhead1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'bh.looc@mandaue.gov.ph', 'Barangay Captain Looc', 'barangayhead', '09123456783', 'Looc', '2024-01-15'),
('TD-001', 'driver1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'driver1@menro.mandaue.gov.ph', 'Truck Driver One', 'truckdriver', '09123456784', 'Zone 1', '2024-02-01'),
('GC-001', 'collector1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'collector1@menro.mandaue.gov.ph', 'Garbage Collector One', 'garbagecollector', '09123456785', 'Zone 1', '2024-02-01'),
('GC-002', 'collector2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'collector2@menro.mandaue.gov.ph', 'Garbage Collector Two', 'garbagecollector', '09123456786', 'Zone 2', '2024-02-15');

-- Insert additional employee profiles
INSERT INTO truck_drivers (employee_id, license_number, license_expiry, vehicle_assigned) VALUES
(3, 'DL-123456', '2025-12-31', 'TRUCK-001');

INSERT INTO garbage_collectors (employee_id, vehicle_assigned, route_assigned) VALUES
(4, 'TRUCK-001', 'Route A: Looc Area 1-5'),
(5, 'TRUCK-002', 'Route B: Looc Area 6-10');

INSERT INTO barangay_heads (employee_id, barangay_assigned, term_start, term_end) VALUES
(2, 'Looc', '2024-01-15', '2027-01-14');

-- Insert sample schedules
INSERT INTO collection_schedules (area_name, barangay, collection_day, collection_time, truck_driver_id) VALUES
('Zone 1', 'Looc', 'Monday', '08:00:00', 3),
('Zone 1', 'Looc', 'Thursday', '08:00:00', 3),
('Zone 2', 'Looc', 'Tuesday', '09:00:00', 3),
('Zone 2', 'Looc', 'Friday', '09:00:00', 3);

-- Insert sample notifications
INSERT INTO notifications (recipient_type, recipient_id, title, message, type) VALUES
('employee', 1, 'Welcome Admin', 'Welcome to the Koletrash system!', 'info'),
('employee', 2, 'New Assignment', 'You have been assigned as Barangay Head for Looc', 'success'),
('user', 1, 'Account Created', 'Your resident account has been successfully created', 'success'),
('user', 2, 'Collection Schedule', 'Garbage collection in your area is scheduled for Monday 8:00 AM', 'info');

-- Views for easier querying
CREATE VIEW employee_details AS
SELECT 
    e.*,
    CASE 
        WHEN e.role = 'garbagecollector' THEN gc.vehicle_assigned
        WHEN e.role = 'truckdriver' THEN td.vehicle_assigned
        ELSE NULL
    END as vehicle,
    CASE 
        WHEN e.role = 'truckdriver' THEN td.license_number
        ELSE NULL
    END as license_number
FROM employees e
LEFT JOIN garbage_collectors gc ON e.id = gc.employee_id
LEFT JOIN truck_drivers td ON e.id = td.employee_id
LEFT JOIN barangay_heads bh ON e.id = bh.employee_id;
