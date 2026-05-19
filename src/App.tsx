import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { YouTubePlayerBar } from './components/YouTubePlayerBar';
import { Toast } from './components/Toast';
import { Heart, Play, TrendingUp } from 'lucide-react';
import config from './config';
import './index.css';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
}

interface Artist {
  id: string;
  name: string;
  image: string;
  listeners: string;
}

const moods: Mood[] = [
  { id: 'chill', name: 'Chill', emoji: '🌊', gradient: 'from-[#1a1a4e] to-[#0d7377]' },
  { id: 'energetic', name: 'Energetic', emoji: '⚡', gradient: 'from-[#ff4e00] to-[#ec9f05]' },
  { id: 'sad', name: 'Sad', emoji: '🌧️', gradient: 'from-[#2c2c54] to-[#474787]' },
  { id: 'focus', name: 'Focus', emoji: '🎯', gradient: 'from-[#0f3460] to-[#16213e]' },
  { id: 'romantic', name: 'Romantic', emoji: '💜', gradient: 'from-[#6a0572] to-[#ab20fd]' },
  { id: 'hype', name: 'Hype', emoji: '🔥', gradient: 'from-[#f7971e] to-[#ffd200]' },
];

const moodAccentColors: Record<string, string> = {
  chill: '#0d7377',
  energetic: '#ec9f05',
  sad: '#474787',
  focus: '#16213e',
  romantic: '#ab20fd',
  hype: '#ffd200',
};

type SortOption = 'popular' | 'a-z' | 'random';

