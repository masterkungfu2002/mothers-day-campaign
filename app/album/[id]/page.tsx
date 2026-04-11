import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import MothersDayJourney from '@/components/journey/MothersDayJourney';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function AlbumPage({ params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { id } = params;
  const col = UUID_RE.test(id) ? 'id' : 'custom_slug';

  const { data: album, error } = await supabase
    .from('albums')
    .select('*')
    .eq(col, id)
    .single();

  if (error || !album) {
    console.error('Album query error:', error);
    notFound();
  }

  // Cột `photos` là jsonb → đã là array sẵn
  const photos = Array.isArray(album.photos) ? album.photos : [];

  return <MothersDayJourney album={album} photos={photos} />;
}
