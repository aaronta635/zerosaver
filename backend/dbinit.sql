-- ZeroSaver Mock Data Seed Script
-- Run this after tables are created by SQLAlchemy
-- Password for all users: "Password123!" (hashed with bcrypt)

-- =============================================
-- Clear existing data (in reverse dependency order)
-- =============================================
TRUNCATE TABLE shipping_details, payment_details, order_items, orders, cart, 
               product_reviews, product_image, products, product_category,
               vendor_orders, vendor_ratings, vendors, customers, otp, 
               refresh_tokens, auth_details RESTART IDENTITY CASCADE;

-- =============================================
-- Reset all sequences to ensure IDs start from 1
-- =============================================
ALTER SEQUENCE auth_details_id_seq RESTART WITH 1;
ALTER SEQUENCE customers_id_seq RESTART WITH 1;
ALTER SEQUENCE vendors_id_seq RESTART WITH 1;
ALTER SEQUENCE product_category_id_seq RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE product_image_id_seq RESTART WITH 1;
ALTER SEQUENCE product_reviews_id_seq RESTART WITH 1;
ALTER SEQUENCE cart_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;
ALTER SEQUENCE payment_details_id_seq RESTART WITH 1;
ALTER SEQUENCE shipping_details_id_seq RESTART WITH 1;

-- =============================================
-- Auth Details (Users)
-- Password hash is for "Password123!" using pbkdf2_sha256
-- IDs: 1-3 = customers, 4-6 = vendors, 7 = admin
-- =============================================
INSERT INTO auth_details (id, email, password, default_role, email_verified, phone_verified, first_name, last_name, is_superuser) VALUES
    (1, 'customer1@zerosaver.com', '$pbkdf2-sha256$29000$DsEYQyhlDOHcW6v1/j8npA$0HQdFBv9SCjRINT0zeT8haZkG9nhSCnbbxFeW7tLnQM', 'customer', true, false, 'John', 'Doe', false),
    (2, 'customer2@zerosaver.com', '$pbkdf2-sha256$29000$DsEYQyhlDOHcW6v1/j8npA$0HQdFBv9SCjRINT0zeT8haZkG9nhSCnbbxFeW7tLnQM', 'customer', true, false, 'Jane', 'Smith', false),
    (3, 'customer3@zerosaver.com', '$pbkdf2-sha256$29000$DsEYQyhlDOHcW6v1/j8npA$0HQdFBv9SCjRINT0zeT8haZkG9nhSCnbbxFeW7tLnQM', 'customer', true, true, 'Mike', 'Johnson', false),
    (4, 'vendor1@zerosaver.com', '$pbkdf2-sha256$29000$DsEYQyhlDOHcW6v1/j8npA$0HQdFBv9SCjRINT0zeT8haZkG9nhSCnbbxFeW7tLnQM', 'vendor', true, true, 'Fresh', 'Bakery', false),
    (5, 'vendor2@zerosaver.com', '$pbkdf2-sha256$29000$DsEYQyhlDOHcW6v1/j8npA$0HQdFBv9SCjRINT0zeT8haZkG9nhSCnbbxFeW7tLnQM', 'vendor', true, true, 'Green', 'Grocer', false),
    (6, 'vendor3@zerosaver.com', '$pbkdf2-sha256$29000$DsEYQyhlDOHcW6v1/j8npA$0HQdFBv9SCjRINT0zeT8haZkG9nhSCnbbxFeW7tLnQM', 'vendor', true, false, 'City', 'Deli', false),
    (7, 'admin@zerosaver.com', '$pbkdf2-sha256$29000$DsEYQyhlDOHcW6v1/j8npA$0HQdFBv9SCjRINT0zeT8haZkG9nhSCnbbxFeW7tLnQM', 'customer', true, true, 'Admin', 'User', true);

-- Update sequence to continue after our explicit IDs
SELECT setval('auth_details_id_seq', 7);

-- =============================================
-- Customers (auth_id 1, 2, 3)
-- =============================================
INSERT INTO customers (id, auth_id, first_name, last_name, username, phone_number, country, state, address) VALUES
    (1, 1, 'John', 'Doe', 'johndoe', '+1234567890', 'United States', 'California', '123 Main St, San Francisco, CA 94102'),
    (2, 2, 'Jane', 'Smith', 'janesmith', '+1234567891', 'United States', 'New York', '456 Broadway, New York, NY 10012'),
    (3, 3, 'Mike', 'Johnson', 'mikej', '+1234567892', 'United States', 'Texas', '789 Oak Ave, Austin, TX 78701');

