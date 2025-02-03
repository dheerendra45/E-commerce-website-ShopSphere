import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,

  login: (userData) => {
    // Assuming userData contains email, name, and other user info
    localStorage.setItem('user', JSON.stringify(userData));  // Store full user data
    set({ user: userData });  // Set user in Zustand store
  },

  logout: () => {
    localStorage.removeItem('user');  // Remove user data from localStorage
    set({ user: null });  // Clear user from Zustand store
  },
}));

export default useAuthStore;
