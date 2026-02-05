import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    role: localStorage.getItem('role') || null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { token, data } = response.data;
            const { user } = data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);

            set({
                user: user,
                token: token,
                isAuthenticated: true,
                role: user.role,
                loading: false
            });
            return true;
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || 'Login failed'
            });
            return false;
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            const { token, data } = response.data;
            const { user } = data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);

            set({
                user: user,
                token: token,
                isAuthenticated: true,
                role: user.role,
                loading: false
            });
            return true;
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || 'Registration failed'
            });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            role: null
        });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({
                user: response.data.data.user,
                isAuthenticated: true,
                role: response.data.data.user.role
            });
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            set({ user: null, token: null, isAuthenticated: false, role: null });
        }
    }
}));

export default useAuthStore;
