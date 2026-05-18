import { Heart, X, Play, Pause } from 'lucide-react';
import { useState } from 'react';

interface Artist {
  id: string;
  name: string;
  image: string;
  listeners: string;
}

interface YouTubePlayerBarProps {
  artist: Artist;
  accentColor: string;
  onClose: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

export function YouTubePlayerBar({
  artist,
  accentColor,
  onClose,
  onToggleFavorite,
  isFavorite
}: YouTubePlayerBarProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r border-t border-white/10 px-8 py-4"
      style={{
        background: `linear-gradient(to right, ${accentColor}20, ${accentColor}40)`,
        borderColor: `${accentColor}40`
      }}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-bold text-white">{artist.name}</h4>
            <p className="text-white/60 text-sm">{artist.listeners} listeners</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            {isPlaying ? (
              <Pause size={20} className="text-white" fill="white" />
            ) : (
              <Play size={20} className="text-white" fill="white" />
            )}
          </button>

          <button
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-full transition-all ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
