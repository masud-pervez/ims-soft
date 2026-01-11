export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions?: string[];
  [key: string]: unknown;
}

export interface UserStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  organization: string | null;
  jobRole: string | null;
  employeeId: string | null;
  practitionerId: string | null;
  _hasHydrated: boolean;
  actions: UserStoreActions;
}

export interface UserStoreActions {
  setOrganization: (organization: string) => void;
  clearOrganization: () => void;
  setJobRole: (jobRole: string) => void;
  clearJobRole: () => void;
  setEmployeeId: (employeeId: string) => void;
  clearEmployeeId: () => void;
  setPractitionerId: (practitionerId: string) => void;
  clearPractitionerId: () => void;
  setUser: (user: User) => void;
  setTokens: (token: string, refreshToken: string | null) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  setHasHydrated: (state: boolean) => void;
}
