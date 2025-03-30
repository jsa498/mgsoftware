import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing environment variables for Supabase');
}

async function executeSql(query: string) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        query,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error executing SQL:', error);
    throw error;
  }
}

async function applySchema() {
  try {
    // Read the schema file
    const schemaPath = path.resolve(process.cwd(), 'scripts/schema.sql');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Split statements by semicolon
    const statements = schemaContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}`);
      
      try {
        const result = await executeSql(statement);
        console.log(`Statement ${i + 1} executed successfully`);
      } catch (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        console.error('Statement:', statement);
      }
    }
    
    console.log('Schema applied successfully!');
  } catch (error) {
    console.error('Error applying schema:', error);
    process.exit(1);
  }
}

applySchema(); 