-- Seed SQL for Soma Database
-- Tables: operations, creatives, monthly_goals
-- User ID: 8a20170d-29e1-4665-9a0b-424c4ab38f5f

-- ============================================
-- OPERATIONS (10 operations)
-- ============================================

INSERT INTO operations (id, name, "freelancerCutPercentage", "userId", "createdAt", "updatedAt") VALUES
('op-001', 'Campanha Magento Store', 30.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('op-002', 'E-commerce Clothing Brand', 25.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('op-003', 'SaaS B2B Lead Gen', 35.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('op-004', 'Restaurant Delivery App', 28.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('op-005', 'Tech Conference 2025', 40.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('op-006', 'Fitness App Launch', 32.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('op-007', 'Online Course Platform', 27.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('op-008', 'Crypto Wallet App', 38.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('op-009', 'Real Estate Listings', 33.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('op-010', 'Pet Store E-commerce', 29.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW());

-- ============================================
-- CREATIVES (36 creatives - ~3-4 per operation)
-- ============================================

INSERT INTO creatives (id, name, "totalProfit", "freelancerCut", "isActive", "isPaid", "paidAt", "operationId", "createdAt", "updatedAt") VALUES
-- Operation 1 - Magento Store (4 creatives)
('cr-001', 'Banner Home - Spring Sale', 2500.00, 750.00, true, true, NOW() - INTERVAL '15 days', 'op-001', NOW(), NOW()),
('cr-002', 'Retargeting - Cart Abandonment', 1800.00, 540.00, true, true, NOW() - INTERVAL '10 days', 'op-001', NOW(), NOW()),
('cr-003', 'Video Ad - Product Showcase', 3200.00, 960.00, true, false, NULL, 'op-001', NOW(), NOW()),
('cr-004', 'Carousel - Best Sellers', 1500.00, 450.00, false, false, NULL, 'op-001', NOW(), NOW()),

-- Operation 2 - Clothing Brand (4 creatives)
('cr-005', 'Story Ad - Summer Collection', 2100.00, 525.00, true, true, NOW() - INTERVAL '20 days', 'op-002', NOW(), NOW()),
('cr-006', 'Feed Ad - Influencer Collab', 2800.00, 700.00, true, false, NULL, 'op-002', NOW(), NOW()),
('cr-007', 'Reels - Behind the Scenes', 1900.00, 475.00, true, true, NOW() - INTERVAL '5 days', 'op-002', NOW(), NOW()),
('cr-008', 'Collection Ad - New Arrivals', 1600.00, 400.00, true, false, NULL, 'op-002', NOW(), NOW()),

-- Operation 3 - SaaS B2B (4 creatives)
('cr-009', 'LinkedIn Lead Gen Form', 4500.00, 1575.00, true, true, NOW() - INTERVAL '25 days', 'op-003', NOW(), NOW()),
('cr-010', 'Webinar Promotion', 3800.00, 1330.00, true, true, NOW() - INTERVAL '12 days', 'op-003', NOW(), NOW()),
('cr-011', 'Case Study Download', 2900.00, 1015.00, true, false, NULL, 'op-003', NOW(), NOW()),
('cr-012', 'Demo Request Campaign', 5200.00, 1820.00, true, false, NULL, 'op-003', NOW(), NOW()),

-- Operation 4 - Restaurant App (3 creatives)
('cr-013', 'Geo-target - Office Area', 1200.00, 336.00, true, true, NOW() - INTERVAL '8 days', 'op-004', NOW(), NOW()),
('cr-014', 'Video - Order Process', 1800.00, 504.00, true, false, NULL, 'op-004', NOW(), NOW()),
('cr-015', 'Promo - First Order Discount', 950.00, 266.00, true, true, NOW() - INTERVAL '3 days', 'op-004', NOW(), NOW()),

-- Operation 5 - Tech Conference (4 creatives)
('cr-016', 'Early Bird Ticket Promo', 6500.00, 2600.00, true, true, NOW() - INTERVAL '30 days', 'op-005', NOW(), NOW()),
('cr-017', 'Speaker Announcement Series', 4200.00, 1680.00, true, true, NOW() - INTERVAL '18 days', 'op-005', NOW(), NOW()),
('cr-018', 'Last Chance Tickets', 5800.00, 2320.00, true, false, NULL, 'op-005', NOW(), NOW()),
('cr-019', 'After Party Promo', 3100.00, 1240.00, true, false, NULL, 'op-005', NOW(), NOW()),

-- Operation 6 - Fitness App (3 creatives)
('cr-020', '30-Day Challenge Promo', 2400.00, 768.00, true, true, NOW() - INTERVAL '14 days', 'op-006', NOW(), NOW()),
('cr-021', 'Transformation Story', 1900.00, 608.00, true, false, NULL, 'op-006', NOW(), NOW()),
('cr-022', 'Free Trial Campaign', 1600.00, 512.00, true, true, NOW() - INTERVAL '7 days', 'op-006', NOW(), NOW()),

-- Operation 7 - Online Course (4 creatives)
('cr-023', 'Masterclass Teaser', 3500.00, 945.00, true, true, NOW() - INTERVAL '22 days', 'op-007', NOW(), NOW()),
('cr-024', 'Student Success Stories', 2800.00, 756.00, true, false, NULL, 'op-007', NOW(), NOW()),
('cr-025', 'Discount - Black Friday', 4800.00, 1296.00, true, true, NOW() - INTERVAL '45 days', 'op-007', NOW(), NOW()),
('cr-026', 'Webinar - Free Preview', 2200.00, 594.00, true, false, NULL, 'op-007', NOW(), NOW()),

-- Operation 8 - Crypto Wallet (3 creatives)
('cr-027', 'App Install - New Users', 5500.00, 2090.00, true, true, NOW() - INTERVAL '28 days', 'op-008', NOW(), NOW()),
('cr-028', 'Security Features Demo', 3800.00, 1444.00, true, false, NULL, 'op-008', NOW(), NOW()),
('cr-029', 'Referral Program', 4200.00, 1596.00, true, true, NOW() - INTERVAL '10 days', 'op-008', NOW(), NOW()),

-- Operation 9 - Real Estate (4 creatives)
('cr-030', 'Property Tour Videos', 6800.00, 2244.00, true, true, NOW() - INTERVAL '35 days', 'op-009', NOW(), NOW()),
('cr-031', 'Neighborhood Highlights', 3900.00, 1287.00, true, false, NULL, 'op-009', NOW(), NOW()),
('cr-032', 'Open House Promo', 4500.00, 1485.00, true, true, NOW() - INTERVAL '15 days', 'op-009', NOW(), NOW()),
('cr-033', 'First-Time Buyer Guide', 3200.00, 1056.00, true, false, NULL, 'op-009', NOW(), NOW()),

-- Operation 10 - Pet Store (3 creatives)
('cr-034', 'Puppy Starter Kit Promo', 1400.00, 406.00, true, true, NOW() - INTERVAL '6 days', 'op-010', NOW(), NOW()),
('cr-035', 'Pet Food Subscription', 1100.00, 319.00, true, false, NULL, 'op-010', NOW(), NOW()),
('cr-036', 'Holiday Gift Guide', 1800.00, 522.00, true, true, NOW() - INTERVAL '12 days', 'op-010', NOW(), NOW());

-- ============================================
-- MONTHLY GOALS (12 goals - 1 per month)
-- ============================================

INSERT INTO monthly_goals (id, amount, month, year, "userId", "createdAt", "updatedAt") VALUES
('mg-001', 5000.00, 1, 2025, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('mg-002', 5500.00, 2, 2025, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('mg-003', 6000.00, 3, 2025, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('mg-004', 6500.00, 4, 2025, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('mg-005', 7000.00, 5, 2025, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('mg-006', 7500.00, 6, 2025, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('mg-007', 8000.00, 7, 2025, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('mg-008', 8500.00, 8, 2025, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('mg-009', 9000.00, 9, 2025, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('mg-010', 9500.00, 10, 2025, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('mg-011', 10000.00, 11, 2025, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW()),
('mg-012', 12000.00, 12, 2025, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW());
