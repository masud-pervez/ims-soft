export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions?: Record<string, unknown>; // Backend sends specific permissions structure
  [key: string]: unknown;
}

export interface UserStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  actions: UserStoreActions;
}

export interface UserStoreActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  setHasHydrated: (state: boolean) => void;
}
