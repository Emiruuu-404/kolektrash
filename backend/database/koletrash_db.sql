-- Create database
CREATE DATABASE IF NOT EXISTS koletrash_db;
USE koletrash_db;

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fullName VARCHAR(100) NOT NULL,
    role ENUM('admin', 'resident', 'barangayhead', 'truckdriver', 'garbagecollector') NOT NULL,
    phone VARCHAR(20),
    assignedArea VARCHAR(100),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create collection_schedules table
CREATE TABLE collection_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    area_name VARCHAR(100) NOT NULL,
    collection_day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    collection_time TIME NOT NULL,
    truck_driver_id INT,
    status ENUM('pending', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (truck_driver_id) REFERENCES users(id)
);

-- Create collection_tasks table
CREATE TABLE collection_tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    schedule_id INT NOT NULL,
    collector_id INT NOT NULL,
    task_type ENUM('regular', 'special') DEFAULT 'regular',
    status ENUM('pending', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES collection_schedules(id),
    FOREIGN KEY (collector_id) REFERENCES users(id)
);

-- Create collection_reports table
CREATE TABLE collection_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    reporter_id INT NOT NULL,
    waste_type VARCHAR(50),
    waste_quantity DECIMAL(10,2),
    issues TEXT,
    images TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES collection_tasks(id),
    FOREIGN KEY (reporter_id) REFERENCES users(id)
);

-- Insert sample data into users table
INSERT INTO users (username, password, email, fullName, role, phone, assignedArea)
VALUES
    ('admin', 'admin_pass', 'admin@example.com', 'Admin User', 'admin', '09123456789', 'All Areas'),
    ('resident1', 'resident_pass', 'resident1@example.com', 'Resident One', 'resident', '09123456780', 'Area 1'),
    ('barangayhead1', 'barangayhead_pass', 'barangayhead1@example.com', 'Barangay Head One', 'barangayhead', '09123456781', 'Area 1'),
    ('truckdriver1', 'truckdriver_pass', 'truckdriver1@example.com', 'Truck Driver One', 'truckdriver', '09123456782', 'Area 1'),
    ('garbagecollector1', 'garbagecollector_pass', 'garbagecollector1@example.com', 'Garbage Collector One', 'garbagecollector', '09123456783', 'Area 1');

-- Insert sample data into notifications table
INSERT INTO notifications (user_id, message)
VALUES
    (1, 'Welcome to the Koletrash system, Admin!'),
    (2, 'Your account has been created, Resident One!'),
    (3, 'You are now the Barangay Head for Area 1.'),
    (4, 'Your truck is scheduled for maintenance on Friday.'),
    (5, 'Garbage collection in your area is scheduled for tomorrow.');

-- Insert sample data into collection_schedules table
INSERT INTO collection_schedules (area_name, collection_day, collection_time, truck_driver_id)
VALUES
    ('Area 1', 'Monday', '08:00:00', 4),
    ('Area 1', 'Thursday', '08:00:00', 4),
    ('Area 2', 'Tuesday', '09:00:00', 5),
    ('Area 2', 'Friday', '09:00:00', 5);

-- Insert sample data into collection_tasks table
INSERT INTO collection_tasks (schedule_id, collector_id, task_type)
VALUES
    (1, 5, 'regular'),
    (2, 5, 'regular'),
    (3, 4, 'special'),
    (4, 4, 'regular');

-- Insert sample data into collection_reports table
INSERT INTO collection_reports (task_id, reporter_id, waste_type, waste_quantity, issues, images)
VALUES
    (1, 2, 'Plastic', 10.5, 'None', 'image1.jpg,image2.jpg'),
    (2, 2, 'Organic', 5.0, 'Delay in collection', 'image3.jpg'),
    (3, 3, 'Metal', 2.5, 'None', 'image4.jpg'),
    (4, 3, 'Glass', 1.0, 'Broken glass found', 'image5.jpg');

-- Copy all files from: C:\Users\Emiruuu\Desktop\KOLETRASH\backend
-- To: C:\xampp\htdocs\koletrash\backend

{
    "username": "admin",
    "password": "admin_pass"
}
