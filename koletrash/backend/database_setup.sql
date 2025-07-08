-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS kolektrash_db;
USE kolektrash_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    barangay VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('resident', 'admin', 'barangay_head', 'truck_driver') DEFAULT 'resident',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_barangay (barangay)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some sample data (optional)
-- INSERT INTO users (full_name, email, username, barangay, password, user_type) VALUES
-- ('Admin User', 'admin@kolektrash.com', 'admin', 'North Centro (Poblacion)', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'); 

CREATE TABLE cluster (
    cluster_id VARCHAR(50) PRIMARY KEY,
    cluster_name VARCHAR(100) NOT NULL,
    type_of_area VARCHAR(50)
);

CREATE TABLE barangay_head (
    user_id VARCHAR(50) PRIMARY KEY,
    term_start DATE,
    term_end DATE,
    position_title VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE barangay (
    barangay_id VARCHAR(50) PRIMARY KEY,
    barangay_name VARCHAR(100) NOT NULL,
    cluster_id VARCHAR(50),
    barangay_head_id VARCHAR(50),
    FOREIGN KEY (cluster_id) REFERENCES cluster(cluster_id),
    FOREIGN KEY (barangay_head_id) REFERENCES barangay_head(user_id)
); 