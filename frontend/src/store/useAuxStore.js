import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/aux';

const useAuxStore = create((set, get) => ({
    announcements: [],
    lostItems: [],
    loading: false,
    error: null,

    fetchAnnouncements: async () => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/announcements`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ announcements: response.data.data.announcements, loading: false });
        } catch (err) {
            set({ loading: false, error: 'Failed to fetch announcements' });
        }
    },

    createAnnouncement: async (data) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/announcements`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ loading: false });
            get().fetchAnnouncements();
            return true;
        } catch (err) {
            set({ loading: false, error: 'Failed to create announcement' });
            return false;
        }
    },

    fetchLostItems: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/lost-found`, {
                headers: { Authorization: `Bearer ${token}` },
                params: filters
            });
            set({ lostItems: response.data.data.items, loading: false });
        } catch (err) {
            set({ loading: false, error: 'Failed to fetch items' });
        }
    },

    reportLostItem: async (formData) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/lost-found`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            set({ loading: false });
            get().fetchLostItems();
            return true;
        } catch (err) {
            set({ loading: false, error: 'Failed to report item' });
            return false;
        }
    },

    claimItem: async (id) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/lost-found/${id}/claim`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ loading: false });
            get().fetchLostItems();
            return true;
        } catch (err) {
            set({ loading: false, error: 'Failed to claim item' });
            return false;
        }
    }
}));

export default useAuxStore;