SELECT setval('customers_id_seq', 3);

-- =============================================
-- Vendors (auth_id 4, 5, 6)
-- =============================================
INSERT INTO vendors (id, auth_id, first_name, last_name, username, phone_number, country, state, address, bio, profile_picture, ratings, order_time) VALUES
    (1, 4, 'Fresh', 'Bakery', 'freshbakery', '+1555000001', 'United States', 'California', '100 Baker St, San Francisco, CA 94103', 
     'Family-owned bakery since 1985. We specialize in artisan breads, pastries, and cakes. Reducing food waste one loaf at a time!', 
     'https://images.unsplash.com/photo-1517433670267-30f41c71a96a?w=400', 4, '30 mins'),
    (2, 5, 'Green', 'Grocer', 'greengrocer', '+1555000002', 'United States', 'California', '200 Farm Rd, San Francisco, CA 94104', 
     'Local organic produce supplier. We partner with local farms to bring you the freshest fruits and vegetables while fighting food waste.', 
     'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', 5, '15 mins'),
    (3, 6, 'City', 'Deli', 'citydeli', '+1555000003', 'United States', 'California', '300 Market St, San Francisco, CA 94105', 
     'Your neighborhood deli with the best sandwiches, salads, and prepared meals. Save money and save food!', 
     'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', 4, '20 mins');

SELECT setval('vendors_id_seq', 3);

-- =============================================
-- Vendor Ratings
-- =============================================
INSERT INTO vendor_ratings (vendor_id, rating) VALUES
    (1, 5), (1, 4), (1, 4), (1, 5), (1, 3),
    (2, 5), (2, 5), (2, 5), (2, 4), (2, 5),
    (3, 4), (3, 4), (3, 5), (3, 3), (3, 4);

-- =============================================
-- Product Categories
-- =============================================
INSERT INTO product_category (id, category_name) VALUES
    (1, 'electronics'),
    (2, 'fashion'),
    (3, 'home'),
    (4, 'toys'),
    (5, 'books'),
    (6, 'beauty'),
    (7, 'sports'),
    (8, 'food'),
    (9, 'health'),
    (10, 'automotive'),
    (11, 'pets'),
    (12, 'software'),
    (13, 'jewelry'),
    (14, 'baby'),
    (15, 'grocery'),
    (16, 'furniture'),
    (17, 'art'),
    (18, 'games');

SELECT setval('product_category_id_seq', 18);

