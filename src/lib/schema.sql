-- LinkedIn Assistant Database Schema

-- Inputs: stores pasted articles or topics
CREATE TABLE IF NOT EXISTS inputs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK (type IN ('article', 'topic')),
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Ideas: AI-generated post ideas for each input
CREATE TABLE IF NOT EXISTS ideas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  input_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (input_id) REFERENCES inputs(id) ON DELETE CASCADE
);

-- Posts: generated drafts with variations
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  length TEXT NOT NULL CHECK (length IN ('short', 'medium', 'long')),
  tone TEXT NOT NULL CHECK (tone IN ('professional', 'conversational', 'storytelling', 'thought-leader')),
  hashtags TEXT NOT NULL DEFAULT '[]',
  best_time TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_ideas_input_id ON ideas(input_id);
CREATE INDEX IF NOT EXISTS idx_posts_idea_id ON posts(idea_id);
CREATE INDEX IF NOT EXISTS idx_inputs_created_at ON inputs(created_at DESC);
