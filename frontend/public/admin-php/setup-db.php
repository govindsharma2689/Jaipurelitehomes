<?php
// Database setup script - Run once to create the properties table
// Access this file at: https://jaipurelitehomes.com/admin-php/setup-db.php

$host = 'localhost';
$dbname = 'u264048598_jaipurelite';
$username = 'u264048598_jaipurelite123';
$password = '+csnQU#&o4S';

echo "<h2>Database Setup for Jaipur Elite Homes</h2>";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p style='color:green'>✓ Database connection successful!</p>";
    
    // Create properties table
    $sql = "CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        area VARCHAR(100),
        city VARCHAR(100) DEFAULT 'Jaipur',
        price VARCHAR(100),
        description TEXT,
        full_description TEXT,
        map_link VARCHAR(500),
        type ENUM('Villas', 'Plot') DEFAULT 'Plot',
        featured BOOLEAN DEFAULT FALSE,
        status ENUM('Sales', 'Rentals') DEFAULT 'Sales',
        images JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    echo "<p style='color:green'>✓ Properties table created successfully!</p>";
    
    // Check if table exists and show structure
    $stmt = $pdo->query("DESCRIBE properties");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h3>Table Structure:</h3>";
    echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
    echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";
    foreach ($columns as $col) {
        echo "<tr>";
        echo "<td>{$col['Field']}</td>";
        echo "<td>{$col['Type']}</td>";
        echo "<td>{$col['Null']}</td>";
        echo "<td>{$col['Key']}</td>";
        echo "<td>{$col['Default']}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    // Count existing records
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM properties");
    $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    echo "<p>Current records in table: <strong>{$count}</strong></p>";
    
    echo "<hr>";
    echo "<p style='color:green; font-size:18px;'><strong>✓ Setup Complete!</strong></p>";
    echo "<p>You can now:</p>";
    echo "<ul>";
    echo "<li><a href='login.php'>Go to Admin Login</a></li>";
    echo "<li><a href='index.php'>Go to Admin Dashboard</a> (after login)</li>";
    echo "</ul>";
    echo "<p style='color:red;'><strong>⚠️ Security Note:</strong> Delete this file (setup-db.php) after setup is complete!</p>";
    
} catch(PDOException $e) {
    echo "<p style='color:red'>✗ Error: " . $e->getMessage() . "</p>";
}
?>
