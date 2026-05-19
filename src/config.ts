/**
 * AppConfig Singleton
 * Gère toutes les constantes de configuration de l'application
 * Garantit qu'une seule instance existe dans toute l'application
 */

class AppConfig {
  private static instance: AppConfig;

  readonly apiBaseUrl = 'https://ws.audioscrobbler.com/2.0/';
  readonly apiKey = import.meta.env.VITE_LASTFM_API_KEY || '';
  readonly pageSize = 20;
  readonly defaultTimeout = 10000; // ms
  readonly cacheExpiration = 3600000; // 1 hour in ms


  private constructor() {
    if (!this.apiKey) {
      console.warn('Warning: VITE_LASTFM_API_KEY is not configured');
    }
  }


  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }
}

export default AppConfig.getInstance();