function App() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [playingArtist, setPlayingArtist] = useState<Artist | null>(null);
  const [toast, setToast] = useState<{ message: string; icon?: string } | null>(null);
  const [favorites, setFavorites] = useState<Artist[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(false);
  const [loadedArtists, setLoadedArtists] = useState<Record<string, Artist[]>>({});

  /**
   * Récupère les artistes depuis l'API Last.fm pour un mood donné
   */
  const fetchArtistsForMood = async (moodName: string) => {
    if (loadedArtists[moodName]) {
      return; // Données en cache
    }

    setLoadingArtists(true);
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), config.defaultTimeout);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}?method=tag.getTopArtists&tag=${encodeURIComponent(moodName.toLowerCase())}&api_key=${config.apiKey}&limit=${config.pageSize}&format=json`,
        { signal: abortController.signal }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const artists: Artist[] = (data.topartists?.artist || []).map((artist: any) => ({
        id: artist.name.toLowerCase().replace(/\s+/g, '-'),
        name: artist.name,
        image: artist.image?.[3]?.['#text'] || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
        listeners: parseInt(artist.listeners).toLocaleString(),
      }));

      setLoadedArtists(prev => ({ ...prev, [moodName]: artists }));
      setToast({ message: `${artists.length} artists loaded for ${moodName}`, icon: '🎵' });
    } catch (error) {
      console.error('Error fetching artists:', error);
      setToast({ message: 'Failed to load artists. Please check your API key.', icon: '❌' });
      // Pas de fallback - les données viennent uniquement de l'API
      setLoadedArtists(prev => ({ ...prev, [moodName]: [] }));
    } finally {
      clearTimeout(timeoutId);
      setLoadingArtists(false);
    }
  };

  /**
   * Charge les artistes quand un mood est sélectionné
   */
  useEffect(() => {
    if (selectedMood) {
      const mood = moods.find(m => m.id === selectedMood);
      if (mood) {
        fetchArtistsForMood(mood.id);
      }
    }
  }, [selectedMood]);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    const mood = moods.find(m => m.id === moodId);
    setToast({ message: `Mood changed to ${mood?.name}`, icon: mood?.emoji });
  };

  const handleAddFavorite = (artist: Artist) => {
    const isFavorited = favorites.some(a => a.id === artist.id);
    if (!isFavorited) {
      setFavorites([...favorites, artist]);
      setToast({ message: `${artist.name} added to favorites`, icon: '💜' });
    } else {
      setFavorites(favorites.filter(a => a.id !== artist.id));
      setToast({ message: `${artist.name} removed from favorites`, icon: '🗑️' });
    }
  };

  const isFavorite = (artistId: string) => {
    return favorites.some(a => a.id === artistId);
  };

  const getSortedArtists = () => {
    if (!selectedMood) return [];
    
    // Utilise uniquement les artistes chargés depuis l'API
    const artists = [...(loadedArtists[selectedMood] || [])];

    if (sortBy === 'a-z') {
      return artists.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'random') {
      return artists.sort(() => Math.random() - 0.5);
    }
    return artists;
  };

  const selectedMoodData = moods.find(m => m.id === selectedMood);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <Header />

      {/* Hero Section */}
      <div
        className={`relative w-full py-24 transition-all duration-700 ${
          selectedMood
            ? `bg-gradient-to-br ${moods.find(m => m.id === selectedMood)?.gradient}`
            : 'bg-gradient-to-br from-purple-900/20 to-pink-900/20'
        }`}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="container mx-auto px-8 text-center relative z-10">
          <h1 className="text-6xl font-bold mb-4">How are you feeling today?</h1>
          <p className="text-xl text-white/80">Pick a mood, we find your artists</p>
        </div>
      </div>

      {/* Mood Grid */}
      <div className="container mx-auto px-8 py-16 max-w-[1100px]">
        <div className="grid grid-cols-3 gap-6 mb-16">
          {moods.map(mood => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={`group relative overflow-hidden rounded-2xl aspect-[4/3] bg-gradient-to-br ${mood.gradient} transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                selectedMood === mood.id ? 'scale-105' : ''
              }`}
              style={{
                boxShadow: selectedMood === mood.id ? `0 0 0 4px ${moodAccentColors[mood.id]}, 0 0 0 8px #0a0a0a` : undefined,
              }}
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-50"></div>
              <div className="relative z-10 h-full flex flex-col items-center justify-center gap-4 p-8">
                <div className="text-7xl group-hover:scale-110 transition-transform duration-300">
                  {mood.emoji}
                </div>
                <h3 className="text-3xl font-bold">{mood.name}</h3>
              </div>
            </button>
          ))}
        </div>

        {/* Artist Results */}
        {selectedMood && selectedMoodData && (
          <div className="bg-white/5 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold flex items-center gap-3">
                <span>Top artists for {selectedMoodData.name}</span>
                <span className="text-5xl">{selectedMoodData.emoji}</span>
              </h2>
              {loadingArtists ? (
                <div className="text-white/60 text-sm">Loading artists...</div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('popular')}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                      sortBy === 'popular'
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <TrendingUp size={16} />
                    Popular
                  </button>
                  <button
                    onClick={() => setSortBy('a-z')}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      sortBy === 'a-z'
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    A→Z
                  </button>
                  <button
                    onClick={() => setSortBy('random')}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
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

            <div className="grid grid-cols-4 gap-6">
              {loadingArtists ? (
                <div className="col-span-4 text-center py-12">
                  <div className="inline-block">
                    <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
                  </div>
                </div>
              ) : (
                getSortedArtists().map(artist => (
                <div key={artist.id} className="group relative">
                  <div className="relative overflow-hidden rounded-xl aspect-square bg-white/5 mb-3">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Play Button Overlay */}
                    <button
                      onClick={() => setPlayingArtist(artist)}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                        <Play size={24} fill="currentColor" />
                      </div>
                    </button>

                    {/* Heart Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddFavorite(artist);
                      }}
                      className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-sm transition-all ${
                        isFavorite(artist.id)
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                          : 'bg-black/40 text-white/80 hover:bg-black/60'
                      }`}
                    >
                      <Heart size={18} fill={isFavorite(artist.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className="px-1">
                    <h4 className="font-bold text-lg mb-1 truncate">{artist.name}</h4>
                    <p className="text-white/50 text-sm">{artist.listeners} listeners</p>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* YouTube Player Bar */}
      {playingArtist && selectedMood && (
        <YouTubePlayerBar
          artist={playingArtist}
          accentColor={moodAccentColors[selectedMood]}
          onClose={() => setPlayingArtist(null)}
          onToggleFavorite={() => handleAddFavorite(playingArtist)}
          isFavorite={isFavorite(playingArtist.id)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          icon={toast.icon}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
