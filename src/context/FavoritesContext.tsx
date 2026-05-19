import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Artist } from '../repository/FavoritesRepository';
import { LocalFavoritesRepository } from '../repository/FavoritesRepository';
import { eventBus } from '../observer/EventBus';

interface FavoritesContextValue {
  favorites: Artist[];
  addFavorite(artist: Artist): void;
  removeFavorite(id: string): void;
  isFavorite(id: string): boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

const repoInstance = new LocalFavoritesRepository();

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const repoRef = useRef<LocalFavoritesRepository>(repoInstance);
  const [favorites, setFavorites] = useState<Artist[]>([]);

  useEffect(() => {
    setFavorites(repoRef.current.getAll());
  }, []);

  const addFavorite = (artist: Artist) => {
    repoRef.current.save(artist);
    setFavorites(repoRef.current.getAll());
    eventBus.emit('favorite:added', { artistName: artist.name });
  };

  const removeFavorite = (id: string) => {
    const existing = repoRef.current.findById(id);
    repoRef.current.remove(id);
    setFavorites(repoRef.current.getAll());
    if (existing) {
      eventBus.emit('favorite:removed', { artistName: existing.name });
    }
  };

  const isFavorite = (id: string) => repoRef.current.exists(id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
