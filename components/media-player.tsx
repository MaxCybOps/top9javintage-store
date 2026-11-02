'use client';
import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Maximize2 } from 'lucide-react';
export function MediaVideo({ src, poster, className = '', onExpand }: { src: string; poster?: string; className?: string; onExpand?: () => void }) {
  const ref = useRef<HTMLVideoElement>(null); const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false); const [muted, setMuted] = useState(true); const [playing, setPlaying] = useState(false); const [error, setError] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { const inView = entries[0].isIntersecting; setVisible(inView); if (!inView) ref.current?.pause(); }, { threshold: 0.25 });
    if (wrap.current) observer.observe(wrap.current); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (visible && ref.current) { ref.current.load(); void ref.current.play().catch(() => setPlaying(false)); }
  }, [visible, src]);
  function togglePlay() { if (!ref.current) return; if (ref.current.paused) void ref.current.play().catch(() => setError(true)); else ref.current.pause(); }
  function toggleMute() { if (!ref.current) return; ref.current.muted = !muted; setMuted(!muted); if (ref.current.paused) void ref.current.play().catch(() => {}); }
  return <div ref={wrap} className={`media-player ${className}`}><video ref={ref} src={visible ? src : undefined} poster={poster} muted={muted} loop playsInline preload={visible ? 'metadata' : 'none'} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setError(true)} onClick={togglePlay} aria-label="Product style film" />{error ? <div className="video-error">This film couldn’t load.<button onClick={() => { setError(false); ref.current?.load(); void ref.current?.play().catch(() => {}); }}>Try again</button></div> : <><span className="film-label"><span className="live-dot" /> THE FIT FILM</span><div className="video-controls"><button onClick={togglePlay} aria-label={playing ? 'Pause video' : 'Play video'}>{playing ? <Pause size={17} /> : <Play size={17} />}</button><button onClick={toggleMute} className="unmute-button" aria-label={muted ? 'Unmute video' : 'Mute video'}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}<span>{muted ? 'Tap for sound' : 'Sound on'}</span></button>{onExpand && <button onClick={onExpand} aria-label="Expand video"><Maximize2 size={16} /></button>}</div></>}</div>;
}
