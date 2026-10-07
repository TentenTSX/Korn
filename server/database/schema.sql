

USE Korn;

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_resets (
    id_password_reset INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_reset_user
        FOREIGN KEY (user_id)
        REFERENCES users(id_user)
        ON DELETE CASCADE
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
    color VARCHAR(50) NULL,
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
INSERT INTO product_images (product_id, url, alt_text, position, color) VALUES
    (@product_id, '/images/products/training-tank/noir.jpg', 'Homme portant un debardeur noir de sport', 0, 'Noir');

INSERT INTO products (name, description) VALUES ('Motion Pant', 'Pantalon technique polyvalent pour l''entrainement et le quotidien.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'homme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'pantalons'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'M', 'Noir', 95.00, 10),
    (@product_id, 'L', 'Noir', 95.00, 10),
    (@product_id, 'M', 'Gris', 95.00, 10),
    (@product_id, 'L', 'Gris', 95.00, 10),
    (@product_id, 'M', 'Bleu Marine', 95.00, 10),
    (@product_id, 'L', 'Bleu Marine', 95.00, 10);
INSERT INTO product_images (product_id, url, alt_text, position, color) VALUES
    (@product_id, '/images/products/motion-pant/gris.jpg', 'Pantalon technique gris porte pendant un entrainement', 0, 'Gris'),
    (@product_id, '/images/products/motion-pant/bleu-marine.jpg', 'Pantalon ample bleu marine porte en tenue decontractee', 0, 'Bleu Marine');

INSERT INTO products (name, description) VALUES ('Core Short', 'Short d''entrainement leger et resistant.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'homme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'shorts'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'M', 'Noir', 55.00, 15);
INSERT INTO product_images (product_id, url, alt_text, position, color) VALUES
    (@product_id, '/images/products/core-short/noir.jpg', 'Athlete portant un short noir', 0, 'Noir');

INSERT INTO products (name, description) VALUES ('Compression Tee', 'T-shirt technique ajuste, pensee pour l''entrainement intensif.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'homme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 't-shirts'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'S', 'Noir', 42.00, 12),
    (@product_id, 'M', 'Noir', 42.00, 15),
    (@product_id, 'L', 'Noir', 42.00, 12);
INSERT INTO product_images (product_id, url, alt_text, position, color) VALUES
    (@product_id, '/images/products/compression-tee/noir.jpg', 'Homme portant un t-shirt de compression noir', 0, 'Noir');

INSERT INTO products (name, description) VALUES ('Essential Tee', 'T-shirt coupe droite en coton respirant.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'homme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 't-shirts'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'S', 'Blanc', 39.00, 12),
    (@product_id, 'M', 'Blanc', 39.00, 18),
    (@product_id, 'L', 'Blanc', 39.00, 12),
    (@product_id, 'S', 'Noir', 39.00, 12),
    (@product_id, 'M', 'Noir', 39.00, 18),
    (@product_id, 'L', 'Noir', 39.00, 12),
    (@product_id, 'S', 'Gris', 39.00, 12),
    (@product_id, 'M', 'Gris', 39.00, 18),
    (@product_id, 'L', 'Gris', 39.00, 12),
    (@product_id, 'S', 'Bleu Marine', 39.00, 12),
    (@product_id, 'M', 'Bleu Marine', 39.00, 18),
    (@product_id, 'L', 'Bleu Marine', 39.00, 12);
INSERT INTO product_images (product_id, url, alt_text, position, color) VALUES
    (@product_id, '/images/products/essential-tee/blanc-face.jpg', 'Homme portant un t-shirt blanc', 0, 'Blanc'),
    (@product_id, '/images/products/essential-tee/blanc-dos.jpg', 'Dos du t-shirt blanc', 1, 'Blanc'),
    (@product_id, '/images/products/essential-tee/noir-face.jpg', 'Homme portant un t-shirt noir', 0, 'Noir'),
    (@product_id, '/images/products/essential-tee/noir-dos.jpg', 'Dos du t-shirt noir', 1, 'Noir'),
    (@product_id, '/images/products/essential-tee/gris-face.jpg', 'Homme portant un t-shirt gris', 0, 'Gris'),
    (@product_id, '/images/products/essential-tee/gris-dos.jpg', 'Dos du t-shirt gris', 1, 'Gris'),
    (@product_id, '/images/products/essential-tee/bleu-marine-face.jpg', 'Homme portant un t-shirt bleu marine', 0, 'Bleu Marine'),
    (@product_id, '/images/products/essential-tee/bleu-marine-dos.jpg', 'Dos du t-shirt bleu marine', 1, 'Bleu Marine');

INSERT INTO products (name, description) VALUES ('Motion Bra', 'Brassiere a maintien moyen pour un confort optimal.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'femme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'brassieres'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'S', 'Noir', 49.00, 15),
    (@product_id, 'M', 'Noir', 49.00, 15),
    (@product_id, 'S', 'Bleu Marine', 49.00, 15),
    (@product_id, 'M', 'Bleu Marine', 49.00, 15),
    (@product_id, 'S', 'Bleu Roi', 49.00, 15),
    (@product_id, 'M', 'Bleu Roi', 49.00, 15),
    (@product_id, 'S', 'Bordeaux', 49.00, 15),
    (@product_id, 'M', 'Bordeaux', 49.00, 15),
    (@product_id, 'S', 'Vert', 49.00, 15),
    (@product_id, 'M', 'Vert', 49.00, 15),
    (@product_id, 'S', 'Rose', 49.00, 15),
    (@product_id, 'M', 'Rose', 49.00, 15),
    (@product_id, 'S', 'Lilas', 49.00, 15),
    (@product_id, 'M', 'Lilas', 49.00, 15),
    (@product_id, 'S', 'Moka', 49.00, 15),
    (@product_id, 'M', 'Moka', 49.00, 15),
    (@product_id, 'S', 'Gris', 49.00, 15),
    (@product_id, 'M', 'Gris', 49.00, 15);
INSERT INTO product_images (product_id, url, alt_text, position, color) VALUES
    (@product_id, '/images/products/legging-brassiere-ensemble/noir.jpg', 'Femme portant une brassiere noire de sport', 0, 'Noir'),
    (@product_id, '/images/products/legging-brassiere-ensemble/bleu-marine.jpg', 'Femme portant une brassiere bleu marine', 0, 'Bleu Marine'),
    (@product_id, '/images/products/legging-brassiere-ensemble/bleu-roi.jpg', 'Femme portant une brassiere bleu roi', 0, 'Bleu Roi'),
    (@product_id, '/images/products/legging-brassiere-ensemble/bordeaux.jpg', 'Femme portant une brassiere bordeaux', 0, 'Bordeaux'),
    (@product_id, '/images/products/legging-brassiere-ensemble/vert.jpg', 'Femme portant une brassiere verte', 0, 'Vert'),
    (@product_id, '/images/products/legging-brassiere-ensemble/rose.jpg', 'Femme portant une brassiere rose', 0, 'Rose'),
    (@product_id, '/images/products/legging-brassiere-ensemble/lilas.jpg', 'Femme portant une brassiere lilas', 0, 'Lilas'),
    (@product_id, '/images/products/legging-brassiere-ensemble/moka.jpg', 'Femme portant une brassiere moka', 0, 'Moka'),
    (@product_id, '/images/products/legging-brassiere-ensemble/gris.jpg', 'Femme portant une brassiere grise', 0, 'Gris'),
    (@product_id, '/images/products/motion-bra-detail/noir.jpg', 'Detail de la brassiere noire', 1, 'Noir'),
    (@product_id, '/images/products/motion-bra-detail/bordeaux.jpg', 'Detail de la brassiere bordeaux', 1, 'Bordeaux'),
    (@product_id, '/images/products/motion-bra-detail/rose.jpg', 'Detail de la brassiere rose', 1, 'Rose'),
    (@product_id, '/images/products/motion-bra-detail/bleu-roi.jpg', 'Detail de la brassiere bleu roi', 1, 'Bleu Roi'),
    (@product_id, '/images/products/motion-bra-detail/vert.jpg', 'Femme portant une brassiere et un short verts', 1, 'Vert');

INSERT INTO products (name, description) VALUES ('Contour Legging', 'Legging sculptant taille haute.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'femme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'leggings'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'S', 'Noir', 75.00, 10),
    (@product_id, 'M', 'Noir', 75.00, 10),
    (@product_id, 'L', 'Noir', 75.00, 8),
    (@product_id, 'S', 'Bleu Marine', 75.00, 10),
    (@product_id, 'M', 'Bleu Marine', 75.00, 10),
    (@product_id, 'L', 'Bleu Marine', 75.00, 8),
    (@product_id, 'S', 'Bleu Roi', 75.00, 10),
    (@product_id, 'M', 'Bleu Roi', 75.00, 10),
    (@product_id, 'L', 'Bleu Roi', 75.00, 8),
    (@product_id, 'S', 'Bordeaux', 75.00, 10),
    (@product_id, 'M', 'Bordeaux', 75.00, 10),
    (@product_id, 'L', 'Bordeaux', 75.00, 8),
    (@product_id, 'S', 'Vert', 75.00, 10),
    (@product_id, 'M', 'Vert', 75.00, 10),
    (@product_id, 'L', 'Vert', 75.00, 8),
    (@product_id, 'S', 'Rose', 75.00, 10),
    (@product_id, 'M', 'Rose', 75.00, 10),
    (@product_id, 'L', 'Rose', 75.00, 8),
    (@product_id, 'S', 'Lilas', 75.00, 10),
    (@product_id, 'M', 'Lilas', 75.00, 10),
    (@product_id, 'L', 'Lilas', 75.00, 8),
    (@product_id, 'S', 'Moka', 75.00, 10),
    (@product_id, 'M', 'Moka', 75.00, 10),
    (@product_id, 'L', 'Moka', 75.00, 8),
    (@product_id, 'S', 'Gris', 75.00, 10),
    (@product_id, 'M', 'Gris', 75.00, 10),
    (@product_id, 'L', 'Gris', 75.00, 8);
INSERT INTO product_images (product_id, url, alt_text, position, color) VALUES
    (@product_id, '/images/products/legging-brassiere-ensemble/noir.jpg', 'Femme portant un legging noir', 0, 'Noir'),
    (@product_id, '/images/products/legging-lifestyle/noir.jpg', 'Femme portant un legging noir, photo lifestyle', 1, 'Noir'),
    (@product_id, '/images/products/legging-brassiere-ensemble/bleu-marine.jpg', 'Femme portant un legging bleu marine', 0, 'Bleu Marine'),
    (@product_id, '/images/products/legging-lifestyle/bleu-marine.jpg', 'Femme portant un legging bleu marine, photo lifestyle', 1, 'Bleu Marine'),
    (@product_id, '/images/products/legging-brassiere-ensemble/bleu-roi.jpg', 'Femme portant un legging bleu roi', 0, 'Bleu Roi'),
    (@product_id, '/images/products/legging-lifestyle/bleu-roi.jpg', 'Femme portant un legging bleu roi, photo lifestyle', 1, 'Bleu Roi'),
    (@product_id, '/images/products/legging-brassiere-ensemble/bordeaux.jpg', 'Femme portant un legging bordeaux', 0, 'Bordeaux'),
    (@product_id, '/images/products/legging-lifestyle/bordeaux.jpg', 'Femme portant un legging bordeaux, photo lifestyle', 1, 'Bordeaux'),
    (@product_id, '/images/products/legging-brassiere-ensemble/vert.jpg', 'Femme portant un legging vert', 0, 'Vert'),
    (@product_id, '/images/products/legging-lifestyle/vert.jpg', 'Femme portant un legging vert, photo lifestyle', 1, 'Vert'),
    (@product_id, '/images/products/legging-brassiere-ensemble/rose.jpg', 'Femme portant un legging rose', 0, 'Rose'),
    (@product_id, '/images/products/legging-lifestyle/rose.jpg', 'Femme portant un legging rose, photo lifestyle', 1, 'Rose'),
    (@product_id, '/images/products/legging-brassiere-ensemble/lilas.jpg', 'Femme portant un legging lilas', 0, 'Lilas'),
    (@product_id, '/images/products/legging-lifestyle/lilas.jpg', 'Femme portant un legging lilas, photo lifestyle', 1, 'Lilas'),
    (@product_id, '/images/products/legging-brassiere-ensemble/moka.jpg', 'Femme portant un legging moka', 0, 'Moka'),
    (@product_id, '/images/products/legging-lifestyle/moka.jpg', 'Femme portant un legging moka, photo lifestyle', 1, 'Moka'),
    (@product_id, '/images/products/legging-brassiere-ensemble/gris.jpg', 'Femme portant un legging gris', 0, 'Gris'),
    (@product_id, '/images/products/legging-lifestyle/gris.jpg', 'Femme portant un legging gris, photo lifestyle', 1, 'Gris');

INSERT INTO products (name, description) VALUES ('Studio Short', 'Short d''entrainement feminin, coupe ajustee.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'femme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'shorts'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'S', 'Noir', 49.00, 12),
    (@product_id, 'S', 'Bleu Roi', 49.00, 12),
    (@product_id, 'S', 'Bordeaux', 49.00, 12),
    (@product_id, 'S', 'Bleu Marine', 49.00, 12),
    (@product_id, 'S', 'Lilas', 49.00, 12),
    (@product_id, 'S', 'Moka', 49.00, 12),
    (@product_id, 'S', 'Rose', 49.00, 12),
    (@product_id, 'S', 'Vert', 49.00, 12),
    (@product_id, 'S', 'Rouge', 49.00, 12);
INSERT INTO product_images (product_id, url, alt_text, position, color) VALUES
    (@product_id, '/images/products/short-brassiere-ensemble/noir.jpg', 'Femme portant un short de sport noir', 0, 'Noir'),
    (@product_id, '/images/products/short-brassiere-ensemble2/noir.jpg', 'Femme portant un short de sport noir, photo alternative', 1, 'Noir'),
    (@product_id, '/images/products/short-brassiere-ensemble/bleu-roi.jpg', 'Femme portant un short de sport bleu roi', 0, 'Bleu Roi'),
    (@product_id, '/images/products/short-brassiere-ensemble2/bleu-roi.jpg', 'Femme portant un short de sport bleu roi, photo alternative', 1, 'Bleu Roi'),
    (@product_id, '/images/products/short-brassiere-ensemble/bordeaux.jpg', 'Femme portant un short de sport bordeaux', 0, 'Bordeaux'),
    (@product_id, '/images/products/short-brassiere-ensemble2/bordeaux.jpg', 'Femme portant un short de sport bordeaux, photo alternative', 1, 'Bordeaux'),
    (@product_id, '/images/products/short-brassiere-ensemble/bleu-marine.jpg', 'Femme portant un short de sport bleu marine', 0, 'Bleu Marine'),
    (@product_id, '/images/products/short-brassiere-ensemble2/bleu-marine.jpg', 'Femme portant un short de sport bleu marine, photo alternative', 1, 'Bleu Marine'),
    (@product_id, '/images/products/short-brassiere-ensemble/lilas.jpg', 'Femme portant un short de sport lilas', 0, 'Lilas'),
    (@product_id, '/images/products/short-brassiere-ensemble2/lilas.jpg', 'Femme portant un short de sport lilas, photo alternative', 1, 'Lilas'),
    (@product_id, '/images/products/short-brassiere-ensemble/moka.jpg', 'Femme portant un short de sport moka', 0, 'Moka'),
    (@product_id, '/images/products/short-brassiere-ensemble2/moka.jpg', 'Femme portant un short de sport moka, photo alternative', 1, 'Moka'),
    (@product_id, '/images/products/short-brassiere-ensemble/rose.jpg', 'Femme portant un short de sport rose', 0, 'Rose'),
    (@product_id, '/images/products/short-brassiere-ensemble2/rose.jpg', 'Femme portant un short de sport rose, photo alternative', 1, 'Rose'),
    (@product_id, '/images/products/short-brassiere-ensemble/vert.jpg', 'Femme portant un short de sport vert', 0, 'Vert'),
    (@product_id, '/images/products/short-brassiere-ensemble2/vert.jpg', 'Femme portant un short de sport vert, photo alternative', 1, 'Vert'),
    (@product_id, '/images/products/short-brassiere-ensemble/rouge.jpg', 'Femme portant un short de sport rouge', 0, 'Rouge'),
    (@product_id, '/images/products/short-brassiere-ensemble2/rouge.jpg', 'Femme portant un short de sport rouge, photo alternative', 1, 'Rouge');

INSERT INTO products (name, description) VALUES ('Soft Crewneck', 'Sweat col rond doux et chaud.');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_categories (product_id, category_id)
    VALUES
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'femme')),
        (@product_id, (SELECT id_category FROM categories WHERE slug = 'sweats'));
INSERT INTO product_variants (product_id, size, color, price, stock_quantity) VALUES
    (@product_id, 'S', 'Gris', 79.00, 10),
    (@product_id, 'M', 'Gris', 79.00, 10);

INSERT INTO sale_periods (name, slug, discount_percent, start_date, end_date) VALUES
    ('Soldes d''hiver', 'winter', 30, '2026-01-07', '2026-02-03'),
    ('Soldes d''ete', 'summer', 40, '2026-06-24', '2026-07-21'),
    ('Soldes d''automne', 'autumn', 20, '2026-09-23', '2026-10-20');