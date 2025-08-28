const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eflvzsfgoelonfclzrjy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbHZ6c2Znb2Vsb25mY2x6cmp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzY1NjE5MCwiZXhwIjoyMDYzMjMyMTkwfQ.5wn-NFj7rXyHmZ6imX0tfzfMKzYpzs7NBTVPrlFn15U';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log('Testing connection to your Supabase project...');
    
    // Test 1: Check if accounts table exists
    const { data: tables, error: tablesError } = await supabase
      .from('accounts')
      .select('count')
      .limit(1);
      
    if (tablesError) {
      if (tablesError.message.includes('relation "public.accounts" does not exist')) {
        console.log('❌ Accounts table does not exist yet');
        console.log('✅ But connection to Supabase is working!');
        console.log('\nNext steps:');
        console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/eflvzsfgoelonfclzrjy');
        console.log('2. Click on "SQL Editor" in the left sidebar');
        console.log('3. Copy and run the SQL from: scripts/setup-accounts-in-prod.sql');
        console.log('4. Then run the SQL from: scripts/setup-demo-data.sql');
        console.log('5. After that, you can import your accounts data');
      } else {
        console.log('Error checking accounts table:', tablesError.message);
      }
      return;
    }
    
    console.log('✅ Accounts table exists!');
    
    // Test 2: Check if demo user exists
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'demo-admin@labgig.com');
      
    if (userError) {
      console.log('Error checking users:', userError.message);
      return;
    }
    
    if (users && users.length > 0) {
      console.log('✅ Demo user exists:', users[0]);
    } else {
      console.log('❌ Demo user does not exist yet');
      console.log('Run the SQL from scripts/setup-demo-data.sql in Supabase');
    }
    
    // Test 3: Check accounts count
    const { count, error: countError } = await supabase
      .from('accounts')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.log('Error counting accounts:', countError.message);
      return;
    }
    
    console.log(`📊 Total accounts in database: ${count || 0}`);
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();