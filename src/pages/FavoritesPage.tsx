import { useState } from 'react';
import { Heart, Play, Music2, TrendingUp } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { YouTubePlayerBar } from '../components/YouTubePlayerBar';
import type { Artist } from '../repository/FavoritesRepository';

interface FavoritesPageProps {
  onGoExplore: () => void;
}

type SortOption = 'popular' | 'a-z' | 'random';

export function FavoritesPage({ onGoExplore }: FavoritesPageProps) {
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [playingArtist, setPlayingArtist] = useState<Artist | null>(null);
  const { favorites, removeFavorite, isFavorite } = useFavorites();

  const handleToggleFavorite = (artist: Artist) => {
    removeFavorite(artist.id);
    if (playingArtist?.id === artist.id) {
      setPlayingArtist(null);
    }
  };

  const getSortedFavorites = () => {
    const sorted = [...favorites];

    if (sortBy === 'a-z') {
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'random') {
      return sorted.sort(() => Math.random() - 0.5);
    }
    return sorted;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-8 py-16">
        <div className="mb-12">
          <h1 className="text-6xl font-bold mb-4 flex items-center gap-4">
            My Favorites
            <Heart size={56} className="text-red-500" fill="currentColor" />
          </h1>
          <p className="text-xl text-white/60 mb-8">Your saved artists, sorted your way</p>

          {favorites.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setSortBy('popular')}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  sortBy === 'popular'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <TrendingUp size={18} />
                Popular
              </button>
              <button
                type="button"
                onClick={() => setSortBy('a-z')}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  sortBy === 'a-z'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                A→Z
              </button>
              <button
                type="button"
                onClick={() => setSortBy('random')}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  sortBy === 'random'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                🎲 Random
              </button>
            </div>
          )}
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-4 gap-6">
            {getSortedFavorites().map(artist => (
              <div key={artist.id} className="group relative">
                <div className="relative overflow-hidden rounded-xl aspect-square bg-white/5 mb-3">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <button
                    type="button"
                    onClick={() => setPlayingArtist(artist)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(artist);
                    }}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-red-500 text-white shadow-lg shadow-red-500/50 hover:bg-red-600 backdrop-blur-sm transition-all"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>

                <div className="px-1">
                  <h4 className="font-bold text-lg mb-1 truncate">{artist.name}</h4>
                  <p className="text-white/50 text-sm">{artist.listeners} listeners</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-8 backdrop-blur-sm">
              <Music2 size={80} className="text-white/40" />
            </div>
            <h2 className="text-4xl font-bold mb-3">Nothing here yet.</h2>
            <p className="text-xl text-white/60 mb-10 max-w-md">
              Go explore some moods and save artists you love
            </p>
            <button
              type="button"
              onClick={onGoExplore}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 hover:scale-105"
            >
              Explore Moods →
            </button>
          </div>
        )}
      </div>

      {playingArtist && (
        <YouTubePlayerBar
          artist={playingArtist}
          accentColor="#ab20fd"
          onClose={() => setPlayingArtist(null)}
          onToggleFavorite={() => handleToggleFavorite(playingArtist)}
          isFavorite={isFavorite(playingArtist.id)}
        />
      )}
    </div>
  );
}

export default FavoritesPage;
