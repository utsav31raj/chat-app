/*
  # Create Fake News Detection History Table

  1. New Tables
    - `detections`
      - `id` (uuid, primary key)
      - `text` (text, the news article/content analyzed)
      - `prediction` (text, "real" or "fake")
      - `confidence` (numeric, confidence score 0-1)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `detections` table
    - Add policy to allow anonymous users to insert detections
    - Add policy to allow users to read all detections (public history)

  3. Indexes
    - Add index on `created_at` for efficient ordering
*/

CREATE TABLE IF NOT EXISTS detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  prediction text NOT NULL CHECK (prediction IN ('real', 'fake')),
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE detections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous users to insert detections"
  ON detections
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow all users to read detections"
  ON detections
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_detections_created_at ON detections(created_at DESC);
