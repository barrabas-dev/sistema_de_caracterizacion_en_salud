import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  user: localStorage.getItem('accessToken') ? jwtDecode(localStorage.getItem('accessToken')) : null,
  isAuthenticated: !!localStorage.getItem('accessToken'),

  setAuth: (access, refresh) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    set({
      accessToken: access,
      refreshToken: refresh,
      user: jwtDecode(access),
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
