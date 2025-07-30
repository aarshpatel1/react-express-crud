import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Create axios instance with default config
const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		// Handle 401 Unauthorized errors
		if (error.response && error.response.status === 401) {
			// Clear token and redirect to login
			localStorage.removeItem("token");
			// We'll handle navigation in the components
		}
		return Promise.reject(error);
	}
);

// Auth API
export const authAPI = {
	login: (credentials) => api.post("/admin/login", credentials),
	signup: (userData) => api.post("/admin/signup", userData),
};

// User API
export const userAPI = {
	getAll: () => api.get("/user/getAllUsers"),
	getById: (id) => api.get(`/user/${id}`),
	create: (userData) => api.post("/user/addUser", userData),
	update: (id, userData) => api.put(`/user/updateUser/${id}`, userData),
	delete: (id) => api.delete(`/user/deleteUser/${id}`),
};

export default api;
