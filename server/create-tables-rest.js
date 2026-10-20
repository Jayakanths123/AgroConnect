const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://ycorozkbfeqwybujwnaz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljb3JvemtiZmVxd3lidWp3bmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ2MCwiZXhwIjoyMDczMjM3NDYwfQ.Uk8pYd76w-UEEzLmnXrTJEMdo86sB71iOA1vnQI8UoQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTablesWithREST() {
  console.log('🚀 Creating forum tables using REST API...');
  
  try {
    // First, let's test if we can connect and see what tables exist
    console.log('📡 Testing Supabase connection...');
    
    // Try to query a non-existent table to see the error
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .limit(1);
    
    if (error && error.message.includes('relation "public.forum_posts" does not exist')) {
      console.log('❌ Tables do not exist. Creating them now...');
      
      // Since we can't create tables programmatically, let's provide the exact SQL
      console.log('\n📋 Please run this SQL in your Supabase SQL Editor:');
      console.log('🔗 Go to: https://supabase.com/dashboard/project/ycorozkbfeqwybujwnaz/sql');
      console.log('\n📝 Copy and paste this SQL:');
      console.log('```sql');
      console.log(`
-- Create forum_posts table
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

-- Create forum_comments table
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

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id VARCHAR(100) NOT NULL,
  action VARCHAR(10) NOT NULL CHECK (action IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id SERIAL PRIMARY KEY,
  comment_id INTEGER REFERENCES forum_comments(id) ON DELETE CASCADE,
  user_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Create post_bookmarks table
CREATE TABLE IF NOT EXISTS post_bookmarks (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
  reporter_id VARCHAR(100) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO forum_posts (title, content, author_id, author_name, category, language, has_voice_note, images, tags, likes_count, dislikes_count, views_count, author_reputation, is_verified, whatsapp_group_joined) VALUES
('Best practices for wheat crop in March', 'I''ve been farming wheat for 10 years and wanted to share some insights about planting in March conditions. The key is to ensure proper soil preparation and timing.', 'user1', 'Ramesh Kumar', 'Crop Management', 'Hindi', true, '["wheat-field.jpg"]', '["wheat", "planting", "march"]', 24, 2, 156, 1250, true, false),
('Dealing with aphid infestation on cotton', 'My cotton crop is showing signs of aphid damage. Has anyone tried organic solutions that actually work? I''m looking for natural alternatives to chemical pesticides.', 'user2', 'Priya Patel', 'Pest Control', 'English', false, '["cotton-aphids.jpg"]', '["cotton", "aphids", "organic", "pestcontrol"]', 16, 1, 89, 890, false, true);

-- Insert sample comments
INSERT INTO forum_comments (post_id, author_id, author_name, content, likes_count) VALUES
(1, 'user5', 'Suresh Kumar', 'Great insights! I''ve been following similar practices for wheat cultivation. The timing you mentioned is crucial for good yield.', 5),
(1, 'user6', 'Priya Singh', 'Thank you for sharing. This is very helpful. I''m planning to plant wheat next month and this timing advice is perfect.', 3),
(2, 'user8', 'Rajesh Kumar', 'Try neem oil spray, it works well for aphids. Mix 2ml neem oil with 1 liter water and spray every 3 days.', 8);
      `);
      console.log('```');
      console.log('\n✅ After running this SQL, your forum will have real database persistence!');
      
    } else if (error) {
      console.log('❌ Database error:', error.message);
    } else {
      console.log('✅ Tables already exist!');
      console.log('📄 Found posts:', data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTablesWithREST();
