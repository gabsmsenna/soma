-- Seed SQL for Soma Database
-- Run with: psql $DATABASE_URL -f prisma/seed.sql

-- ============================================
-- OPERATIONS (5 operations)
-- ============================================

INSERT INTO operations (id, name, "freelancerCutPercentage", "userId", "createdAt", "updatedAt", active) VALUES
('op-001', 'Campanha Magento Store', 30.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW(), true),
('op-002', 'E-commerce Clothing Brand', 25.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW(), true),
('op-003', 'SaaS B2B Lead Gen', 35.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW(), true),
('op-004', 'Restaurant Delivery App', 28.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW(), true),
('op-005', 'Tech Conference 2025', 40.00, '8a20170d-29e1-4665-9a0b-424c4ab38f5f', NOW(), NOW(), true);

-- ============================================
-- CREATIVES (25 creatives - 5 per operation)
-- ============================================

INSERT INTO creatives (id, name, "totalProfit", "freelancerCut", "isActive", "isPaid", "paidAt", "operationId", "createdAt", "updatedAt") VALUES
-- Operation 1 - Magento Store (5 creatives)
('cr-001', 'Banner Home - Spring Sale', 2500.00, 750.00, true, true, NOW() - INTERVAL '15 days', 'op-001', NOW(), NOW()),
('cr-002', 'Retargeting - Cart Abandonment', 1800.00, 540.00, true, true, NOW() - INTERVAL '10 days', 'op-001', NOW(), NOW()),
('cr-003', 'Video Ad - Product Showcase', 3200.00, 960.00, true, false, NULL, 'op-001', NOW(), NOW()),
('cr-004', 'Carousel - Best Sellers', 1500.00, 450.00, false, false, NULL, 'op-001', NOW(), NOW()),
('cr-005', 'Story Ad - Flash Sale', 2100.00, 630.00, true, false, NULL, 'op-001', NOW(), NOW()),

-- Operation 2 - Clothing Brand (5 creatives)
('cr-006', 'Story Ad - Summer Collection', 2100.00, 525.00, true, true, NOW() - INTERVAL '20 days', 'op-002', NOW(), NOW()),
('cr-007', 'Feed Ad - Influencer Collab', 2800.00, 700.00, true, false, NULL, 'op-002', NOW(), NOW()),
('cr-008', 'Reels - Behind the Scenes', 1900.00, 475.00, true, true, NOW() - INTERVAL '5 days', 'op-002', NOW(), NOW()),
('cr-009', 'Collection Ad - New Arrivals', 1600.00, 400.00, true, false, NULL, 'op-002', NOW(), NOW()),
('cr-010', 'Video - Model Walkthrough', 2300.00, 575.00, true, false, NULL, 'op-002', NOW(), NOW()),

-- Operation 3 - SaaS B2B (5 creatives)
('cr-011', 'LinkedIn Lead Gen Form', 4500.00, 1575.00, true, true, NOW() - INTERVAL '25 days', 'op-003', NOW(), NOW()),
('cr-012', 'Webinar Promotion', 3800.00, 1330.00, true, true, NOW() - INTERVAL '12 days', 'op-003', NOW(), NOW()),
('cr-013', 'Case Study Download', 2900.00, 1015.00, true, false, NULL, 'op-003', NOW(), NOW()),
('cr-014', 'Demo Request Campaign', 5200.00, 1820.00, true, false, NULL, 'op-003', NOW(), NOW()),
('cr-015', 'Free Trial Landing', 3100.00, 1085.00, true, false, NULL, 'op-003', NOW(), NOW()),

-- Operation 4 - Restaurant App (5 creatives)
('cr-016', 'Geo-target - Office Area', 1200.00, 336.00, true, true, NOW() - INTERVAL '8 days', 'op-004', NOW(), NOW()),
('cr-017', 'Video - Order Process', 1800.00, 504.00, true, false, NULL, 'op-004', NOW(), NOW()),
('cr-018', 'Promo - First Order Discount', 950.00, 266.00, true, true, NOW() - INTERVAL '3 days', 'op-004', NOW(), NOW()),
('cr-019', 'Carousel - Popular Dishes', 1100.00, 308.00, true, false, NULL, 'op-004', NOW(), NOW()),
('cr-020', 'Story Ad - Chef Special', 1400.00, 392.00, true, false, NULL, 'op-004', NOW(), NOW()),

-- Operation 5 - Tech Conference (5 creatives)
('cr-021', 'Early Bird Ticket Promo', 6500.00, 2600.00, true, true, NOW() - INTERVAL '30 days', 'op-005', NOW(), NOW()),
('cr-022', 'Speaker Announcement Series', 4200.00, 1680.00, true, true, NOW() - INTERVAL '18 days', 'op-005', NOW(), NOW()),
('cr-023', 'Last Chance Tickets', 5800.00, 2320.00, true, false, NULL, 'op-005', NOW(), NOW()),
('cr-024', 'After Party Promo', 3100.00, 1240.00, true, false, NULL, 'op-005', NOW(), NOW()),
('cr-025', 'Workshop Highlight', 2400.00, 960.00, true, false, NULL, 'op-005', NOW(), NOW());
