-- Add ad_steps setting if it doesn't exist
INSERT INTO "Setting" (id, key, value, "group", "updatedAt")
VALUES (gen_random_uuid(), 'ad_steps', '0', 'ads', NOW())
ON CONFLICT (key) DO NOTHING;
