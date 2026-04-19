USE shopping_system;

-- Reset demo data while preserving the schema and AUTO_INCREMENT values.
SET FOREIGN_KEY_CHECKS = 0;
-- Use DELETE instead of TRUNCATE to preserve AUTO_INCREMENT counters
DELETE FROM reviews;
DELETE FROM payments;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM sellers;
DELETE FROM customers;
DELETE FROM users;
-- Reset AUTO_INCREMENT for orders to start from 1000 (to avoid conflicts with existing data)
ALTER TABLE orders AUTO_INCREMENT = 1000;
SET FOREIGN_KEY_CHECKS = 1;

-- Sellers
INSERT INTO sellers (company_name, email, password_hash, phone, created_at) VALUES
('Summit Electronics Co.', 'hello@summitelectronics.com', '$2a$10$wH7G0bKQeFQ6xvQhV3xP5eN9B4kR6xH5YpD8zT1JmL0nC4sV7uI2a', '4155550101', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 7 MONTH), '09:00:00')),
('Bluebird Outfitters', 'sales@bluebirdoutfitters.com', '$2a$10$Qf5D8xK2rP1mT7bY3nV6eA9cL4gH8sJ2wR5uN0dF3kP7qS1xC6zM2', '4155550102', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 6 MONTH), '10:15:00')),
('Chapter & Pine Books', 'team@chapterandpine.com', '$2a$10$Zp3N6vB8cX1mL4kJ7hG2fD9sA5qW8eR1tY4uI7oP0nM3bC6xV9zL1', '4155550103', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 6 MONTH), '11:30:00')),
('Hearth & Harbor Living', 'care@hearthharbor.com', '$2a$10$Lx8Q2wE5rT7yU1iO4pA6sD9fG3hJ7kL0zX2cV5bN8mM1qW4eR6tY9', '4155550104', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '12:45:00')),
('UrbanNest Market', 'support@urbannestmarket.com', '$2a$10$M4nB7vC1xZ5aS8dF2gH6jK9lQ3wE7rT0yU4iO8pP1aS5dF9gH2jK6', '4155550105', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '14:00:00'));

-- Users (admin is seeded by DataSeeder on startup; these are for demo reference)
-- admin@store.com / Admin@123  |  customer@store.com / Customer@123
INSERT INTO users (username, password_hash, role, created_at) VALUES
('admin@store.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', CURRENT_TIMESTAMP),
('customer@store.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER', CURRENT_TIMESTAMP);

