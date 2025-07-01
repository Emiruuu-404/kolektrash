-- Create the database
CREATE DATABASE IF NOT EXISTS koletrash_db;
USE koletrash_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fullName VARCHAR(100) NOT NULL,
    role ENUM('admin', 'resident', 'barangayhead', 'truckdriver', 'garbagecollector') NOT NULL,
    phone VARCHAR(20),
    assignedArea VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample admin user (password: admin123)
INSERT INTO users (username, password, email, fullName, role, phone, assignedArea) 
VALUES (
    'admin',
    '$2y$10$8FPr.DQyCFyqVE3zpR/4V.m4/zBYhY.MUoVtB2qaG8fFx0mUPUmVC',
    'admin@koletrash.com',
    'System Administrator',
    'admin',
    '09123456789',
    'All Areas'
);

-- Insert sample resident user (password: password)
INSERT INTO users (username, password, email, fullName, role, phone, assignedArea) 
VALUES (
    'resident1',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'resident@email.com',
    'John Doe',
    'resident',
    '09987654321',
    'Barangay 1'
);

-- Insert sample truck driver user (password: driver123)
INSERT INTO users (username, password, email, fullName, role, phone, assignedArea) 
VALUES (
    'truckdriver1',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'driver@koletrash.com',
    'Juan Dela Cruz',
    'truckdriver',
    '09123456782',
    'Area 1'
);

-- Insert sample garbage collector user (password: collector123)
INSERT INTO users (username, password, email, fullName, role, phone, assignedArea) 
VALUES (
    'collector1',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'collector@koletrash.com',
    'Maria Santos',
    'garbagecollector',
    '09123456783',
    'Brgy. Looc'
);
