// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

// Storage utility functions
export const storage = {
  get: (key: keyof typeof STORAGE_KEYS): string | null => {
    return localStorage.getItem(STORAGE_KEYS[key]);
  },
  
  set: (key: keyof typeof STORAGE_KEYS, value: string): void => {
    localStorage.setItem(STORAGE_KEYS[key], value);
  },
  
  remove: (key: keyof typeof STORAGE_KEYS): void => {
    localStorage.removeItem(STORAGE_KEYS[key]);
  },
  
  clear: (): void => {
    localStorage.clear();
  }
}; 