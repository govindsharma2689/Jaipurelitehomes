-- Run this SQL in your Hostinger phpMyAdmin to create the properties table

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

-- Insert sample data (optional)
-- You can import the properties from properties.json using the admin panel