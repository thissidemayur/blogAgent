-- Add summary with empty default (safe — no uniqueness constraint)
ALTER TABLE "blog_posts" ADD COLUMN "summary" TEXT NOT NULL DEFAULT '';

-- Add slug with a temporary default so existing rows don't break
ALTER TABLE "blog_posts" ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';

-- Backfill existing rows: give each one a unique slug using their id
-- 'legacy-' prefix makes clear these are old rows, id suffix guarantees uniqueness
UPDATE "blog_posts" SET "slug" = 'legacy-' || "id" WHERE "slug" = '';

-- NOW add the unique constraint — safe because every row now has a unique value
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_slug_key" UNIQUE ("slug");