<?php
require_once 'config.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// Get all properties
$stmt = $pdo->query("SELECT * FROM properties ORDER BY id ASC");
$properties = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Format for JSON export
$exportData = array_map(function($prop) {
    return [
        'id' => (string)$prop['id'],
        'title' => $prop['title'],
        'location' => $prop['location'],
        'area' => $prop['area'],
        'city' => $prop['city'],
        'price' => $prop['price'],
        'description' => $prop['description'],
        'full_description' => $prop['full_description'] ?? '',
        'map_link' => $prop['map_link'] ?? '',
        'type' => $prop['type'],
        'featured' => (bool)$prop['featured'],
        'status' => $prop['status'],
        'images' => json_decode($prop['images'], true) ?? [],
        'image' => json_decode($prop['images'], true)[0] ?? null,
        'images_count' => count(json_decode($prop['images'], true) ?? [])
    ];
}, $properties);

// Save to data folder
$jsonPath = '../data/properties.json';
if (!is_dir('../data')) {
    mkdir('../data', 0755, true);
}
file_put_contents($jsonPath, json_encode($exportData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

header('Location: index.php?msg=exported');
exit;
?>