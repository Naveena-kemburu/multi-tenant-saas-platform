-- Insert super admin user
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role, is_active) VALUES
('11111111-1111-1111-1111-111111111111', NULL, 'superadmin@system.com', '$2b$10$YourBcryptHashHere', 'Super Administrator', 'super_admin', true);

-- Insert demo tenant
INSERT INTO tenants (id, name, subdomain, status, subscription_plan, max_users, max_projects) VALUES
('22222222-2222-2222-2222-222222222222', 'Demo Company', 'demo', 'active', 'pro', 25, 15);

-- Insert tenant admin
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role, is_active) VALUES
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'admin@demo.com', '$2b$10$YourBcryptHashHere', 'Admin User', 'tenant_admin', true);

-- Insert regular users
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role, is_active) VALUES
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'user1@demo.com', '$2b$10$YourBcryptHashHere', 'User One', 'user', true),
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'user2@demo.com', '$2b$10$YourBcryptHashHere', 'User Two', 'user', true);

-- Insert projects
INSERT INTO projects (id, tenant_id, name, description, status, created_by) VALUES
('66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 'E-Commerce Platform', 'Building an online marketplace', 'active', '33333333-3333-3333-3333-333333333333'),
('77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'Mobile App Development', 'Cross-platform mobile application', 'active', '33333333-3333-3333-3333-333333333333');

-- Insert tasks
INSERT INTO tasks (id, project_id, tenant_id, title, description, status, priority, assigned_to) VALUES
('88888888-8888-8888-8888-888888888888', '66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 'Design database schema', 'Create database design', 'completed', 'high', '44444444-4444-4444-4444-444444444444'),
('99999999-9999-9999-9999-999999999999', '66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 'Implement payment gateway', 'Integrate payment processing', 'in_progress', 'high', '55555555-5555-5555-5555-555555555555');
