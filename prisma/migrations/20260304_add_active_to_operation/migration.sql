-- Add active column to operations for soft delete
ALTER TABLE "operations" ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT true;
