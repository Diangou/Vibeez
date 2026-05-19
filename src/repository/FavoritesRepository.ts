export interface Artist {
  id: string;
  name: string;
  image: string;
  listeners: string;
}

export interface IFavoritesRepository {
  getAll(): Artist[];
  findById(id: string): Artist | null;
  save(artist: Artist): Artist;
  remove(id: string): void;
  exists(id: string): boolean;
}

export class LocalFavoritesRepository implements IFavoritesRepository {
  private readonly storageKey = 'vibeez_favorites';

  private readAll(): Artist[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is Artist =>
            item && typeof item.id === 'string' && typeof item.name === 'string' &&
            typeof item.image === 'string' && typeof item.listeners === 'string',
        );
      }
    } catch {
      // Ignorer si le contenu du storage n'est pas un JSON valide
    }

    return [];
  }

  private writeAll(favorites: Artist[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

  getAll(): Artist[] {
    return this.readAll();
  }

  findById(id: string): Artist | null {
    return this.readAll().find(artist => artist.id === id) || null;
  }

  save(artist: Artist): Artist {
    const favorites = this.readAll();
    const existingIndex = favorites.findIndex(item => item.id === artist.id);

    if (existingIndex >= 0) {
      favorites[existingIndex] = artist;
    } else {
      favorites.push(artist);
    }

    this.writeAll(favorites);
    return artist;
  }

  remove(id: string): void {
    const favorites = this.readAll().filter(artist => artist.id !== id);
    this.writeAll(favorites);
  }

  exists(id: string): boolean {
    return this.readAll().some(artist => artist.id === id);
  }
}
