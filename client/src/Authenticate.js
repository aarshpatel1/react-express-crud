import { jwtDecode } from "jwt-decode"; // Make sure the import is correct

/**
 * Checks if user is authenticated by validating JWT token
 * @returns {boolean} - True if user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
	const token = localStorage.getItem("token");
	if (!token) return false;

	try {
		// Decode the token and check if it's expired
		const decoded = jwtDecode(token);

		// Check if the token has expiration and is still valid
		if (decoded.exp) {
			return Date.now() < decoded.exp * 1000;
		}

		// If no expiration claim, assume token is invalid
		return false;
	} catch (err) {
		// If token is invalid or can't be decoded, remove it
		localStorage.removeItem("token");
		return false;
	}
};

/**
 * Gets the current user data from token
 * @returns {object|null} - User data or null if not authenticated
 */
export const getCurrentUser = () => {
	try {
		const token = localStorage.getItem("token");
		if (!token) return null;

		const decoded = jwtDecode(token);

		// Return the admin data from the decoded token
		return decoded.adminData || null;
	} catch (err) {
		return null;
	}
};

/**
 * Logout user by removing token
 */
export const logout = () => {
	localStorage.removeItem("token");
	// Redirect can be handled by the component that calls this function
};
