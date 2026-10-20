const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://ycorozkbfeqwybujwnaz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljb3JvemtiZmVxd3lidWp3bmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ2MCwiZXhwIjoyMDczMjM3NDYwfQ.Uk8pYd76w-UEEzLmnXrTJEMdo86sB71iOA1vnQI8UoQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('🚀 Testing Supabase connection...');
  
  try {
    // Test the connection by trying to insert a test post
    console.log('📝 Testing post creation...');
    
    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        title: 'Test Post',
        content: 'This is a test post to verify database connection',
        author_id: 'test_user',
        author_name: 'Test User',
        category: 'Test',
        language: 'English',
        has_voice_note: false,
        images: [],
        tags: ['test'],
        likes_count: 0,
        dislikes_count: 0,
        views_count: 0,
        author_reputation: 100,
        is_verified: false,
        whatsapp_group_joined: false
      })
      .select();
    
    if (error) {
      console.log('❌ Database error:', error.message);
      console.log('📋 This means the tables need to be created manually in Supabase');
      console.log('🔗 Please go to your Supabase dashboard and run the SQL from create-forum-tables-manual.sql');
    } else {
      console.log('✅ Database connection successful!');
      console.log('📄 Created test post:', data);
      
      // Clean up test post
      await supabase
        .from('forum_posts')
        .delete()
        .eq('id', data[0].id);
      console.log('🧹 Cleaned up test post');
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
}

testConnection();
