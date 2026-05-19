export interface Artist {
  id: string;
  name: string;
  image: string;
  listeners: string;
}

export interface FilterStrategy {
// Méthode à implémenter pour filtrer/ordonner les artistes
  filter(artists: Artist[]): Artist[];
}

export class ByNameStrategy implements FilterStrategy {
  filter(artists: Artist[]): Artist[] {
    // On retourne une copie triée par ordre alphabétique du nom
    return [...artists].sort((a, b) => a.name.localeCompare(b.name));
  }
}

// Stratégie pour trier selon le critère choisi : populaire (par défaut) ou aléatoire
export class BySortStrategy implements FilterStrategy {
// On stocke le type de tri ('popular' ou 'random')
  private sortBy: 'popular' | 'random';

// Le constructeur nous permet de choisir le type de tri
  constructor(sortBy: 'popular' | 'random') {
    this.sortBy = sortBy;
  }

  filter(artists: Artist[]): Artist[] {
    // Si on veut un tri aléatoire, on mélange le tableau
    if (this.sortBy === 'random') {
      return [...artists].sort(() => Math.random() - 0.5);
    }
    // Sinon, on retourne la liste telle quelle (en mode populaire)
    return artists;
  }
}