<?php
// Database configuration for Hostinger MySQL
$host = 'localhost';
$dbname = 'your_database_name'; // Change this
$username = 'your_username';      // Change this
$password = 'your_password';      // Change this

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Admin credentials (change these!)
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'jaipurelite2024'); // Change this!

session_start();
?>