-- Products
INSERT INTO products (seller_id, name, description, price, stock, category, image_url, created_at) VALUES
(1, 'Aurora X1 Laptop', '14-inch productivity laptop with 16GB RAM and 512GB SSD.', 1299.00, 15, 'Electronics', 'https://placehold.co/600x400/ebebeb/666666?text=Aurora+X1+Laptop', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '09:10:00')),
(1, 'Nebula Noise-Canceling Headphones', 'Over-ear wireless headphones with 30-hour battery life.', 249.00, 18, 'Electronics', 'https://placehold.co/600x400/ebebeb/666666?text=Nebula+Headphones', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '09:40:00')),
(1, 'PulseFit Smartwatch', 'Fitness-focused smartwatch with GPS and heart-rate tracking.', 179.00, 0, 'Electronics', 'https://placehold.co/600x400/ebebeb/666666?text=PulseFit+Smartwatch', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 4 MONTH), '10:20:00')),
(1, 'ArcLight 4K Monitor', '27-inch 4K monitor for design and analytics workstations.', 399.00, 12, 'Electronics', 'https://placehold.co/600x400/ebebeb/666666?text=ArcLight+4K', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 4 MONTH), '11:00:00')),
(2, 'Harbor Cotton Oxford Shirt', 'Tailored long-sleeve Oxford shirt in breathable cotton.', 48.00, 26, 'Clothing', 'https://placehold.co/600x400/ebebeb/666666?text=Harbor+Oxford+Shirt', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '11:30:00')),
(2, 'Northline Denim Jacket', 'Mid-weight denim jacket with brushed metal hardware.', 89.00, 17, 'Clothing', 'https://placehold.co/600x400/ebebeb/666666?text=Denim+Jacket', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 4 MONTH), '12:05:00')),
(2, 'Willow Knit Sweater', 'Soft textured sweater for cool-weather layering.', 64.00, 14, 'Clothing', 'https://placehold.co/600x400/ebebeb/666666?text=Willow+Sweater', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '13:15:00')),
(2, 'Meridian Running Shoes', 'Lightweight trainers with responsive foam cushioning.', 110.00, 6, 'Clothing', 'https://placehold.co/600x400/ebebeb/666666?text=Meridian+Shoes', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '13:40:00')),
(3, 'Quiet Mind Productivity Journal', 'Guided daily journal with goal planning prompts.', 18.00, 40, 'Books', 'https://placehold.co/600x400/ebebeb/666666?text=Quiet+Mind+Journal', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '14:10:00')),
(3, 'Systems Design Handbook', 'Practical engineering guide for scalable system design.', 42.00, 21, 'Books', 'https://placehold.co/600x400/ebebeb/666666?text=Systems+Design+Handbook', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 4 MONTH), '14:30:00')),
(3, 'Everyday Italian Cooking', 'Weeknight Italian recipes with pantry-friendly ingredients.', 29.00, 32, 'Books', 'https://placehold.co/600x400/ebebeb/666666?text=Italian+Cooking', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '15:00:00')),
(3, 'Kids Astronomy Atlas', 'Illustrated introduction to planets, stars, and space missions.', 24.00, 28, 'Books', 'https://placehold.co/600x400/ebebeb/666666?text=Astronomy+Atlas', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '15:25:00')),
(4, 'Oak & Iron Coffee Table', 'Modern coffee table with solid oak top and steel frame.', 229.00, 11, 'Home & Kitchen', 'https://placehold.co/600x400/ebebeb/666666?text=Oak+Iron+Table', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 4 MONTH), '16:00:00')),
(4, 'Lumi Ceramic Table Lamp', 'Matte ceramic lamp with warm ambient linen shade.', 58.00, 20, 'Home & Kitchen', 'https://placehold.co/600x400/ebebeb/666666?text=Lumi+Table+Lamp', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '16:20:00')),
(4, 'Breeze Air Purifier', 'Compact purifier for bedrooms and small offices.', 149.00, 7, 'Home & Kitchen', 'https://placehold.co/600x400/ebebeb/666666?text=Air+Purifier', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '16:45:00')),
(4, 'Hearthstone Cookware Set', '10-piece non-stick cookware set for everyday cooking.', 199.00, 13, 'Home & Kitchen', 'https://placehold.co/600x400/ebebeb/666666?text=Cookware+Set', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '17:05:00')),
(5, 'Ember Stainless Bottle', 'Insulated reusable bottle that keeps drinks cold for 24 hours.', 32.00, 9, 'Home & Kitchen', 'https://placehold.co/600x400/ebebeb/666666?text=Ember+Bottle', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '17:20:00')),
(5, 'Canvas Weekender Tote', 'Large zippered tote for travel, errands, and gym gear.', 72.00, 23, 'Clothing', 'https://placehold.co/600x400/ebebeb/666666?text=Weekender+Tote', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '17:40:00')),
(5, 'Echo Mini Bluetooth Speaker', 'Portable speaker with deep bass and USB-C charging.', 59.00, 35, 'Electronics', 'https://placehold.co/600x400/ebebeb/666666?text=Mini+Speaker', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '18:00:00')),
(5, 'Linen Duvet Cover Set', 'Breathable washed-linen duvet set for queen beds.', 96.00, 16, 'Home & Kitchen', 'https://placehold.co/600x400/ebebeb/666666?text=Duvet+Cover', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '18:20:00'));

