const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://axaodtloyxqawowckurp.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4YW9kdGxveXhxYXdvd2NrdXJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDczODM0NiwiZXhwIjoyMDUwMzE0MzQ2fQ.mXdTI6LGhOEH4O9J-X2f_CW4HPKMTIWZAyB-mlXjjAI';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testLogin() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Check if demo-admin@labgig.com exists
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name, company_id, is_admin, password')
      .eq('email', 'demo-admin@labgig.com');
      
    if (userError) {
      console.log('Error fetching user:', userError);
      return;
    }
    
    console.log('Demo admin user:', users);
    
    // Test 2: Check all users in the demo company
    const { data: companyUsers, error: companyError } = await supabase
      .from('users')
      .select('id, email, full_name, company_id, is_admin, password')
      .eq('company_id', '22adbd06-8ce1-49ea-9a03-d0b46720c624');
      
    if (companyError) {
      console.log('Error fetching company users:', companyError);
      return;
    }
    
    console.log('All users in demo company:', companyUsers);
    
    // Test 3: Check companies table
    const { data: companies, error: companyFetchError } = await supabase
      .from('companies')
      .select('id, name')
      .eq('id', '22adbd06-8ce1-49ea-9a03-d0b46720c624');
      
    if (companyFetchError) {
      console.log('Error fetching companies:', companyFetchError);
      return;
    }
    
    console.log('Demo company info:', companies);
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testLogin();