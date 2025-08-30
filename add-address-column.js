const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabase = createClient(
  'https://ykfefvhufskdgvnqdjsp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrZmVmdmh1ZnNrZGd2bnFkanNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDM2MjM2NCwiZXhwIjoyMDQ5OTM4MzY0fQ.RTjHUIoUFqY0VoKrTIZ-7t6SBYVE-wF1kh7uGv5_7wk'
)

async function addAddressColumn() {
  try {
    console.log('Adding address column to accounts table...')
    
    // Read the SQL file
    const sql = fs.readFileSync('supabase/add_address_to_accounts.sql', 'utf8')
    console.log('SQL file read successfully')
    
    // Use Supabase's raw SQL execution
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: sql 
    })
    
    if (error) {
      console.error('Error executing SQL:', error)
      
      // Try alternative approach - direct column addition
      console.log('Trying direct column addition...')
      const { error: altError } = await supabase.rpc('exec_sql', { 
        sql_query: 'ALTER TABLE accounts ADD COLUMN IF NOT EXISTS address TEXT;' 
      })
      
      if (altError) {
        console.error('Alternative approach also failed:', altError)
      } else {
        console.log('Address column added successfully via alternative method')
      }
    } else {
      console.log('Address column added successfully:', data)
    }
    
    // Verify the column was added
    const { data: columns, error: colError } = await supabase.rpc('exec_sql', { 
      sql_query: "SELECT column_name FROM information_schema.columns WHERE table_name='accounts' AND column_name='address';" 
    })
    
    if (colError) {
      console.error('Error checking column:', colError)
    } else {
      console.log('Column verification result:', columns)
    }
    
  } catch (error) {
    console.error('Script error:', error)
  }
}

addAddressColumn()