-- =============================================
-- Products (Food items with discounted prices)
-- =============================================
INSERT INTO products (id, vendor_id, product_category_id, product_name, short_description, sku, product_status, long_description, stock, price) VALUES
    -- Fresh Bakery Products (vendor_id = 1, category = food = 8)
    (1, 1, 8, 'Artisan Sourdough Bread', 'Fresh baked sourdough, best before tomorrow', 'BAK-SRD-001', true, 
     'Our signature sourdough bread made with a 100-year-old starter. Crispy crust, soft interior. Originally $8, now 50% off because it''s best enjoyed today!', 
     15, 400),
    (2, 1, 8, 'Croissant Box (6 pcs)', 'Buttery croissants, baked this morning', 'BAK-CRS-002', true, 
     'Six perfectly flaky, buttery croissants. Made with French butter. Great for breakfast or brunch. Save these from going to waste!', 
     8, 600),
    (3, 1, 8, 'Chocolate Cake Slice', 'Rich chocolate cake, fresh today', 'BAK-CHC-003', true, 
     'Decadent triple chocolate layer cake. Moist, rich, and absolutely delicious. Perfect for dessert lovers!', 
     20, 350),
    (4, 1, 8, 'Assorted Pastry Box', 'Mix of danishes, muffins, and scones', 'BAK-AST-004', true, 
     'A delightful assortment of our daily pastries including 2 danishes, 2 muffins, and 2 scones. Perfect variety pack!', 
     5, 899),
    (5, 1, 8, 'Baguette Bundle (3 pcs)', 'Classic French baguettes', 'BAK-BGT-005', true, 
     'Three traditional French baguettes with crispy crust. Perfect for sandwiches or with soup. Baked fresh daily!', 
     12, 450),

    -- Green Grocer Products (vendor_id = 2, category = grocery = 15)
    (6, 2, 15, 'Organic Veggie Box', 'Mixed seasonal vegetables', 'GRO-VEG-001', true, 
     'A curated box of organic seasonal vegetables including carrots, broccoli, bell peppers, and leafy greens. Slightly imperfect but perfectly delicious!', 
     25, 1299),
    (7, 2, 15, 'Fruit Rescue Box', 'Mixed fruits, perfectly ripe', 'GRO-FRT-002', true, 
     'Assorted fruits that are perfectly ripe and ready to eat today! Includes apples, bananas, oranges, and seasonal selections.', 
     30, 999),
    (8, 2, 15, 'Salad Greens Mix (500g)', 'Fresh mixed salad leaves', 'GRO-SLD-003', true, 
     'Pre-washed mixed salad greens including spinach, arugula, and lettuce. Best used within 2 days for optimal freshness.', 
     40, 399),
    (9, 2, 15, 'Berry Medley Box', 'Strawberries, blueberries, raspberries', 'GRO-BRY-004', true, 
     'Fresh mixed berries - perfect for smoothies, desserts, or snacking! Includes strawberries, blueberries, and raspberries.', 
     18, 699),
    (10, 2, 15, 'Root Vegetable Bundle', 'Potatoes, carrots, onions, garlic', 'GRO-ROT-005', true, 
     'Essential root vegetables for your kitchen. Great for soups, roasts, and everyday cooking. Long-lasting and versatile!', 
     35, 599),

    -- City Deli Products (vendor_id = 3, category = food = 8)
    (11, 3, 8, 'Sandwich Combo Deal', 'Any sandwich + side + drink', 'DEL-CMB-001', true, 
     'Choose any sandwich from our menu with a side salad or chips and a drink. Perfect lunch deal at an unbeatable price!', 
     50, 899),
    (12, 3, 8, 'Soup of the Day (Large)', 'Chef''s daily soup selection', 'DEL-SOP-002', true, 
     'Hearty homemade soup made fresh daily. Comes with bread roll. Ask about today''s special!', 
     30, 499),
    (13, 3, 8, 'Prepared Meal Box', 'Ready-to-eat dinner for 2', 'DEL-MEL-003', true, 
     'Complete dinner for two including main course, two sides, and dessert. Just heat and enjoy! Changes daily.', 
     10, 1599),
    (14, 3, 8, 'Antipasto Platter', 'Italian meats, cheeses, olives', 'DEL-ANT-004', true, 
     'Generous platter of imported Italian meats, artisan cheeses, marinated olives, and crusty bread. Perfect for sharing!', 
     8, 1899),
    (15, 3, 8, 'Fresh Juice Combo (3 bottles)', 'Cold-pressed juices', 'DEL-JUI-005', true, 
     'Three bottles of our cold-pressed juices. Flavors vary daily - typically includes green, orange, and berry blends.', 
     20, 799);

SELECT setval('products_id_seq', 15);

