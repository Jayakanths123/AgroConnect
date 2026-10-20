const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://ycorozkbfeqwybujwnaz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljb3JvemtiZmVxd3lidWp3bmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ2MCwiZXhwIjoyMDczMjM3NDYwfQ.Uk8pYd76w-UEEzLmnXrTJEMdo86sB71iOA1vnQI8UoQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🚀 Creating forum tables directly...');
  
  try {
    // Create forum_posts table
    console.log('📝 Creating forum_posts table...');
    const { error: postsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS forum_posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          author_id VARCHAR(100) NOT NULL,
          author_name VARCHAR(100) NOT NULL,
          category VARCHAR(100) NOT NULL,
          language VARCHAR(50) NOT NULL DEFAULT 'English',
          has_voice_note BOOLEAN DEFAULT FALSE,
          images JSONB DEFAULT '[]',
          tags JSONB DEFAULT '[]',
          likes_count INTEGER DEFAULT 0,
          dislikes_count INTEGER DEFAULT 0,
          views_count INTEGER DEFAULT 0,
          author_reputation INTEGER DEFAULT 100,
          is_verified BOOLEAN DEFAULT FALSE,
          whatsapp_group_joined BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (postsError) {
      console.log('❌ Error creating forum_posts:', postsError.message);
    } else {
      console.log('✅ forum_posts table created successfully');
    }

    // Create forum_comments table
    console.log('📝 Creating forum_comments table...');
    const { error: commentsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS forum_comments (
          id SERIAL PRIMARY KEY,
          post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
          author_id VARCHAR(100) NOT NULL,
          author_name VARCHAR(100) NOT NULL,
          content TEXT NOT NULL,
          parent_comment_id INTEGER REFERENCES forum_comments(id) ON DELETE CASCADE,
          likes_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (commentsError) {
      console.log('❌ Error creating forum_comments:', commentsError.message);
    } else {
      console.log('✅ forum_comments table created successfully');
    }

    // Create post_likes table
    console.log('📝 Creating post_likes table...');
    const { error: likesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS post_likes (
          id SERIAL PRIMARY KEY,
          post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
          user_id VARCHAR(100) NOT NULL,
          action VARCHAR(10) NOT NULL CHECK (action IN ('like', 'dislike')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(post_id, user_id)
        );
      `
    });
    
    if (likesError) {
      console.log('❌ Error creating post_likes:', likesError.message);
    } else {
      console.log('✅ post_likes table created successfully');
    }

    console.log('🎉 Forum tables creation completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTables();
