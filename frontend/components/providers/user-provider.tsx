// "use client";

// import React, { createContext, useContext, useState } from "react";

// interface User {
//   id: string; // Adjust based on your actual user object
//   email: string;
//   name: string;
//   role: string;
//   [key: string]: any; // Allow for other properties
// }

// interface UserContextType {
//   user: User | null;
//   token: string | null;
//   login: (userData: User, token: string) => void;
//   logout: () => void;
//   isLoading: boolean;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export function UserProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(() => {
//     if (typeof window === "undefined") return null;
//     try {
//       const storedUser = localStorage.getItem("user");
//       return storedUser ? JSON.parse(storedUser) : null;
//     } catch (error) {
//       console.error("Failed to parse user data from local storage", error);
//       return null;
//     }
//   });

//   const [token, setToken] = useState<string | null>(() => {
//     if (typeof window === "undefined") return null;
//     return localStorage.getItem("token");
//   });

//   const isLoading = false;

//   const login = (userData: User, authToken: string) => {
//     setUser(userData);
//     setToken(authToken);
//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("token", authToken);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     // Optional: Redirect to login or handle session cleanup
//   };

//   return (
//     <UserContext.Provider value={{ user, token, login, logout, isLoading }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser() {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// }
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  permissions?: string[];
  verified?: string;
}

export interface Organization {
  id: string;
  name: string;
}

interface TUserStoreState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  organization: Organization | null;
  jobRole: string | null;
  employeeId: string | null;
  practitionerId: string | null;
}

export interface UserStoreActions {
  setUser: (user: User) => void;
  setTokens: (token: string, refreshToken: string) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  setOrganization: (organization: Organization) => void;
  clearOrganization: () => void;
  setJobRole: (jobRole: string) => void;
  clearJobRole: () => void;
  setEmployeeId: (employeeId: string) => void;
  clearEmployeeId: () => void;
  setPractitionerId: (practitionerId: string) => void;
  clearPractitionerId: () => void;
}

export type UserStore = TUserStoreState & { actions: UserStoreActions };