-- =============================================
-- Product Images
-- =============================================
INSERT INTO product_image (product_id, product_image) VALUES
    -- Fresh Bakery
    (1, 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800'),
    (1, 'https://images.unsplash.com/photo-1585478259715-4aa2f1214ea9?w=800'),
    (2, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800'),
    (3, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'),
    (4, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'),
    (5, 'https://images.unsplash.com/photo-1568471173242-461f0a730452?w=800'),
    -- Green Grocer
    (6, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800'),
    (6, 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800'),
    (7, 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800'),
    (8, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800'),
    (9, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800'),
    (10, 'https://images.unsplash.com/photo-1518977676601-b53f82ber543?w=800'),
    -- City Deli
    (11, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800'),
    (12, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800'),
    (13, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'),
    (14, 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800'),
    (15, 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800');

-- =============================================
-- Product Reviews
-- =============================================
INSERT INTO product_reviews (product_id, review, rating) VALUES
    (1, 'Best sourdough I have ever tasted! Amazing value for the price.', 5.0),
    (1, 'Crusty on the outside, soft inside. Perfect!', 4.5),
    (2, 'These croissants are as good as Paris! Will buy again.', 5.0),
    (3, 'So rich and chocolatey. My kids loved it!', 4.0),
    (6, 'Great variety of fresh veggies. Some slight blemishes but taste great!', 4.5),
    (6, 'Love supporting zero waste. Vegetables were fresh and delicious.', 5.0),
    (7, 'Perfect ripeness. Made amazing smoothies!', 4.5),
    (11, 'Huge sandwich, great value. The turkey club was amazing!', 5.0),
    (11, 'Quick pickup, fresh ingredients. My go-to lunch spot now.', 4.0),
    (13, 'Fed my whole family! Great quality and taste.', 5.0);

-- =============================================
-- Cart Items (sample active carts)
-- =============================================
INSERT INTO cart (product_id, customer_id, quantity) VALUES
    (1, 1, 2),   -- John has 2 sourdough breads
    (6, 1, 1),   -- John has 1 veggie box
    (11, 2, 1),  -- Jane has 1 sandwich combo
    (7, 2, 2),   -- Jane has 2 fruit boxes
    (3, 3, 3);   -- Mike has 3 chocolate cake slices

-- =============================================
-- Orders (completed orders)
-- =============================================
INSERT INTO orders (id, customer_id, total_amount, pickup_code, status, order_date) VALUES
    (1, 1, 1699, 'ZS-ABC123', 'shipped', NOW() - INTERVAL '5 days'),
    (2, 1, 899, 'ZS-DEF456', 'shipped', NOW() - INTERVAL '2 days'),
    (3, 2, 2598, 'ZS-GHI789', 'processing', NOW() - INTERVAL '1 day'),
    (4, 3, 1299, 'ZS-JKL012', 'shipped', NOW() - INTERVAL '3 days'),
    (5, 2, 1899, 'ZS-MNO345', 'processing', NOW());

SELECT setval('orders_id_seq', 5);

-- =============================================
-- Order Items
-- =============================================
INSERT INTO order_items (order_id, product_id, vendor_id, status, price, quantity) VALUES
    -- Order 1: John bought croissants and veggie box
    (1, 2, 1, 'shipped', 600, 1),
    (1, 6, 2, 'shipped', 1299, 1),
    -- Order 2: John bought sandwich combo
    (2, 11, 3, 'shipped', 899, 1),
    -- Order 3: Jane bought veggie box and fruit box
    (3, 6, 2, 'processing', 1299, 1),
    (3, 7, 2, 'processing', 999, 1),
    -- Order 4: Mike bought veggie box
    (4, 6, 2, 'shipped', 1299, 1),
    -- Order 5: Jane bought antipasto platter
    (5, 14, 3, 'processing', 1899, 1);

-- =============================================
-- Payment Details
-- =============================================
INSERT INTO payment_details (order_id, payment_method, amount, status, payment_ref, paid_at) VALUES
    (1, 'card', 1699, 'success', 'PAY-001-ABC123', NOW() - INTERVAL '5 days'),
    (2, 'card', 899, 'success', 'PAY-002-DEF456', NOW() - INTERVAL '2 days'),
    (3, 'card', 2598, 'success', 'PAY-003-GHI789', NOW() - INTERVAL '1 day'),
    (4, 'bank_transfer', 1299, 'success', 'PAY-004-JKL012', NOW() - INTERVAL '3 days'),
    (5, 'card', 1899, 'processing', 'PAY-005-MNO345', NULL);

-- =============================================
-- Shipping Details
-- =============================================
INSERT INTO shipping_details (order_id, contact_information, additional_note, address, state, country, shipping_date) VALUES
    (1, '+1234567890', 'Please leave at door', '123 Main St, San Francisco, CA 94102', 'California', 'United States', NOW() - INTERVAL '4 days'),
    (2, '+1234567890', 'Ring doorbell twice', '123 Main St, San Francisco, CA 94102', 'California', 'United States', NOW() - INTERVAL '1 day'),
    (3, '+1234567891', 'Apartment 5B, buzz 502', '456 Broadway, New York, NY 10012', 'New York', 'United States', NULL),
    (4, '+1234567892', NULL, '789 Oak Ave, Austin, TX 78701', 'Texas', 'United States', NOW() - INTERVAL '2 days'),
    (5, '+1234567891', 'Office building, ask for reception', '456 Broadway, New York, NY 10012', 'New York', 'United States', NULL);

-- =============================================
-- Summary
-- =============================================
-- Mock data created:
-- - 7 users (3 customers, 3 vendors, 1 admin)
-- - 3 customers
-- - 3 vendors (Fresh Bakery, Green Grocer, City Deli)
-- - 18 product categories
-- - 15 products (5 per vendor)
-- - 17 product images
-- - 10 product reviews
-- - 5 cart items
-- - 5 orders with order items
-- - 5 payment records
-- - 5 shipping records
--
-- Login credentials:
-- Email: customer1@zerosaver.com / Password: Password123!
-- Email: vendor1@zerosaver.com / Password: Password123!
-- Email: admin@zerosaver.com / Password: Password123!
