import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

export function FavoritesPage() {
  const { favorites = [], removeFavorite } = useFavorites();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Favorites</h1>

      {favorites.length === 0 ? (
        <div>
          <p>No favorites yet.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-3 px-3 py-1 bg-gray-800 text-white rounded"
          >
            Go explore
          </button>
        </div>
      ) : (
        <ul>
          {favorites.map((artist: any) => (
            <li key={artist.id} className="flex items-center justify-between py-2 border-b border-white/10">
              <div className="truncate">{artist.name}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => removeFavorite(artist.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FavoritesPage;
