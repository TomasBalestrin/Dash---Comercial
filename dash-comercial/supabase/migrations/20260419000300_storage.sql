-- ============================================
-- Buckets
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('team-banners', 'team-banners', true, 2097152, ARRAY['image/png','image/jpeg','image/webp']),
  ('closer-photos', 'closer-photos', true, 2097152, ARRAY['image/png','image/jpeg','image/webp']);

-- ============================================
-- Storage RLS — upload só admin, leitura pública
-- ============================================
CREATE POLICY "team_banners_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'team-banners');

CREATE POLICY "team_banners_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'team-banners' AND is_admin());

CREATE POLICY "team_banners_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'team-banners' AND is_admin());

CREATE POLICY "team_banners_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'team-banners' AND is_admin());

CREATE POLICY "closer_photos_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'closer-photos');

CREATE POLICY "closer_photos_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'closer-photos' AND is_admin());

CREATE POLICY "closer_photos_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'closer-photos' AND is_admin());

CREATE POLICY "closer_photos_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'closer-photos' AND is_admin());
