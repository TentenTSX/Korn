

USE Korn;

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id_product INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE product_variants (
    id_variant INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    size VARCHAR(20) NOT NULL,
    color VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_variant_product
        FOREIGN KEY (product_id)
        REFERENCES products(id_product)
        ON DELETE CASCADE,
    CONSTRAINT unique_product_variant
        UNIQUE (product_id, size, color)
);

CREATE TABLE categories (
    id_category INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE product_categories (
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    CONSTRAINT fk_product_category_product
        FOREIGN KEY (product_id)
        REFERENCES products(id_product)
        ON DELETE CASCADE,
    CONSTRAINT fk_product_category_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id_category)
        ON DELETE CASCADE
);

CREATE TABLE product_images (
    id_image INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    position INT DEFAULT 0,
    CONSTRAINT fk_image_product
        FOREIGN KEY (product_id)
        REFERENCES products(id_product)
        ON DELETE CASCADE
);

CREATE TABLE carts (
    id_cart INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    guest_token_hash CHAR(64) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_user
        FOREIGN KEY (user_id)
        REFERENCES users(id_user)
        ON DELETE CASCADE,
    CONSTRAINT unique_user_cart
        UNIQUE (user_id),
    CONSTRAINT unique_guest_cart
        UNIQUE (guest_token_hash)
);

CREATE TABLE cart_items (
    id_cart_item INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price_unit DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_cart_item_cart
        FOREIGN KEY (cart_id)
        REFERENCES carts(id_cart)
        ON DELETE CASCADE,
    CONSTRAINT fk_cart_item_variant
        FOREIGN KEY (variant_id)
        REFERENCES product_variants(id_variant)
        ON DELETE CASCADE,
    CONSTRAINT unique_cart_variant
        UNIQUE (cart_id, variant_id)
);

CREATE TABLE orders (
    id_order INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    customer_email VARCHAR(255) NOT NULL,
    guest_cart_token_hash CHAR(64) NULL,
    stripe_session_id VARCHAR(255) UNIQUE,
    invoice_number VARCHAR(40) UNIQUE,
    invoice_issued_at TIMESTAMP NULL,
    payment_email_claimed_at TIMESTAMP NULL,
    payment_email_sent_at TIMESTAMP NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    shipping_first_name VARCHAR(100) NOT NULL,
    shipping_last_name VARCHAR(100) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id)
        REFERENCES users(id_user)
);

CREATE TABLE order_items (
    id_order_item INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    price_unit DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id_order)
        ON DELETE CASCADE,
    CONSTRAINT fk_order_item_variant
        FOREIGN KEY (variant_id)
        REFERENCES product_variants(id_variant)
);

CREATE TABLE payments (
    id_payment INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    stripe_session_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id_order)
        ON DELETE CASCADE
);

CREATE TABLE newsletter_subscribers (
    id_subscriber INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sale_periods (
    id_sale_period INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    discount_percent INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

-- Seed data --------------------------------------------------------------

INSERT INTO categories (name, slug) VALUES
    ('Homme', 'homme'),
    ('Femme', 'femme'),
    ('Débardeurs', 'debardeurs'),
    ('Pantalons', 'pantalons'),
    ('Shorts', 'shorts'),
    ('Sweats', 'sweats'),
    ('T-shirts', 't-shirts'),
    ('Brassières', 'brassieres'),
    ('Leggings', 'leggings');

INSERT INTO products (name, description) VALUES ('Training Tank', 'Debardeur respirant pour l''entrainement.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'homme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'debardeurs'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'M', 'Noir', 45.00, 20),
    (@product_id, 'L', 'Noir', 45.00, 15);
INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (@product_id, 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&h=1125&fit=crop&auto=format', 'Homme portant un debardeur noir de sport', 0);

INSERT INTO products (name, description) VALUES ('Motion Pant', 'Pantalon technique polyvalent pour l''entrainement et le quotidien.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'homme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'pantalons'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'M', 'Noir', 95.00, 10),
    (@product_id, 'L', 'Noir', 95.00, 10);
INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (@product_id, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&h=1125&fit=crop&auto=format', 'Pantalon technique noir porte pendant un entrainement', 0);

INSERT INTO products (name, description) VALUES ('Core Short', 'Short d''entrainement leger et resistant.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'homme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'shorts'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'M', 'Noir', 55.00, 15);
INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (@product_id, 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&h=1125&fit=crop&auto=format', 'Athlete portant un short noir', 0);

INSERT INTO products (name, description) VALUES ('Essential Tee', 'T-shirt coupe droite en coton respirant.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'homme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 't-shirts'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'S', 'Blanc', 39.00, 12),
    (@product_id, 'M', 'Blanc', 39.00, 18),
    (@product_id, 'L', 'Blanc', 39.00, 12);
INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (@product_id, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&h=1125&fit=crop&auto=format', 'Homme portant un t-shirt blanc', 0);

INSERT INTO products (name, description) VALUES ('Motion Bra', 'Brassiere a maintien moyen pour un confort optimal.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'femme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'brassieres'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'S', 'Noir', 49.00, 15),
    (@product_id, 'M', 'Noir', 49.00, 15);
INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (@product_id, 'https://images.unsplash.com/photo-1506629905607-d9c297d7e5b7?w=900&h=1125&fit=crop&auto=format', 'Femme portant une brassiere noire de sport', 0);

INSERT INTO products (name, description) VALUES ('Contour Legging', 'Legging sculptant taille haute.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'femme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'leggings'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'S', 'Noir', 75.00, 10),
    (@product_id, 'M', 'Noir', 75.00, 10),
    (@product_id, 'L', 'Noir', 75.00, 8);
INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (@product_id, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&h=1125&fit=crop&auto=format', 'Femme portant un legging noir', 0);

INSERT INTO products (name, description) VALUES ('Studio Short', 'Short d''entrainement feminin, coupe ajustee.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'femme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'shorts'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'S', 'Noir', 49.00, 12);
INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (@product_id, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&h=1125&fit=crop&auto=format', 'Femme portant un short de sport noir', 0);

INSERT INTO products (name, description) VALUES ('Soft Crewneck', 'Sweat col rond doux et chaud.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'femme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'sweats'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'S', 'Gris', 79.00, 10),
    (@product_id, 'M', 'Gris', 79.00, 10);
INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (@product_id, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&h=1125&fit=crop&auto=format', 'Sweat gris oversize', 0);

INSERT INTO sale_periods (name, slug, discount_percent, start_date, end_date) VALUES
    ('Soldes d''hiver', 'winter', 30, '2026-01-07', '2026-02-03'),
    ('Soldes d''ete', 'summer', 40, '2026-06-24', '2026-07-21'),
    ('Soldes d''automne', 'autumn', 20, '2026-09-23', '2026-10-20');