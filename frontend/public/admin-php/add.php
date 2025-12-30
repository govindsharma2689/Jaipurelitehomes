<?php
require_once 'config.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $location = $_POST['location'] ?? '';
    $area = $_POST['area'] ?? '';
    $city = $_POST['city'] ?? 'Jaipur';
    $price = $_POST['price'] ?? '';
    $description = $_POST['description'] ?? '';
    $type = $_POST['type'] ?? 'Plot';
    $featured = isset($_POST['featured']) ? 1 : 0;
    $status = $_POST['status'] ?? 'Sales';
    
    // Handle image URLs (comma separated)
    $imageUrls = array_filter(array_map('trim', explode("\n", $_POST['images'] ?? '')));
    $imagesJson = json_encode($imageUrls);
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO properties (title, location, area, city, price, description, type, featured, status, images)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$title, $location, $area, $city, $price, $description, $type, $featured, $status, $imagesJson]);
        header('Location: index.php?msg=saved');
        exit;
    } catch (Exception $e) {
        $error = 'Error saving property: ' . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Property - Jaipur Elite Homes</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <nav class="bg-blue-600 text-white p-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <h1 class="text-xl font-bold">Add New Property</h1>
            <a href="index.php" class="bg-white text-blue-600 px-4 py-2 rounded">Back to List</a>
        </div>
    </nav>
    
    <div class="max-w-3xl mx-auto p-6">
        <?php if ($error): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" class="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
                <label class="block text-gray-700 mb-2">Title *</label>
                <input type="text" name="title" required
                       class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-gray-700 mb-2">Location</label>
                    <input type="text" name="location"
                           class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">Area</label>
                    <input type="text" name="area"
                           class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-gray-700 mb-2">City</label>
                    <input type="text" name="city" value="Jaipur"
                           class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">Price *</label>
                    <input type="text" name="price" required placeholder="e.g., ₹ 2.35 crore"
                           class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-gray-700 mb-2">Type</label>
                    <select name="type" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Plot">Plot</option>
                        <option value="Villas">Villas</option>
                    </select>
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">Status</label>
                    <select name="status" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Sales">Sales</option>
                        <option value="Rentals">Rentals</option>
                    </select>
                </div>
            </div>
            
            <div>
                <label class="block text-gray-700 mb-2">Description</label>
                <textarea name="description" rows="4"
                          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            
            <div>
                <label class="block text-gray-700 mb-2">Image URLs (one per line)</label>
                <textarea name="images" rows="4" placeholder="/images/properties/prop-1/image-1.png"
                          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                <p class="text-sm text-gray-500 mt-1">Enter image paths relative to the website root</p>
            </div>
            
            <div>
                <label class="flex items-center">
                    <input type="checkbox" name="featured" class="mr-2">
                    <span class="text-gray-700">Featured Property</span>
                </label>
            </div>
            
            <button type="submit" 
                    class="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
                Add Property
            </button>
        </form>
    </div>
</body>
</html>