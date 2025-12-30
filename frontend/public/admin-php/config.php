<?php
// Database configuration for Hostinger MySQL
$host = 'localhost';
$dbname = 'u264048598_jaipurelite';
$username = 'u264048598_jaipurelite123';
$password = '+csnQU#&o4S';

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