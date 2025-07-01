-- Update users with proper barangay assignments
-- This script adds barangay information to existing users

USE koletrash_db;

-- Update existing users with proper barangay assignments
UPDATE users SET assignedArea = 'North Centro (Poblacion)' WHERE id = 2 AND role = 'resident';
UPDATE users SET assignedArea = 'South Centro (Poblacion)' WHERE id = 3 AND role = 'barangayhead';
UPDATE users SET assignedArea = 'North Centro (Poblacion)' WHERE id = 4 AND role = 'truckdriver';
UPDATE users SET assignedArea = 'North Centro (Poblacion)' WHERE id = 5 AND role = 'garbagecollector';

-- Add more sample residents with different barangays
INSERT INTO users (username, password, email, fullName, role, phone, assignedArea)
VALUES
    ('resident2', 'resident_pass', 'resident2@example.com', 'Maria Santos', 'resident', '09123456785', 'South Centro (Poblacion)'),
    ('resident3', 'resident_pass', 'resident3@example.com', 'Juan Cruz', 'resident', '09123456786', 'Impig'),
    ('resident4', 'resident_pass', 'resident4@example.com', 'Anna Garcia', 'resident', '09123456787', 'Tara'),
    ('resident5', 'resident_pass', 'resident5@example.com', 'Pedro Reyes', 'resident', '09123456788', 'Aldezar');

-- Add more barangay heads for different areas
INSERT INTO users (username, password, email, fullName, role, phone, assignedArea)
VALUES
    ('bhead2', 'barangayhead_pass', 'bhead2@example.com', 'Captain Jose', 'barangayhead', '09123456790', 'Impig'),
    ('bhead3', 'barangayhead_pass', 'bhead3@example.com', 'Captain Linda', 'barangayhead', '09123456791', 'Tara');

-- Add more garbage collectors and truck drivers for different areas
INSERT INTO users (username, password, email, fullName, role, phone, assignedArea)
VALUES
    ('collector2', 'garbagecollector_pass', 'collector2@example.com', 'Mark Collector', 'garbagecollector', '09123456792', 'South Centro (Poblacion)'),
    ('collector3', 'garbagecollector_pass', 'collector3@example.com', 'Luis Worker', 'garbagecollector', '09123456793', 'Impig'),
    ('driver2', 'truckdriver_pass', 'driver2@example.com', 'Carlos Driver', 'truckdriver', '09123456794', 'South Centro (Poblacion)');

-- Update collection schedules with proper barangay names
UPDATE collection_schedules SET area_name = 'North Centro (Poblacion)' WHERE id = 1;
UPDATE collection_schedules SET area_name = 'North Centro (Poblacion)' WHERE id = 2;
UPDATE collection_schedules SET area_name = 'South Centro (Poblacion)' WHERE id = 3;
UPDATE collection_schedules SET area_name = 'South Centro (Poblacion)' WHERE id = 4;

-- Add more collection schedules for other barangays
INSERT INTO collection_schedules (area_name, collection_day, collection_time, truck_driver_id)
VALUES
    ('Impig', 'Wednesday', '07:00:00', 4),
    ('Impig', 'Saturday', '07:00:00', 4),
    ('Tara', 'Tuesday', '10:00:00', 10),
    ('Tara', 'Friday', '10:00:00', 10),
    ('Aldezar', 'Monday', '06:00:00', 10),
    ('Aldezar', 'Thursday', '06:00:00', 10);