-- Customers
INSERT INTO customers (first_name, last_name, email, password_hash, phone, address, created_at) VALUES
('Amelia', 'Brooks', 'amelia.brooks@example.com', '$2a$10$1aBcD2eFgH3iJkL4mNoPqO5rStUvWxYz0123456789abcdefghi', '6505551001', '1427 Lakeview Ave, Austin, TX 78701', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '08:15:00')),
('Marcus', 'Reed', 'marcus.reed@example.com', '$2a$10$2bCdE3fGhI4jKlM5nOpQrP6sTuVwXyZa1234567890bcdefghij', '6505551002', '88 Cedar Park Rd, Denver, CO 80202', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '09:05:00')),
('Priya', 'Nair', 'priya.nair@example.com', '$2a$10$3cDeF4gHiJ5kLmN6oPqRsQ7tUvWxYzAb2345678901cdefghijk', '6505551003', '2207 Maple Street, Seattle, WA 98101', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 4 MONTH), '10:10:00')),
('Daniel', 'Foster', 'daniel.foster@example.com', '$2a$10$4dEfG5hIjK6lMnO7pQrStR8uVwXyZaBc3456789012defghijkl', '6505551004', '501 Market Lane, Chicago, IL 60601', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 4 MONTH), '11:25:00')),
('Sofia', 'Martinez', 'sofia.martinez@example.com', '$2a$10$5eFgH6iJkL7mNoP8qRsTuS9vWxYzAbCd4567890123efghijklm', '6505551005', '73 Willow Court, Miami, FL 33101', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '12:35:00')),
('Ethan', 'Cole', 'ethan.cole@example.com', '$2a$10$6fGhI7jKlM8nOpQ9rStUvT0wXyZaBcDe5678901234fghijklmn', '6505551006', '119 River Run, Portland, OR 97201', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '13:15:00')),
('Nina', 'Patel', 'nina.patel@example.com', '$2a$10$7gHiJ8kLmN9oPqR0sTuVwU1xYzAbCdEf6789012345ghijklmno', '6505551007', '9 Garden Terrace, San Jose, CA 95112', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '14:05:00')),
('Oliver', 'Grant', 'oliver.grant@example.com', '$2a$10$8hIjK9lMnO0pQrS1tUvWxV2yZaBcDeFg7890123456hijklmnop', '6505551008', '640 Harbor Blvd, Boston, MA 02108', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '14:45:00')),
('Layla', 'Hassan', 'layla.hassan@example.com', '$2a$10$9iJkL0mNoP1qRsT2uVwXyW3zAbCdEfGh8901234567ijklmnopq', '6505551009', '300 Pinecrest Dr, Phoenix, AZ 85004', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '15:20:00')),
('Noah', 'Bennett', 'noah.bennett@example.com', '$2a$10$0jKlM1nOpQ2rStU3vWxYzX4aBcDeFgHi9012345678jklmnopqr', '6505551010', '57 Stonegate Ave, Raleigh, NC 27601', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '16:00:00')),
('Test', 'Customer', 'customer@store.com', '$2a$10$E1b8eR5A1a6e/9r5Z/vB9eHwK7D4lB5gQ7H/L3sZ9eC5V4X1Y3W2', '6505551011', '123 Test Ave, Raleigh, NC 27601', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '16:00:00'));

-- Orders across the last six months
INSERT INTO orders (customer_id, total_amount, status, created_at) VALUES
(1, 1548.00, 'DELIVERED', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH), INTERVAL 3 DAY), '10:15:00')),
(2, 96.00, 'CANCELLED', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH), INTERVAL 12 DAY), '13:20:00')),
(3, 213.00, 'SHIPPED', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 4 MONTH), INTERVAL 5 DAY), '09:05:00')),
(4, 168.00, 'DELIVERED', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 4 MONTH), INTERVAL 18 DAY), '15:40:00')),
(5, 399.00, 'PENDING', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 3 MONTH), INTERVAL 2 DAY), '11:30:00')),
(6, 84.00, 'DELIVERED', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 3 MONTH), INTERVAL 16 DAY), '14:10:00')),
(7, 238.00, 'CANCELLED', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 3 MONTH), INTERVAL 24 DAY), '17:25:00')),
(8, 287.00, 'SHIPPED', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 2 MONTH), INTERVAL 4 DAY), '10:45:00')),
(9, 174.00, 'DELIVERED', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 2 MONTH), INTERVAL 20 DAY), '16:35:00')),
(10, 228.00, 'PENDING', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH), INTERVAL 1 DAY), '09:50:00')),
(1, 1478.00, 'DELIVERED', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH), INTERVAL 10 DAY), '12:15:00')),
(2, 168.00, 'SHIPPED', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH), INTERVAL 22 DAY), '18:05:00')),
(3, 196.00, 'DELIVERED', TIMESTAMP(DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 2 DAY), '10:30:00')),
(4, 245.00, 'PENDING', TIMESTAMP(DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 8 DAY), '13:55:00')),
(5, 100.00, 'CANCELLED', TIMESTAMP(DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 12 DAY), '16:20:00'));

