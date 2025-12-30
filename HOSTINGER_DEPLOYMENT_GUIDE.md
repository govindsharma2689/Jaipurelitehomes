# Jaipur Elite Homes - Hostinger Shared Hosting Deployment Guide

## Overview
This guide will help you deploy the Jaipur Elite Homes website on Hostinger shared hosting.

## What You'll Get
- ✅ Static React website (no server required)
- ✅ PHP Admin Panel for managing properties
- ✅ MySQL database for property storage
- ✅ All property images hosted locally

---

## Step 1: Prepare Your Hostinger Account

1. **Log in to Hostinger** → https://hpanel.hostinger.com
2. Go to **Websites** → Select your hosting plan
3. Note down your:
   - FTP/SFTP credentials
   - MySQL database credentials

---

## Step 2: Create MySQL Database

1. In Hostinger hPanel, go to **Databases** → **MySQL Databases**
2. Create a new database:
   - Database name: `jaipurelite_db` (or your choice)
   - Username: `jaipurelite_user` (or your choice)
   - Password: (create a strong password)
3. Click **Create**
4. Go to **phpMyAdmin**
5. Select your database
6. Click **Import** and upload the file: `admin-php/setup.sql`
   - Or run this SQL manually:

```sql
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    area VARCHAR(100),
    city VARCHAR(100) DEFAULT 'Jaipur',
    price VARCHAR(100),
    description TEXT,
    type ENUM('Villas', 'Plot') DEFAULT 'Plot',
    featured BOOLEAN DEFAULT FALSE,
    status ENUM('Sales', 'Rentals') DEFAULT 'Sales',
    images JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## Step 3: Configure the Admin Panel

1. Open `admin-php/config.php` in a text editor
2. Update these lines with YOUR database credentials:

```php
$host = 'localhost';
$dbname = 'YOUR_DATABASE_NAME';    // e.g., 'u123456789_jaipurelite'
$username = 'YOUR_DATABASE_USER';  // e.g., 'u123456789_admin'
$password = 'YOUR_DATABASE_PASSWORD';
```

3. Change the admin login credentials:

```php
define('ADMIN_USERNAME', 'your_admin_username');
define('ADMIN_PASSWORD', 'your_secure_password');
```

4. Save the file

---

## Step 4: Upload Files to Hostinger

### Method A: Using File Manager (Easier)

1. In hPanel, go to **Files** → **File Manager**
2. Navigate to `public_html` folder
3. Delete any existing files (index.html, etc.)
4. Upload the entire contents of the `build` folder:
   - Click **Upload** → Select all files from the `build` folder
   - Or use the **Upload Folder** option if available

### Method B: Using FTP (Faster for large files)

1. Download an FTP client like FileZilla
2. Connect using your Hostinger FTP credentials:
   - Host: `ftp.yourdomain.com` (or the IP from hPanel)
   - Username: (from hPanel → FTP Accounts)
   - Password: (your FTP password)
   - Port: 21
3. Navigate to `public_html` on the remote side
4. Upload all contents from the `build` folder

### Files to Upload:

```
public_html/
├── index.html
├── asset-manifest.json
├── manifest.json
├── robots.txt
├── .htaccess
├── data/
│   └── properties.json
├── images/
│   ├── logo/
│   └── properties/
│       ├── prop-1/
│       ├── prop-2/
│       └── ... (all property images)
├── admin-php/
│   ├── config.php (edited with your credentials)
│   ├── index.php
│   ├── login.php
│   ├── logout.php
│   ├── add.php
│   ├── edit.php
│   └── export.php
└── static/
    ├── css/
    └── js/
```

---

## Step 5: Configure .htaccess for React Router

The `.htaccess` file should already be in the build folder. If not, create it in `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Step 6: Import Existing Properties (Optional)

If you want to import the existing 18 properties:

1. Go to `https://yourdomain.com/admin-php/login.php`
2. Log in with your admin credentials
3. You can either:
   - **Manual Import**: Add each property using "Add Property"
   - **JSON Import**: Use phpMyAdmin to import from properties.json

### To import via phpMyAdmin:

1. Go to phpMyAdmin → Your database → properties table
2. Run this PHP script locally to generate SQL:

```php
<?php
$json = file_get_contents('data/properties.json');
$properties = json_decode($json, true);

foreach ($properties as $p) {
    $images = json_encode($p['images']);
    $featured = $p['featured'] ? 1 : 0;
    echo "INSERT INTO properties (title, location, area, city, price, description, type, featured, status, images) VALUES (";
    echo "'" . addslashes($p['title']) . "', ";
    echo "'" . addslashes($p['location']) . "', ";
    echo "'" . addslashes($p['area']) . "', ";
    echo "'" . addslashes($p['city']) . "', ";
    echo "'" . addslashes($p['price']) . "', ";
    echo "'" . addslashes($p['description']) . "', ";
    echo "'" . $p['type'] . "', ";
    echo "$featured, ";
    echo "'" . $p['status'] . "', ";
    echo "'" . addslashes($images) . "'";
    echo ");\n";
}
```

---

## Step 7: Test Your Website

1. **Main Website**: `https://yourdomain.com`
   - Check all pages load correctly
   - Test property detail pages
   - Test search filters

2. **Admin Panel**: `https://yourdomain.com/admin-php/`
   - Log in with your credentials
   - Add a test property
   - Click "Export JSON" to update the frontend

---

## Step 8: Updating Properties

When you add/edit/delete properties in the admin panel:

1. Go to Admin Panel
2. Make your changes
3. Click **"Export JSON"** button
4. This regenerates `data/properties.json`
5. The frontend will automatically show updated data

---

## Troubleshooting

### Page shows 404 or blank
- Ensure `.htaccess` file is uploaded
- In hPanel, enable **Apache mod_rewrite**

### Images not loading
- Check image paths start with `/images/`
- Ensure `images` folder is uploaded to `public_html`

### Admin panel shows database error
- Verify database credentials in `config.php`
- Check database user has proper permissions
- Ensure the `properties` table was created

### PHP errors
- In hPanel → Advanced → PHP Configuration
- Set PHP version to 8.0 or higher
- Enable `pdo_mysql` extension

---

## Security Recommendations

1. **Change default admin password** in `config.php`
2. **Protect admin folder** with additional .htaccess:

```apache
# Add to admin-php/.htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

3. **Enable SSL** in Hostinger hPanel → SSL/TLS

---

## File Structure Summary

```
your-hosting/public_html/
│
├── index.html              # Main entry point
├── .htaccess               # URL rewriting for React Router
├── manifest.json           # PWA manifest
│
├── static/                 # React compiled assets
│   ├── css/
│   └── js/
│
├── data/                   # Property data (JSON)
│   └── properties.json
│
├── images/                 # All images
│   ├── logo/
│   ├── categories/
│   └── properties/
│       ├── prop-1/
│       ├── prop-2/
│       └── ...
│
└── admin-php/              # PHP Admin Panel
    ├── config.php          # Database configuration
    ├── index.php           # Admin dashboard
    ├── login.php           # Login page
    ├── add.php             # Add property
    ├── edit.php            # Edit property
    └── export.php          # Export to JSON
```

---

## Support

If you encounter any issues:
1. Check the Troubleshooting section above
2. Verify all files are uploaded correctly
3. Test database connection via phpMyAdmin

---

**Your Jaipur Elite Homes website is now ready for Hostinger shared hosting!** 🏠
