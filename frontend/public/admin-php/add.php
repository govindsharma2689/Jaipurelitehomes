<?php
require_once 'config.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

$error = '';
$success = '';

// Handle image upload
function uploadImages($files, $propertyId) {
    $uploadedPaths = [];
    $uploadDir = '../images/properties/prop-' . $propertyId . '/';
    
    // Create directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    foreach ($files['tmp_name'] as $key => $tmpName) {
        if ($files['error'][$key] === UPLOAD_ERR_OK) {
            $originalName = $files['name'][$key];
            $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
            
            // Only allow image files
            $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            if (!in_array($extension, $allowedTypes)) {
                continue;
            }
            
            // Generate unique filename
            $newFileName = 'image-' . ($key + 1) . '.' . $extension;
            $targetPath = $uploadDir . $newFileName;
            
            if (move_uploaded_file($tmpName, $targetPath)) {
                $uploadedPaths[] = '/images/properties/prop-' . $propertyId . '/' . $newFileName;
            }
        }
    }
    
    return $uploadedPaths;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $location = $_POST['location'] ?? '';
    $area = $_POST['area'] ?? '';
    $city = $_POST['city'] ?? 'Jaipur';
    $price = $_POST['price'] ?? '';
    $description = $_POST['description'] ?? '';
    $full_description = $_POST['full_description'] ?? '';
    $map_link = $_POST['map_link'] ?? '';
    $type = $_POST['type'] ?? 'Plot';
    $featured = isset($_POST['featured']) ? 1 : 0;
    $status = $_POST['status'] ?? 'Sales';
    
    // Get existing image URLs (if any)
    $existingImages = array_filter(array_map('trim', explode("\n", $_POST['existing_images'] ?? '')));
    
    try {
        // First insert to get the ID
        $stmt = $pdo->prepare("
            INSERT INTO properties (title, location, area, city, price, description, full_description, map_link, type, featured, status, images)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]')
        ");
        $stmt->execute([$title, $location, $area, $city, $price, $description, $full_description, $map_link, $type, $featured, $status]);
        $propertyId = $pdo->lastInsertId();
        
        // Handle file uploads
        $uploadedImages = [];
        if (isset($_FILES['images']) && !empty($_FILES['images']['name'][0])) {
            $uploadedImages = uploadImages($_FILES['images'], $propertyId);
        }
        
        // Combine existing URLs and uploaded images
        $allImages = array_merge($existingImages, $uploadedImages);
        
        // Update with images
        $stmt = $pdo->prepare("UPDATE properties SET images = ? WHERE id = ?");
        $stmt->execute([json_encode($allImages), $propertyId]);
        
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
        
        <form method="POST" enctype="multipart/form-data" class="bg-white rounded-lg shadow p-6 space-y-4">
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
                <label class="block text-gray-700 mb-2">Short Description</label>
                <textarea name="description" rows="3"
                          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Brief description for property cards"></textarea>
            </div>
            
            <div>
                <label class="block text-gray-700 mb-2">Full Description</label>
                <textarea name="full_description" rows="8"
                          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Detailed description with Location, Property Details, etc."></textarea>
                <p class="text-sm text-gray-500 mt-1">Use line breaks for sections like Location:, Property Details:, etc.</p>
            </div>
            
            <div>
                <label class="block text-gray-700 mb-2">Google Maps Link</label>
                <input type="text" name="map_link" placeholder="https://maps.app.goo.gl/..."
                       class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
                <label class="block text-gray-700 mb-2">Upload Images</label>
                <input type="file" name="images[]" multiple accept="image/*"
                       class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <p class="text-sm text-gray-500 mt-1">Select multiple images (JPG, PNG, GIF, WebP)</p>
            </div>
            
            <div>
                <label class="block text-gray-700 mb-2">Or Enter Image URLs (one per line)</label>
                <textarea name="existing_images" rows="3" placeholder="/images/properties/prop-1/image-1.png"
                          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
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
