CREATE DATABASE IF NOT EXISTS scandiweb;
USE scandiweb;


CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT,
    in_stock BOOLEAN NOT NULL,
    brand VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE attributes (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL
);

CREATE TABLE attribute_values (
    id VARCHAR(255) PRIMARY KEY,
    attribute_id VARCHAR(255) NOT NULL,
    display_value VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE
);

CREATE TABLE product_attributes (
    product_id VARCHAR(255),
    attribute_value_id VARCHAR(255),
    PRIMARY KEY (product_id, attribute_value_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_value_id) REFERENCES attribute_values(id) ON DELETE CASCADE
);

CREATE TABLE prices (
    product_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency_label VARCHAR(255) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,
    PRIMARY KEY (product_id, currency_label),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_images (
    product_id VARCHAR(255),
    image_url VARCHAR(255),
    PRIMARY KEY (product_id, image_url),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
