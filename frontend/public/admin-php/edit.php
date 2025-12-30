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
    
    $imageUrls = array_filter(array_map('trim', explode("\n", $_POST['images'] ?? '')));
    $imagesJson = json_encode($imageUrls);
    
    try {
        $stmt = $pdo->prepare("
            UPDATE properties SET 
                title = ?, location = ?, area = ?, city = ?, price = ?, 
                description = ?, type = ?, featured = ?, status = ?, images = ?
            WHERE id = ?
        ");
        $stmt->execute([$title, $location, $area, $city, $price, $description, $type, $featured, $status, $imagesJson, $id]);
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
    
    <div class="max-w-3xl mx-auto p-6">
        <?php if ($error): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" class="bg-white rounded-lg shadow p-6 space-y-4">
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
                <label class="block text-gray-700 mb-2">Description</label>
                <textarea name="description" rows="4"
                          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($property['description']); ?></textarea>
            </div>
            
            <div>
                <label class="block text-gray-700 mb-2">Image URLs (one per line)</label>
                <textarea name="images" rows="4"
                          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars(implode("\n", $images)); ?></textarea>
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