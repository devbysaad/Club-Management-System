-- Create Staff record for your admin user
-- Run this in Prisma Studio SQL console or via psql

INSERT INTO "Staff" (
  id,
  "userId",
  "firstName",
  "lastName",
  email,
  phone,
  address,
  "createdAt",
  "updatedAt",
  "isDeleted"
)
VALUES (
  gen_random_uuid(),
  'user_38Aq6olcCYiYCiCzphP1akPMyDA',  -- Your Clerk user ID
  'Admin',
  'User',
  'admin@patohornets.com',  -- Your email
  '',
  '',
  NOW(),
  NOW(),
  false
);

-- Verify it was created
SELECT * FROM "Staff" WHERE "userId" = 'user_38Aq6olcCYiYCiCzphP1akPMyDA';
