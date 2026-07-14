-- Start: Kampung Siber - Virtual Folder Persistence (Phase 2)
-- Persistently tracks virtual directory maps per user so custom folders
-- survive R2 remounts and page refreshes cleanly.
CREATE TABLE IF NOT EXISTS public.virtual_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  parent text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, parent, name)
);

-- Index for fast per-user prefix lookups
CREATE INDEX IF NOT EXISTS idx_virtual_folders_user_parent
  ON public.virtual_folders (user_id, parent);

-- Row Level Security: users only see their own folders
ALTER TABLE public.virtual_folders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "virtual_folders_owner_select" ON public.virtual_folders;
CREATE POLICY "virtual_folders_owner_select" ON public.virtual_folders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "virtual_folders_owner_insert" ON public.virtual_folders;
CREATE POLICY "virtual_folders_owner_insert" ON public.virtual_folders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "virtual_folders_owner_delete" ON public.virtual_folders;
CREATE POLICY "virtual_folders_owner_delete" ON public.virtual_folders
  FOR DELETE USING (auth.uid() = user_id);
-- End: Kampung Siber - Virtual Folder Persistence