<?php
/**
 * Database Migration Script
 * Migrates data from old single users table to new users + employees structure
 */

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    echo "Starting database migration...\n";

    // Start transaction
    $db->beginTransaction();

    // 1. Create backup of existing users table
    echo "1. Creating backup of existing users table...\n";
    $backupQuery = "CREATE TABLE users_backup AS SELECT * FROM users";
    $db->exec($backupQuery);
    echo "   Backup created: users_backup\n";

    // 2. Create new table structure (run the new SQL first)
    echo "2. Please run the new database structure (koletrash_db_new.sql) first, then continue...\n";
    echo "   Press Enter when ready to continue migration...";
    readline();

    // 3. Migrate resident users
    echo "3. Migrating resident users...\n";
    $residentsQuery = "SELECT * FROM users_backup WHERE role = 'resident'";
    $residentsStmt = $db->query($residentsQuery);
    $residentCount = 0;

    while ($resident = $residentsStmt->fetch(PDO::FETCH_ASSOC)) {
        $insertQuery = "INSERT INTO users (username, password, email, fullName, phone, barangay, created) 
                       VALUES (:username, :password, :email, :fullName, :phone, :assignedArea, :created)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->execute([
            ':username' => $resident['username'],
            ':password' => $resident['password'],
            ':email' => $resident['email'],
            ':fullName' => $resident['fullName'],
            ':phone' => $resident['phone'],
            ':assignedArea' => $resident['assignedArea'] ?: 'Not Specified',
            ':created' => $resident['created']
        ]);
        $residentCount++;
    }
    echo "   Migrated $residentCount residents\n";

    // 4. Migrate employee users
    echo "4. Migrating employee users...\n";
    $employeesQuery = "SELECT * FROM users_backup WHERE role IN ('admin', 'barangayhead', 'truckdriver', 'garbagecollector')";
    $employeesStmt = $db->query($employeesQuery);
    $employeeCount = 0;

    while ($employee = $employeesStmt->fetch(PDO::FETCH_ASSOC)) {
        // Generate employee ID based on role
        $rolePrefix = [
            'admin' => 'ADMIN',
            'barangayhead' => 'BH',
            'truckdriver' => 'TD',
            'garbagecollector' => 'GC'
        ];
        
        $prefix = $rolePrefix[$employee['role']];
        $employeeId = $prefix . '-' . str_pad($employee['id'], 3, '0', STR_PAD_LEFT);

        $insertQuery = "INSERT INTO employees (employee_id, username, password, email, fullName, role, phone, assignedArea, employment_date, created) 
                       VALUES (:employee_id, :username, :password, :email, :fullName, :role, :phone, :assignedArea, :employment_date, :created)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->execute([
            ':employee_id' => $employeeId,
            ':username' => $employee['username'],
            ':password' => $employee['password'],
            ':email' => $employee['email'],
            ':fullName' => $employee['fullName'],
            ':role' => $employee['role'],
            ':phone' => $employee['phone'],
            ':assignedArea' => $employee['assignedArea'],
            ':employment_date' => date('Y-m-d', strtotime($employee['created'])),
            ':created' => $employee['created']
        ]);
        
        $newEmployeeId = $db->lastInsertId();

        // Create role-specific profiles
        if ($employee['role'] === 'garbagecollector') {
            $profileQuery = "INSERT INTO garbage_collectors (employee_id, route_assigned) 
                            VALUES (:employee_id, :route)";
            $profileStmt = $db->prepare($profileQuery);
            $profileStmt->execute([
                ':employee_id' => $newEmployeeId,
                ':route' => 'Route for ' . $employee['assignedArea']
            ]);
        } elseif ($employee['role'] === 'truckdriver') {
            $profileQuery = "INSERT INTO truck_drivers (employee_id, license_number) 
                            VALUES (:employee_id, :license)";
            $profileStmt = $db->prepare($profileQuery);
            $profileStmt->execute([
                ':employee_id' => $newEmployeeId,
                ':license' => 'LIC-' . $newEmployeeId
            ]);
        } elseif ($employee['role'] === 'barangayhead') {
            $profileQuery = "INSERT INTO barangay_heads (employee_id, barangay_assigned, term_start) 
                            VALUES (:employee_id, :barangay, :term_start)";
            $profileStmt = $db->prepare($profileQuery);
            $profileStmt->execute([
                ':employee_id' => $newEmployeeId,
                ':barangay' => $employee['assignedArea'],
                ':term_start' => date('Y-m-d')
            ]);
        }

        $employeeCount++;
    }
    echo "   Migrated $employeeCount employees\n";

    // 5. Update foreign key references in other tables
    echo "5. Updating foreign key references...\n";
    
    // Update notifications table
    $updateNotificationsQuery = "UPDATE notifications n 
                                JOIN users_backup ub ON n.user_id = ub.id 
                                LEFT JOIN users u ON ub.username = u.username AND ub.role = 'resident'
                                LEFT JOIN employees e ON ub.username = e.username AND ub.role != 'resident'
                                SET n.recipient_type = CASE WHEN u.id IS NOT NULL THEN 'user' ELSE 'employee' END,
                                    n.recipient_id = COALESCE(u.id, e.id)";
    $db->exec($updateNotificationsQuery);

    // Update collection schedules
    $updateSchedulesQuery = "UPDATE collection_schedules cs
                            JOIN users_backup ub ON cs.truck_driver_id = ub.id
                            JOIN employees e ON ub.username = e.username
                            SET cs.truck_driver_id = e.id";
    $db->exec($updateSchedulesQuery);

    // Update collection tasks
    $updateTasksQuery = "UPDATE collection_tasks ct
                        JOIN users_backup ub ON ct.collector_id = ub.id
                        JOIN employees e ON ub.username = e.username
                        SET ct.collector_id = e.id";
    $db->exec($updateTasksQuery);

    echo "   Foreign key references updated\n";

    // Commit transaction
    $db->commit();

    echo "\nMigration completed successfully!\n";
    echo "Summary:\n";
    echo "- Migrated $residentCount residents to users table\n";
    echo "- Migrated $employeeCount employees to employees table\n";
    echo "- Updated foreign key references\n";
    echo "- Original data backed up in users_backup table\n";
    echo "\nYou can now drop the old users table and rename users_backup if needed.\n";

} catch (Exception $e) {
    // Rollback on error
    if ($db->inTransaction()) {
        $db->rollback();
    }
    echo "Migration failed: " . $e->getMessage() . "\n";
    echo "Transaction rolled back. Database unchanged.\n";
}
?>
