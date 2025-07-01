-- Add 3 dummy truck drivers to the database
-- First, add them to the employees table

INSERT INTO employees (employee_id, username, password, email, fullName, role, phone, assignedArea, employment_date) VALUES
('TD-002', 'driver2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'driver2@menro.mandaue.gov.ph', 'Roberto Dela Rosa', 'truckdriver', '09123456790', 'Zone 2', '2024-03-01'),
('TD-003', 'driver3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'driver3@menro.mandaue.gov.ph', 'Miguel Fernandez', 'truckdriver', '09123456791', 'Zone 3', '2024-03-15'),
('TD-004', 'driver4', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'driver4@menro.mandaue.gov.ph', 'Carlos Mendoza', 'truckdriver', '09123456792', 'Zone 4', '2024-04-01');

-- Then, add their specific truck driver profiles
-- Note: We need to get the IDs of the employees we just inserted
-- Assuming the first truck driver (TD-001) has ID 3, these would be IDs 6, 7, 8

INSERT INTO truck_drivers (employee_id, license_number, license_expiry, vehicle_assigned, routes_assigned) VALUES
(6, 'DL-234567', '2026-06-30', 'TRUCK-002', 'Zone 2: Poblacion, Tipolo'),
(7, 'DL-345678', '2025-11-15', 'TRUCK-003', 'Zone 3: Banilad, Casuntingan'),
(8, 'DL-456789', '2026-03-20', 'TRUCK-004', 'Zone 4: Cabancalan, Canduman');
