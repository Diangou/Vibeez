import { Music2, Heart } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-black/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Music2 size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold">Vibeez</span>
        </div>

        <nav className="flex items-center gap-8">
          <button className="text-white/80 hover:text-white transition-colors">
            Explore
          </button>
          <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <Heart size={18} />
            My Favorites
          </button>
        </nav>
      </div>
    </header>
  );
}
