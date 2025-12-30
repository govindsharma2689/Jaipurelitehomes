<?php
require_once 'config.php';

// Check login
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// Handle actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        if ($_POST['action'] === 'delete' && isset($_POST['id'])) {
            $stmt = $pdo->prepare("DELETE FROM properties WHERE id = ?");
            $stmt->execute([$_POST['id']]);
            header('Location: index.php?msg=deleted');
            exit;
        }
    }
}

// Get all properties
$stmt = $pdo->query("SELECT * FROM properties ORDER BY created_at DESC");
$properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Jaipur Elite Homes</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <nav class="bg-blue-600 text-white p-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <h1 class="text-xl font-bold">Jaipur Elite Homes - Admin</h1>
            <div class="space-x-4">
                <a href="add.php" class="bg-white text-blue-600 px-4 py-2 rounded">Add Property</a>
                <a href="export.php" class="bg-green-500 text-white px-4 py-2 rounded">Export JSON</a>
                <a href="logout.php" class="bg-red-500 text-white px-4 py-2 rounded">Logout</a>
            </div>
        </div>
    </nav>
    
    <div class="max-w-7xl mx-auto p-6">
        <?php if (isset($_GET['msg'])): ?>
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <?php echo $_GET['msg'] === 'deleted' ? 'Property deleted!' : 'Property saved!'; ?>
            </div>
        <?php endif; ?>
        
        <div class="bg-white rounded-lg shadow">
            <div class="p-4 border-b">
                <h2 class="text-lg font-semibold">All Properties (<?php echo count($properties); ?>)</h2>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left">Image</th>
                            <th class="px-4 py-3 text-left">Title</th>
                            <th class="px-4 py-3 text-left">Type</th>
                            <th class="px-4 py-3 text-left">Price</th>
                            <th class="px-4 py-3 text-left">Status</th>
                            <th class="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($properties as $prop): ?>
                        <?php $images = json_decode($prop['images'], true) ?? []; ?>
                        <tr class="border-b hover:bg-gray-50">
                            <td class="px-4 py-3">
                                <img src="<?php echo htmlspecialchars($images[0] ?? '/images/properties/default-plot.jpg'); ?>" 
                                     class="w-16 h-12 object-cover rounded" alt="">
                            </td>
                            <td class="px-4 py-3">
                                <div class="font-medium"><?php echo htmlspecialchars($prop['title']); ?></div>
                                <div class="text-sm text-gray-500"><?php echo htmlspecialchars($prop['location']); ?></div>
                            </td>
                            <td class="px-4 py-3">
                                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                    <?php echo htmlspecialchars($prop['type']); ?>
                                </span>
                            </td>
                            <td class="px-4 py-3 font-medium"><?php echo htmlspecialchars($prop['price']); ?></td>
                            <td class="px-4 py-3">
                                <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                                    <?php echo htmlspecialchars($prop['status']); ?>
                                </span>
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex space-x-2">
                                    <a href="edit.php?id=<?php echo $prop['id']; ?>" 
                                       class="text-blue-600 hover:underline">Edit</a>
                                    <form method="POST" style="display:inline" 
                                          onsubmit="return confirm('Delete this property?')">
                                        <input type="hidden" name="action" value="delete">
                                        <input type="hidden" name="id" value="<?php echo $prop['id']; ?>">
                                        <button type="submit" class="text-red-600 hover:underline">Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>