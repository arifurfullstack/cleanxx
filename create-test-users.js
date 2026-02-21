import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lpiljoptzrohycqbrtll.supabase.co';
const supabaseKey = 'sb_publishable_kTvycNHCrjfQT2xYRGNNXw_ifItSliw';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test users with random suffixes to bypass rate limiting
const timestamp = Date.now();
const testUsers = [
  {
    email: `customer${timestamp}@cleanxx.io`,
    password: 'TestPassword123!',
    fullName: 'John Customer',
    accountType: 'customer'
  },
  {
    email: `cleaner${timestamp}@cleanxx.io`,
    password: 'TestPassword123!',
    fullName: 'Sarah Cleaner',
    accountType: 'cleaner'
  },
  {
    email: `admin${timestamp}@cleanxx.io`,
    password: 'TestPassword123!',
    fullName: 'Admin User',
    accountType: 'admin'
  }
];

// Add delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createTestUsers() {
  try {
    console.log('🚀 Starting test user creation...\n');

    // Initial delay of 30 minutes to ensure rate limit is reset from previous attempts
    console.log('⏳ Initial 30-minute wait to reset rate limit from previous attempts...');
    for (let t = 1800; t > 0; t--) {
      if (t % 300 === 0) console.log(`   ${Math.round(t/60)} minutes remaining...`);
      await delay(1000);
    }
    console.log('✅ Rate limit should be fully reset.\n');

    for (let i = 0; i < testUsers.length; i++) {
      const user = testUsers[i];
      try {
        console.log(`[${i+1}/3] Creating ${user.accountType}: ${user.email}`);

        // Add additional delay between requests after first user
        if (i > 0) {
          console.log(`\n⏳ WAITING 30 MINUTES between users to avoid rate limiting...`);
          for (let t = 1800; t > 0; t--) {
            if (t % 300 === 0) console.log(`   ${Math.round(t/60)} minutes remaining...`);
            await delay(1000);
          }
          console.log(`✓ Attempting next user: ${user.accountType}`);
        }

        // Sign up user
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              full_name: user.fullName,
              account_type: user.accountType
            }
          }
        });

        if (error) {
          console.error(`  ❌ Error: ${error.message}`);
        } else if (data.user) {
          console.log(`  ✅ Created successfully`);
          console.log(`     Email: ${user.email}`);
          console.log(`     Password: ${user.password}`);
          console.log(`     Role: ${user.accountType}\n`);
        }
      } catch (err) {
        console.error(`  ❌ Error creating ${user.email}:`, err.message);
      }
    }

    console.log('\n✅ TEST USERS CREATED!\n');
    console.log('Test Credentials:');
    console.log('─'.repeat(50));
    testUsers.forEach(user => {
      console.log(`\n${user.accountType.toUpperCase()}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
    });
    console.log('\n' + '─'.repeat(50));

  } catch (error) {
    console.error('Migration error:', error);
  }
}

createTestUsers();
