import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,

  // Log the user in
  login: (userData) =>
    set({
      isAuthenticated: true,
      user: userData,
    }),

  // Log the user out
  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
    }),
}));

export default useAuthStore;
