-- This is a guide for manually creating test users via Supabase Dashboard
-- Since auth has rate limiting, we'll document the step-by-step process

-- TEST USER 1 - CUSTOMER
Email: customer1@example.com
Password: TestPassword123
Full Name: John Customer
Account Type: customer

-- TEST USER 2 - CLEANER  
Email: cleaner1@example.com
Password: TestPassword123
Full Name: Sarah Cleaner
Account Type: cleaner

-- TEST USER 3 - ADMIN
Email: admin1@example.com
Password: TestPassword123
Full Name: Admin User
Account Type: admin

/*
STEPS TO CREATE USERS:

1. Go to: http://localhost:8080/auth
2. Click "Sign Up" 
3. Fill in the form with the details above
4. Click "Create Account"
5. Repeat for each user

Each user will be automatically:
- Created in auth.users (Supabase Auth)
- Have a profile created in profiles table
- Have a user_role created based on account_type
- Assigned to the correct dashboard

The trigger function handle_new_user() will automatically create the profile and role!
*/
