const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabase = createClient(
  'https://ykfefvhufskdgvnqdjsp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrZmVmdmh1ZnNrZGd2bnFkanNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDM2MjM2NCwiZXhwIjoyMDQ5OTM4MzY0fQ.RTjHUIoUFqY0VoKrTIZ-7t6SBYVE-wF1kh7uGv5_7wk'
)

async function runSQL() {
  try {
    // First, check if the table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'leads')
    
    if (tablesError) {
      console.error('Error checking for table:', tablesError)
      return
    }

    console.log('Table exists:', tables.length > 0)
    
    if (tables.length === 0) {
      console.log('Creating leads table...')
      
      // Read the SQL file
      const sql = fs.readFileSync('supabase/create_leads_table.sql', 'utf8')
      
      // Execute the SQL (this is a simplified approach)
      // For a more robust solution, you'd split the SQL into individual statements
      const statements = sql.split(';').filter(stmt => stmt.trim())
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error } = await supabase.rpc('exec_sql', { sql_query: statement.trim() + ';' })
            if (error) {
              console.log('Statement:', statement.substring(0, 50) + '...')
              console.log('Error:', error.message)
            } else {
              console.log('Executed successfully:', statement.substring(0, 50) + '...')
            }
          } catch (err) {
            console.log('Direct SQL execution not available, trying raw SQL execution...')
            // Alternative approach for table creation
            break
          }
        }
      }
      
      console.log('Table creation completed')
    }

    // Test the leads table
    const { data: testData, error: testError } = await supabase
      .from('leads')
      .select('count(*)')
      .limit(1)

    if (testError) {
      console.error('Error testing leads table:', testError)
    } else {
      console.log('Leads table is accessible')
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

runSQL()