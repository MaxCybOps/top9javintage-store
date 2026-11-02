import { isStudioAuthed, studioAuthEnabled } from '@/lib/auth';
import { StudioApp } from '@/components/studio-app';
import { StudioLogin } from '@/components/studio-login';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Store studio — Top9javintage', robots: { index: false, follow: false } };
export default async function StudioPage() {
  const authed = await isStudioAuthed();
  if (!authed) return <StudioLogin />;
  return <StudioApp authEnabled={studioAuthEnabled()} />;
}
