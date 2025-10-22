import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },
      
      updateUser: (userData) => {
        set((state) => ({ user: { ...state.user, ...userData } }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
