/*
  # Add rating columns to drivers table

  1. Changes
    - Add rating column (integer)
    - Add last_rating_date column (timestamp)
    - Add check constraint for rating range (0-10)
*/

ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 0 AND rating <= 10),
ADD COLUMN IF NOT EXISTS last_rating_date TIMESTAMPTZ;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_drivers_rating ON drivers(rating);