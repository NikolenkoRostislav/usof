USE usof;

INSERT INTO users (id, login, full_name, password_hash, email, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin_user', 'Admin User', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'admin@example.com', 'admin'),
('550e8400-e29b-41d4-a716-446655440002', 'john_doe', 'John Doe', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'john@example.com', 'user'),
('550e8400-e29b-41d4-a716-446655440003', 'jane_smith', 'Jane Smith', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'jane@example.com', 'user'),
('550e8400-e29b-41d4-a716-446655440004', 'bob_wilson', 'Bob Wilson', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'bob@example.com', 'user');

INSERT INTO categories (id, title, description) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'Technology', 'Technology and software development'),
('550e8400-e29b-41d4-a716-446655440102', 'Design', 'Design and UX/UI'),
('550e8400-e29b-41d4-a716-446655440103', 'Business', 'Business and startups'),
('550e8400-e29b-41d4-a716-446655440104', 'Education', 'Education and learning');

INSERT INTO posts (id, author_id, title, status, content) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440002', 'Getting Started with Node.js', 'active', 'This is a comprehensive guide to getting started with Node.js development.'),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440003', 'Design Principles for Modern Web Apps', 'active', 'Learn the key design principles that make web applications user-friendly.'),
('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440004', 'Scaling Your Startup', 'active', 'Tips and strategies for scaling your startup from zero to IPO.'),
('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440002', 'Advanced Database Optimization', 'locked', 'Techniques for optimizing database performance at scale.');

INSERT INTO post_categories (post_id, category_id) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440102'),
('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440103'),
('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440101');

INSERT INTO comments (id, author_id, post_id, status, content) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440201', 'active', 'Great guide! This really helped me understand Node.js basics.'),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440201', 'active', 'Could you provide more examples on async/await?'),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440202', 'active', 'Design principles are timeless. Well written!'),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440203', 'active', 'I agree with your point about team building.');

INSERT INTO comments (id, author_id, post_id, quote_id, status, content) VALUES
('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440302', 'active', 'Great question! Async/await is very powerful when used correctly.');

INSERT INTO likes (id, author_id, type, post_id) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440003', 'like', '550e8400-e29b-41d4-a716-446655440201'),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440004', 'like', '550e8400-e29b-41d4-a716-446655440201'),
('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440002', 'like', '550e8400-e29b-41d4-a716-446655440202'),
('550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440003', 'dislike', '550e8400-e29b-41d4-a716-446655440204');

INSERT INTO likes (id, author_id, type, comment_id) VALUES
('550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440002', 'like', '550e8400-e29b-41d4-a716-446655440301'),
('550e8400-e29b-41d4-a716-446655440406', '550e8400-e29b-41d4-a716-446655440004', 'like', '550e8400-e29b-41d4-a716-446655440303');

INSERT INTO awards (id, title, description, rarity) VALUES
('550e8400-e29b-41d4-a716-446655440501', 'Gold Star', 'Awarded for exceptional content', 'rare'),
('550e8400-e29b-41d4-a716-446655440502', 'Silver Medal', 'Awarded for good contributions', 'common'),
('550e8400-e29b-41d4-a716-446655440503', 'Diamond Trophy', 'Awarded for outstanding achievement', 'legendary'),
('550e8400-e29b-41d4-a716-446655440504', 'Helpful Badge', 'For being helpful to the community', 'common');

INSERT INTO post_awards (post_id, award_id, count) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440501', 2),
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440502', 5),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440503', 1),
('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440504', 3);

INSERT INTO owned_awards (user_id, award_id, count) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440501', 1),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440502', 2),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440503', 1),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440504', 3);

INSERT INTO registration_intents (id, token_hash, login, password_hash, email, full_name) VALUES
('550e8400-e29b-41d4-a716-446655440601', 'hashed_token_123', 'new_user1', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'newuser1@example.com', 'New User One'),
('550e8400-e29b-41d4-a716-446655440602', 'hashed_token_456', 'new_user2', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'newuser2@example.com', 'New User Two');

INSERT INTO password_update_intents (id, token_hash, email, password_hash, is_used) VALUES
('550e8400-e29b-41d4-a716-446655440701', 'hashed_reset_token_1', 'john@example.com', '$2b$10$newpasswordhash123', FALSE),
('550e8400-e29b-41d4-a716-446655440702', 'hashed_reset_token_2', 'jane@example.com', '$2b$10$newpasswordhash456', FALSE);

INSERT INTO award_gacha (user_id, total_rolls) VALUES
('550e8400-e29b-41d4-a716-446655440002', 10),
('550e8400-e29b-41d4-a716-446655440003', 5),
('550e8400-e29b-41d4-a716-446655440004', 3);
