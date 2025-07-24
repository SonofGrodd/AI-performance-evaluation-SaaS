import 'dotenv/config'  // Add this line at the top
import { supabaseAdmin } from './lib/supabase'

async function testConnection() {
  console.log('Environment check:')
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing')
  
  try {
    const { data, error } = await supabaseAdmin
      .from('companies')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Database connection failed:', error)
    } else {
      console.log('✅ Database connection successful!')
      console.log('Companies table accessible:', data)
    }
  } catch (err) {
    console.error('Connection test failed:', err)
  }
}

testConnection()