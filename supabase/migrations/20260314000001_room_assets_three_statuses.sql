-- Migrate room_assets status to to_do | in_review | approved
UPDATE room_assets SET status = 'to_do' WHERE status IN ('pending', 'rejected');

-- Ensure default for new rows
ALTER TABLE room_assets
  ALTER COLUMN status SET DEFAULT 'to_do';
