const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Get command line arguments
const args = process.argv.slice(2);
const targetCompanyId = args[0];
const targetCompanyName = args[1] || 'specified company';

if (!targetCompanyId) {
  console.log('Usage: node import-accounts-for-company.js <COMPANY_ID> [COMPANY_NAME]');
  console.log('');
  console.log('Available companies:');
  
  // List available companies
  supabase.from('companies').select('id, name, domain').then(({ data }) => {
    if (data) {
      data.forEach(company => {
        console.log(`  ${company.id} - ${company.name} (${company.domain})`);
      });
    }
    process.exit(1);
  });
  return;
}

// Read the cleaned accounts data
const accountsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'accounts-to-import.json'), 'utf-8')
);

// Get admin user for the specified company
async function getCompanyAdmin(companyId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name')
    .eq('company_id', companyId)
    .eq('is_admin', true)
    .limit(1)
    .single();
  
  if (error) {
    console.error('Error fetching admin for company:', error);
    return null;
  }
  return data;
}

// Same utility functions from original script
function parseExcelDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr;
}

function cleanPhone(phone) {
  if (!phone) return null;
  return phone.replace(/\s+/g, ' ').trim();
}

function mapIndustry(industry) {
  if (!industry) return null;
  const industryMap = {
    'Educational institutions': 'Education',
    'Educational institution': 'Education',
    'Biotech Company': 'Biotechnology',
    'Diagnostics': 'Healthcare',
    'Diagnostic': 'Healthcare',
    'Dairy': 'Food & Beverage',
    'Distillery': 'Food & Beverage',
    'Environmental': 'Environmental Services',
    'Food Testing': 'Food & Beverage',
    'Instrumentation': 'Manufacturing',
    'Research Institute': 'Research'
  };
  return industryMap[industry] || industry;
}

async function importAccountsForCompany() {
  console.log(`Starting account import for ${targetCompanyName} (${targetCompanyId})...`);
  
  // Verify company exists
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('id, name')
    .eq('id', targetCompanyId)
    .single();
  
  if (companyError || !company) {
    console.error('Company not found:', targetCompanyId);
    return;
  }
  
  console.log(`✅ Target company: ${company.name}`);
  
  // Get admin user for this company
  const admin = await getCompanyAdmin(targetCompanyId);
  if (!admin) {
    console.error('No admin user found for this company');
    return;
  }
  
  console.log(`✅ Using admin: ${admin.full_name}`);
  
  // Check existing accounts to avoid duplicates
  const { count: existingCount } = await supabase
    .from('accounts')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', targetCompanyId);
  
  console.log(`📊 Existing accounts in company: ${existingCount || 0}`);
  
  // Prepare accounts for import (same logic as original)
  const accountsToImport = [];
  const duplicates = [];
  const errors = [];
  
  console.log(`📋 Processing ${accountsData.length} accounts...`);
  
  for (let i = 0; i < accountsData.length; i++) {
    const account = accountsData[i];
    
    if (!account.account_name || account.account_name.trim() === '') {
      continue;
    }
    
    try {
      // Check for existing account with same name in this company
      const { data: existing } = await supabase
        .from('accounts')
        .select('id, account_name')
        .eq('company_id', targetCompanyId)
        .eq('account_name', account.account_name)
        .single();
      
      if (existing) {
        duplicates.push({
          name: account.account_name,
          existing_id: existing.id
        });
        continue;
      }
      
      // Prepare account data
      const accountRecord = {
        company_id: targetCompanyId,
        account_name: account.account_name.trim(),
        industry: mapIndustry(account.industry),
        website: account.website,
        phone: cleanPhone(account.billing_phone),
        description: account.description,
        
        // Address data
        billing_street: account.billing_street || account['Billing Address'],
        billing_city: account.billing_city || account['Billing City'],
        billing_state: account.billing_state || account['Billing State/Province'],
        billing_country: account.billing_country || account['Billing Country'],
        billing_postal_code: account.billing_postal_code || account['Billing Zip/PostalCode'],
        
        shipping_street: account['Shipping Address'],
        shipping_city: account['Shipping City'],
        shipping_state: account['Shipping State/Province'],
        shipping_country: account['Shipping Country'],
        shipping_postal_code: account['Shipping Zip/PostalCode'],
        
        // Business info
        turnover_range: account['TurnOver'],
        credit_days: account['Credit Days'] ? parseInt(account['Credit Days']) : null,
        credit_amount: account['Credit Amount'] ? parseFloat(account['Credit Amount']) : 0,
        
        // Tax info
        gstin: account['GSTIN'],
        pan_number: account['PAN No'],
        vat_tin: account['VAT TIN'],
        cst_number: account['CST NO'],
        
        // Metadata
        owner_id: admin.id,
        status: 'Active',
        original_id: account['Sr No']?.toString(),
        original_created_by: account.created_by_name || account['Created By'],
        original_modified_by: account.modified_by_name || account['Last Modified by'],
        original_created_at: parseExcelDate(account['Created By Date']),
        original_modified_at: parseExcelDate(account['Last Modified Date']),
        assigned_to_names: account['AssignTo'],
        account_type: 'Customer'
      };
      
      // Remove null/undefined values
      Object.keys(accountRecord).forEach(key => {
        if (accountRecord[key] === null || accountRecord[key] === undefined || accountRecord[key] === '') {
          delete accountRecord[key];
        }
      });
      
      accountsToImport.push(accountRecord);
      
    } catch (error) {
      errors.push({
        account: account.account_name,
        error: error.message
      });
    }
    
    // Progress indicator
    if ((i + 1) % 200 === 0) {
      console.log(`Processed ${i + 1}/${accountsData.length} accounts...`);
    }
  }
  
  console.log(`\n📊 Import Summary:`);
  console.log(`  Ready to import: ${accountsToImport.length} accounts`);
  console.log(`  Duplicates skipped: ${duplicates.length}`);
  console.log(`  Errors: ${errors.length}`);
  
  // Import in batches
  const batchSize = 50;
  let importedCount = 0;
  let failedCount = 0;
  
  for (let i = 0; i < accountsToImport.length; i += batchSize) {
    const batch = accountsToImport.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    
    try {
      const { data, error } = await supabase
        .from('accounts')
        .insert(batch)
        .select();
      
      if (error) {
        console.error(`❌ Batch ${batchNum} failed:`, error.message);
        failedCount += batch.length;
      } else {
        importedCount += data.length;
        console.log(`✅ Batch ${batchNum}: ${data.length} accounts imported`);
      }
    } catch (batchError) {
      console.error(`❌ Batch ${batchNum} error:`, batchError.message);
      failedCount += batch.length;
    }
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n🎉 Import Complete!');
  console.log(`✅ Successfully imported: ${importedCount} accounts`);
  console.log(`❌ Failed: ${failedCount} accounts`);
  console.log(`⚠️  Duplicates skipped: ${duplicates.length}`);
  console.log(`🏢 Company: ${company.name} (${targetCompanyId})`);
  
  if (errors.length > 0) {
    console.log('\n❌ First 5 errors:');
    errors.slice(0, 5).forEach(err => {
      console.log(`  - ${err.account}: ${err.error}`);
    });
  }
}

// Run the import
importAccountsForCompany().catch(console.error);