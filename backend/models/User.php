<?php
class User {
    // Database connection and table name
    private $conn;
    private $table = 'user_account';

    // Object Properties
    public $id;
    public $username;
    public $password;
    public $email;
    public $fullName;
    public $role;
    public $phone;
    public $assignedArea;

    // Constructor with DB
    public function __construct($db) {
        $this->conn = $db;
    }

    // Login User
    public function login() {
        $query = "SELECT * FROM " . $this->table . " WHERE username = :username LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $this->username = htmlspecialchars(strip_tags($this->username));
        $stmt->bindParam(':username', $this->username);
        $stmt->execute();
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if($this->password === $row['password']) {
                $this->id = $row['user_id'];
                $this->email = $row['email'];
                $this->fullName = $row['username'];
                $this->role = $row['role'];
                $this->phone = null;
                $this->assignedArea = null;
                return true;
            }
        }
        // Try admin table if not found in user_account
        $query = "SELECT * FROM admin WHERE username = :username LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $this->username);
        $stmt->execute();
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if($this->password === $row['password']) {
                $this->id = $row['admin_id'];
                $this->email = $row['email'];
                $this->fullName = trim(($row['firstname'] ?? '') . ' ' . ($row['lastname'] ?? ''));
                $this->role = 'admin';
                $this->phone = $row['contact_num'] ?? null;
                $this->assignedArea = $row['address'] ?? null;
                return true;
            }
        }
        return false;
    }

    // Check if username exists
    public function usernameExists() {
        $query = "SELECT user_id FROM " . $this->table . " WHERE username = :username LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $this->username);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Check if email exists
    public function emailExists() {
        $query = "SELECT user_id FROM " . $this->table . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $this->email);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Register New User
    public function create() {
        $query = "INSERT INTO " . $this->table . " (username, password, email, role) VALUES (:username, :password, :email, :role)";
        $stmt = $this->conn->prepare($query);
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->role = htmlspecialchars(strip_tags($this->role));
        // For demo: plain password (replace with password_hash for production)
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':role', $this->role);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}