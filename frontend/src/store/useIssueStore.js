import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/issues';
const USER_API_URL = 'http://localhost:5000/api/users';

const useIssueStore = create((set, get) => ({
    issues: [],
    currentIssue: null,
    staffMembers: [],
    loading: false,
    error: null,

    fetchIssues: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
                params: filters
            });
            set({ issues: response.data.data.issues, loading: false });
        } catch (err) {
            set({ loading: false, error: err.response?.data?.message || 'Failed to fetch issues' });
        }
    },

    fetchIssue: async (id) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ currentIssue: response.data.data.issue, loading: false });
        } catch (err) {
            set({ loading: false, error: err.response?.data?.message || 'Failed to fetch issue details', currentIssue: null });
        }
    },

    reportIssue: async (formData) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            await axios.post(API_URL, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            set({ loading: false });
            get().fetchIssues();
            return true;
        } catch (err) {
            set({ loading: false, error: err.response?.data?.message || 'Failed to report issue' });
            return false;
        }
    },

    updateIssueStatus: async (id, status, remark) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/${id}/status`, { status, remark }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ loading: false });
            get().fetchIssue(id); // Refresh detail view
            return true;
        } catch (err) {
            set({ loading: false, error: err.response?.data?.message || 'Failed to update status' });
            return false;
        }
    },

    assignIssue: async (id, assigneeId) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/${id}/assign`, { assigneeId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ loading: false });
            get().fetchIssue(id); // Refresh detail view
            return true;
        } catch (err) {
            set({ loading: false, error: err.response?.data?.message || 'Failed to assign issue' });
            return false;
        }
    },

    fetchStaff: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${USER_API_URL}/staff`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ staffMembers: response.data.data.users });
        } catch (err) {
            console.error("Failed to fetch staff", err);
        }
    }
}));

export default useIssueStore;
