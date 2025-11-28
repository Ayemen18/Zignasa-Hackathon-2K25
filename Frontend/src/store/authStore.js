import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: !!localStorage.getItem("token"), // Check if token exists on load
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,

  // Log the user in
  login: (userData, token) => {
    // 1. Save to Local Storage (Persist)
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // 2. Update State
    set({
      isAuthenticated: true,
      user: userData,
    });
  },

  // Log the user out
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      isAuthenticated: false,
      user: null,
    });
  },
}));

export default useAuthStore;