-- Order line items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 1299.00),
(1, 2, 1, 249.00),
(2, 20, 1, 96.00),
(3, 15, 1, 149.00),
(3, 17, 2, 32.00),
(4, 5, 2, 48.00),
(4, 18, 1, 72.00),
(5, 4, 1, 399.00),
(6, 10, 1, 42.00),
(6, 9, 1, 18.00),
(6, 12, 1, 24.00),
(7, 3, 1, 179.00),
(7, 19, 1, 59.00),
(8, 13, 1, 229.00),
(8, 14, 1, 58.00),
(9, 8, 1, 110.00),
(9, 7, 1, 64.00),
(10, 16, 1, 199.00),
(10, 11, 1, 29.00),
(11, 1, 1, 1299.00),
(11, 3, 1, 179.00),
(12, 17, 3, 32.00),
(12, 18, 1, 72.00),
(13, 5, 1, 48.00),
(13, 6, 1, 89.00),
(13, 19, 1, 59.00),
(14, 15, 1, 149.00),
(14, 20, 1, 96.00),
(15, 9, 1, 18.00),
(15, 12, 1, 24.00),
(15, 14, 1, 58.00);

-- Payments aligned with order outcomes
INSERT INTO payments (order_id, amount, payment_method, status, payment_date) VALUES
(1, 1548.00, 'CREDIT_CARD', 'SUCCESS', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH), INTERVAL 4 DAY), '08:30:00')),
(2, 96.00, 'PAYPAL', 'FAILED', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH), INTERVAL 12 DAY), '13:25:00')),
(3, 213.00, 'UPI', 'SUCCESS', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 4 MONTH), INTERVAL 6 DAY), '09:20:00')),
(4, 168.00, 'CREDIT_CARD', 'SUCCESS', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 4 MONTH), INTERVAL 19 DAY), '16:05:00')),
(5, 399.00, 'CREDIT_CARD', 'PENDING', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 3 MONTH), INTERVAL 2 DAY), '11:35:00')),
(6, 84.00, 'PAYPAL', 'SUCCESS', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 3 MONTH), INTERVAL 16 DAY), '14:15:00')),
(7, 238.00, 'UPI', 'FAILED', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 3 MONTH), INTERVAL 24 DAY), '17:30:00')),
(8, 287.00, 'CREDIT_CARD', 'SUCCESS', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 2 MONTH), INTERVAL 5 DAY), '10:50:00')),
(9, 174.00, 'PAYPAL', 'SUCCESS', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 2 MONTH), INTERVAL 21 DAY), '16:40:00')),
(10, 228.00, 'CREDIT_CARD', 'PENDING', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH), INTERVAL 1 DAY), '09:55:00')),
(11, 1478.00, 'CREDIT_CARD', 'SUCCESS', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH), INTERVAL 11 DAY), '12:20:00')),
(12, 168.00, 'UPI', 'SUCCESS', TIMESTAMP(DATE_ADD(DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH), INTERVAL 23 DAY), '18:15:00')),
(13, 196.00, 'PAYPAL', 'SUCCESS', TIMESTAMP(DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 3 DAY), '10:35:00')),
(14, 245.00, 'CREDIT_CARD', 'PENDING', TIMESTAMP(DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 8 DAY), '14:00:00')),
(15, 100.00, 'UPI', 'FAILED', TIMESTAMP(DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 12 DAY), '16:25:00'));

-- Reviews to populate product feedback and dashboard tables
INSERT INTO reviews (product_id, customer_id, rating, comment, created_at) VALUES
(1, 1, 5, 'The laptop feels fast even with design tools and dozens of tabs open.', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '18:30:00')),
(2, 1, 4, 'Excellent sound and comfort, though the carry case could be sturdier.', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '18:45:00')),
(18, 4, 5, 'Perfect weekend bag with enough structure to hold its shape.', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 4 MONTH), '19:10:00')),
(10, 6, 5, 'A genuinely practical handbook with examples I could apply right away.', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '20:00:00')),
(3, 7, 3, 'The fitness tracking is solid, but I wish the battery lasted longer.', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '20:30:00')),
(13, 8, 4, 'Looks premium in the living room and was easy to assemble.', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '21:05:00')),
(8, 9, 5, 'Light on foot and surprisingly comfortable for long city walks.', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '21:20:00')),
(11, 10, 4, 'Simple recipes, nice pacing, and approachable ingredients.', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '21:35:00')),
(19, 5, 4, 'Great little speaker for the patio and quick to pair with phones.', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '21:50:00')),
(15, 3, 5, 'Noticeably improved the air quality in my apartment bedroom.', TIMESTAMP(CURDATE(), '09:25:00')),
(6, 3, 4, 'The jacket fits true to size and breaks in nicely after a few wears.', TIMESTAMP(CURDATE(), '09:40:00')),
(20, 4, 4, 'Soft fabric and clean stitching, exactly what I wanted for the guest room.', TIMESTAMP(CURDATE(), '09:55:00'));
