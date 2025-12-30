<?php
require_once 'config.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

$id = $_GET['id'] ?? null;
if (!$id) {
    header('Location: index.php');
    exit;
}

// Get property
$stmt = $pdo->prepare("SELECT * FROM properties WHERE id = ?");
$stmt->execute([$id]);
$property = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$property) {
    header('Location: index.php');
    exit;
}

$error = '';

// Handle image upload
function uploadImages($files, $propertyId) {
    $uploadedPaths = [];
    $uploadDir = '../images/properties/prop-' . $propertyId . '/';
    
    // Create directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Get existing files count to continue numbering
    $existingFiles = glob($uploadDir . '*');
    $startIndex = count($existingFiles) + 1;
    
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
            $newFileName = 'image-' . ($startIndex + $key) . '-' . time() . '.' . $extension;
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
    
    // Get kept images (existing ones user wants to keep)
    $keptImages = $_POST['kept_images'] ?? [];
    if (!is_array($keptImages)) {
        $keptImages = [];
    }
    
    // Handle new file uploads
    $newUploadedImages = [];
    if (isset($_FILES['new_images']) && !empty($_FILES['new_images']['name'][0])) {
        $newUploadedImages = uploadImages($_FILES['new_images'], $id);
    }
    
    // Add any manually entered URLs
    $manualUrls = array_filter(array_map('trim', explode("\n", $_POST['manual_urls'] ?? '')));
    
    // Combine all images
    $allImages = array_merge($keptImages, $newUploadedImages, $manualUrls);
    $imagesJson = json_encode(array_values($allImages));
    
    try {
        $stmt = $pdo->prepare("
            UPDATE properties SET 
                title = ?, location = ?, area = ?, city = ?, price = ?, 
                description = ?, full_description = ?, map_link = ?, type = ?, featured = ?, status = ?, images = ?
            WHERE id = ?
        ");
        $stmt->execute([$title, $location, $area, $city, $price, $description, $full_description, $map_link, $type, $featured, $status, $imagesJson, $id]);
        header('Location: index.php?msg=saved');
        exit;
    } catch (Exception $e) {
        $error = 'Error saving property: ' . $e->getMessage();
    }
}

$images = json_decode($property['images'], true) ?? [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Property - Jaipur Elite Homes</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <nav class="bg-blue-600 text-white p-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <h1 class="text-xl font-bold">Edit Property</h1>
            <a href="index.php" class="bg-white text-blue-600 px-4 py-2 rounded">Back to List</a>
        </div>
    </nav>
    
    <div class="max-w-4xl mx-auto p-6">
        <?php if ($error): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" enctype="multipart/form-data" class="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
                <label class="block text-gray-700 mb-2">Title *</label>
                <input type="text" name="title" required value="<?php echo htmlspecialchars($property['title']); ?>"
                       class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-gray-700 mb-2">Location</label>
                    <input type="text" name="location" value="<?php echo htmlspecialchars($property['location']); ?>"
                           class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">Area</label>
                    <input type="text" name="area" value="<?php echo htmlspecialchars($property['area']); ?>"
                           class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-gray-700 mb-2">City</label>
                    <input type="text" name="city" value="<?php echo htmlspecialchars($property['city']); ?>"
                           class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">Price *</label>
                    <input type="text" name="price" required value="<?php echo htmlspecialchars($property['price']); ?>"
                           class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-gray-700 mb-2">Type</label>
                    <select name="type" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Plot" <?php echo $property['type'] === 'Plot' ? 'selected' : ''; ?>>Plot</option>
                        <option value="Villas" <?php echo $property['type'] === 'Villas' ? 'selected' : ''; ?>>Villas</option>
                    </select>
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">Status</label>
                    <select name="status" class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Sales" <?php echo $property['status'] === 'Sales' ? 'selected' : ''; ?>>Sales</option>
                        <option value="Rentals" <?php echo $property['status'] === 'Rentals' ? 'selected' : ''; ?>>Rentals</option>
                    </select>
                </div>
            </div>
            
            <div>
                <label class="block text-gray-700 mb-2">Short Description</label>
                <textarea name="description" rows="3"
                          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Brief description for property cards"><?php echo htmlspecialchars($property['description'] ?? ''); ?></textarea>
            </div>
            
            <div>
                <label class="block text-gray-700 mb-2">Full Description</label>
                <textarea name="full_description" rows="8"
                          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Detailed description with Location, Property Details, etc."><?php echo htmlspecialchars($property['full_description'] ?? ''); ?></textarea>
                <p class="text-sm text-gray-500 mt-1">Use line breaks for sections like Location:, Property Details:, etc.</p>
            </div>
            
            <div>
                <label class="block text-gray-700 mb-2">Google Maps Link</label>
                <input type="text" name="map_link" value="<?php echo htmlspecialchars($property['map_link'] ?? ''); ?>"
                       placeholder="https://maps.app.goo.gl/..."
                       class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <!-- Current Images -->
            <?php if (!empty($images)): ?>
            <div>
                <label class="block text-gray-700 mb-2">Current Images (<?php echo count($images); ?>)</label>
                <p class="text-sm text-gray-500 mb-2">Uncheck to remove an image</p>
                <div class="grid grid-cols-4 gap-4">
                    <?php foreach ($images as $index => $img): ?>
                    <div class="relative">
                        <img src="<?php echo htmlspecialchars($img); ?>" alt="Image <?php echo $index + 1; ?>" 
                             class="w-full h-24 object-cover rounded border">
                        <label class="absolute top-1 right-1 bg-white rounded p-1 shadow">
                            <input type="checkbox" name="kept_images[]" value="<?php echo htmlspecialchars($img); ?>" checked>
                        </label>
                        <span class="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                            <?php echo $index + 1; ?>
                        </span>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
            
            <div>
                <label class="block text-gray-700 mb-2">Upload New Images</label>
                <input type="file" name="new_images[]" multiple accept="image/*"
                       class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <p class="text-sm text-gray-500 mt-1">Select multiple images to add (JPG, PNG, GIF, WebP)</p>
            </div>
            
            <div>
                <label class="block text-gray-700 mb-2">Or Add Image URLs (one per line)</label>
                <textarea name="manual_urls" rows="2" placeholder="/images/properties/prop-1/new-image.png"
                          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            
            <div>
                <label class="flex items-center">
                    <input type="checkbox" name="featured" class="mr-2" <?php echo $property['featured'] ? 'checked' : ''; ?>>
                    <span class="text-gray-700">Featured Property</span>
                </label>
            </div>
            
            <button type="submit" 
                    class="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
                Update Property
            </button>
        </form>
    </div>
</body>
</html>
