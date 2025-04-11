/*
  # Create tables for games, lessons, and arguments

  1. New Tables
    - `games`
      - `id` (text, primary key)
      - `title` (text)
      - `description` (text)
      - `icon` (text)
      - `color` (text)
    - `lessons`
      - `id` (uuid, primary key)
      - `game_id` (text, foreign key)
      - `title` (text)
      - `command` (text)
      - `description` (text)
      - `order` (integer)
    - `arguments`
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, foreign key)
      - `flag` (text)
      - `description` (text)
      - `order` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read data
*/

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to games"
  ON games
  FOR SELECT
  TO public
  USING (true);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id text REFERENCES games(id) ON DELETE CASCADE,
  title text NOT NULL,
  command text NOT NULL,
  description text NOT NULL,
  "order" integer NOT NULL,
  UNIQUE(game_id, "order")
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to lessons"
  ON lessons
  FOR SELECT
  TO public
  USING (true);

-- Create arguments table
CREATE TABLE IF NOT EXISTS arguments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  flag text NOT NULL,
  description text NOT NULL,
  "order" integer NOT NULL,
  UNIQUE(lesson_id, "order")
);

ALTER TABLE arguments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to arguments"
  ON arguments
  FOR SELECT
  TO public
  USING (true);

-- Insert initial data
INSERT INTO games (id, title, description, icon, color) VALUES
  ('docker', 'Docker', 'Master Docker commands and container management', 'Container', 'blue'),
  ('javascript', 'JavaScript', 'Learn JavaScript fundamentals and advanced concepts', 'FileJson', 'yellow'),
  ('nginx', 'Nginx', 'Configure and manage Nginx web server', 'Server', 'green');

-- Insert Docker lessons
WITH docker_lesson AS (
  INSERT INTO lessons (game_id, title, command, description, "order") VALUES
    ('docker', 'Check Docker Version', 'docker --version', 'Check Docker Version', 1),
    ('docker', 'List Running Containers', 'docker ps', 'List Running Containers', 2)
  RETURNING id, "order"
)
INSERT INTO arguments (lesson_id, flag, description, "order")
SELECT 
  dl.id,
  CASE dl."order"
    WHEN 1 THEN flag
    WHEN 2 THEN flag
  END,
  CASE dl."order"
    WHEN 1 THEN description
    WHEN 2 THEN description
  END,
  row_number() OVER (PARTITION BY dl.id ORDER BY dl."order")
FROM docker_lesson dl
CROSS JOIN (
  VALUES 
    ('-a', 'List all containers (running and stopped)'),
    ('-q', 'Only display numeric IDs of containers'),
    ('--filter', 'Filter output based on conditions like status'),
    ('--no-trunc', 'Don''t truncate output')
) AS args(flag, description)
WHERE 
  (dl."order" = 1 AND args.flag IN ('-a', '-q', '--filter'))
  OR (dl."order" = 2 AND args.flag IN ('-a', '--no-trunc'));

-- Insert JavaScript lessons
WITH js_lesson AS (
  INSERT INTO lessons (game_id, title, command, description, "order") VALUES
    ('javascript', 'Variable Declaration', 'let message = "Hello"', 'Variable Declaration', 1)
  RETURNING id
)
INSERT INTO arguments (lesson_id, flag, description, "order")
SELECT 
  js_lesson.id,
  flag,
  description,
  row_number() OVER ()
FROM js_lesson
CROSS JOIN (
  VALUES 
    ('const', 'Declare a constant variable'),
    ('var', 'Declare a function-scoped variable')
) AS args(flag, description);

-- Insert Nginx lessons
WITH nginx_lesson AS (
  INSERT INTO lessons (game_id, title, command, description, "order") VALUES
    ('nginx', 'Start Nginx Server', 'nginx', 'Start Nginx Server', 1)
  RETURNING id
)
INSERT INTO arguments (lesson_id, flag, description, "order")
SELECT 
  nginx_lesson.id,
  flag,
  description,
  row_number() OVER ()
FROM nginx_lesson
CROSS JOIN (
  VALUES 
    ('-t', 'Test configuration file'),
    ('-s reload', 'Reload configuration')
) AS args(flag, description);