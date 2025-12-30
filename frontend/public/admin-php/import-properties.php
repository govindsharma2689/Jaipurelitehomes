<?php
// Import properties from JSON to MySQL database
// Access this file at: https://jaipurelitehomes.com/admin-php/import-properties.php

$host = 'localhost';
$dbname = 'u264048598_jaipurelite';
$username = 'u264048598_jaipurelite123';
$password = '+csnQU#&o4S';

echo "<h2>Import Properties from JSON to MySQL</h2>";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p style='color:green'>✓ Database connection successful!</p>";
    
    // Read properties.json
    $jsonFile = '../data/properties.json';
    if (!file_exists($jsonFile)) {
        die("<p style='color:red'>✗ properties.json not found!</p>");
    }
    
    $jsonData = file_get_contents($jsonFile);
    $properties = json_decode($jsonData, true);
    
    if (!$properties) {
        die("<p style='color:red'>✗ Failed to parse JSON!</p>");
    }
    
    echo "<p>Found <strong>" . count($properties) . "</strong> properties to import.</p>";
    
    // Clear existing data (optional - comment out if you want to keep existing)
    $pdo->exec("TRUNCATE TABLE properties");
    echo "<p>✓ Cleared existing records.</p>";
    
    // Prepare insert statement
    $stmt = $pdo->prepare("
        INSERT INTO properties (id, title, location, area, city, price, description, full_description, map_link, type, featured, status, images, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ");
    
    $imported = 0;
    foreach ($properties as $prop) {
        try {
            $stmt->execute([
                $prop['id'],
                $prop['title'] ?? '',
                $prop['location'] ?? '',
                $prop['area'] ?? '',
                $prop['city'] ?? 'Jaipur',
                $prop['price'] ?? '',
                $prop['description'] ?? '',
                $prop['full_description'] ?? '',
                $prop['map_link'] ?? '',
                $prop['type'] ?? 'Plot',
                $prop['featured'] ? 1 : 0,
                $prop['status'] ?? 'Sales',
                json_encode($prop['images'] ?? [])
            ]);
            $imported++;
            echo "<p style='color:green'>✓ Imported: {$prop['title']}</p>";
        } catch (Exception $e) {
            echo "<p style='color:orange'>⚠ Skipped {$prop['title']}: " . $e->getMessage() . "</p>";
        }
    }
    
    echo "<hr>";
    echo "<p style='color:green; font-size:18px;'><strong>✓ Import Complete! {$imported} properties imported.</strong></p>";
    echo "<p><a href='index.php'>Go to Admin Dashboard</a></p>";
    echo "<p style='color:red;'><strong>⚠️ Delete this file after import!</strong></p>";
    
} catch(PDOException $e) {
    echo "<p style='color:red'>✗ Error: " . $e->getMessage() . "</p>";
}
?>
