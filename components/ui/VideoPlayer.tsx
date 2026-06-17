"use client";

import { useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  caption?: string;
}

export default function VideoPlayer({ src, poster, caption }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div style={{ position: "relative", borderRadius: "2px", overflow: "hidden", background: "var(--ink)" }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        playsInline
        loop
        style={{ width: "100%", display: "block", maxHeight: "520px", objectFit: "cover" }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {/* Controls overlay */}
      <div
        onClick={toggle}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          background: playing ? "transparent" : "rgba(26,22,18,0.35)",
          transition: "background 0.3s",
        }}
      >
        {!playing && (
          <div style={{
            width: 56, height: 56,
            borderRadius: "50%",
            background: "rgba(200,169,110,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <path d="M6 4l12 6-12 6V4z" />
            </svg>
          </div>
        )}
      </div>
      {/* Mute toggle */}
      <button
        onClick={(e) => { e.stopPropagation(); setMuted(!muted); if (videoRef.current) videoRef.current.muted = !muted; }}
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          background: "rgba(26,22,18,0.6)",
          border: "none",
          color: "white",
          padding: "0.35rem 0.75rem",
          fontSize: "0.75rem",
          cursor: "pointer",
          fontFamily: "var(--font-caption)",
          letterSpacing: "0.05em",
        }}
      >
        {muted ? "🔇 השתק" : "🔊 קול"}
      </button>
      {caption && (
        <p style={{
          padding: "0.75rem 1rem",
          background: "var(--parchment)",
          fontSize: "0.8rem",
          color: "var(--ash)",
          fontFamily: "var(--font-caption)",
        }}>
          {caption}
        </p>
      )}
    </div>
  );
}
