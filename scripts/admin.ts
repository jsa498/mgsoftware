import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing environment variables for Supabase');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQL() {
  try {
    console.log('Reading SQL file...');
    const sqlContent = fs.readFileSync(path.resolve(process.cwd(), 'scripts/schema.sql'), 'utf8');
    
    console.log('Executing SQL...');
    // We need to manually split the SQL statements as Supabase doesn't accept multiple statements
    const sqlStatements = sqlContent.split(';').filter(statement => statement.trim() !== '');
    
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i].trim();
      if (!statement) continue;
      
      console.log(`Executing statement ${i + 1}/${sqlStatements.length}`);
      
      try {
        // Using the REST API directly to execute SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Prefer': 'params=single-object'
          },
          body: JSON.stringify({
            query: statement
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error(`Error executing statement: ${statement}`);
          console.error(error);
        }
      } catch (error) {
        console.error(`Error executing statement: ${statement}`);
        console.error(error);
      }
    }
    
    console.log('SQL execution completed!');
  } catch (error) {
    console.error('Error executing SQL:', error);
    process.exit(1);
  }
}

executeSQL(); 