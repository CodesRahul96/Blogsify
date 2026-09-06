import { useState } from "react";
import { FiPlay, FiAlertCircle } from "react-icons/fi";

export const parseVideoUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();

  // YouTube match: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      id: ytMatch[1],
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
    };
  }

  // Vimeo match: vimeo.com/ID or player.vimeo.com/video/ID
  const vimeoMatch = trimmed.match(
    /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      id: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  // Direct HTML5 video file (.mp4, .webm, .ogg, .mov)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    return {
      type: "direct",
      embedUrl: trimmed,
    };
  }

  // Fallback
  return {
    type: "unknown",
    embedUrl: trimmed,
  };
};

const VideoPlayer = ({ videoUrl, poster, title = "Video playback", autoLoad = false, className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(autoLoad);
  const [loadError, setLoadError] = useState(false);

  const parsed = parseVideoUrl(videoUrl);

  if (!parsed || !videoUrl) return null;

  // Render HTML5 direct video player
  if (parsed.type === "direct") {
    return (
      <div
        className={`relative w-full aspect-video rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm ${className}`}
      >
        <video
          src={parsed.embedUrl}
          poster={poster}
          controls
          autoPlay={isPlaying}
          className="w-full h-full object-contain bg-black"
          onError={() => setLoadError(true)}
        >
          Your browser does not support HTML5 video playback.
        </video>
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 text-zinc-400 text-xs p-4 text-center">
            <FiAlertCircle className="mr-2 text-rose-500" size={16} />
            Unable to stream direct video file.
          </div>
        )}
      </div>
    );
  }

  // Embeddable YouTube / Vimeo / Iframe
  return (
    <div
      className={`relative w-full aspect-video rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm ${className}`}
    >
      {isPlaying ? (
        <iframe
          src={parsed.embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      ) : (
        <div
          onClick={() => setIsPlaying(true)}
          className="group relative w-full h-full cursor-pointer flex items-center justify-center bg-zinc-900"
        >
          {poster && (
            <img
              src={poster}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
            />
          )}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

          {/* Glowing Play Trigger Button */}
          <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-zinc-950 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all duration-300">
            <FiPlay size={26} className="ml-1 text-zinc-950 fill-zinc-950" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white/90 font-medium">
            <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              Click to Play Dispatch Video
            </span>
            <span className="bg-blue-600/90 text-white px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider">
              {parsed.type}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
