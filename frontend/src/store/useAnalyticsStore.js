import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/analytics';

const useAnalyticsStore = create((set) => ({
    stats: null,
    loading: false,
    error: null,

    fetchStats: async () => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ stats: response.data.data.stats, loading: false });
        } catch (err) {
            set({ loading: false, error: 'Failed to fetch analytics' });
        }
    }
}));

export default useAnalyticsStore;
