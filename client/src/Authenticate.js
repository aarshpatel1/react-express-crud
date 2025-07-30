import jwtDecode from "jwt-decode.js";

export const isAuthenticated = () => {
	const token = localStorage.getItem("token");
	if (!token) return false;

	try {
		const { exp } = jwtDecode(token);
		return Date.now() < exp * 1000;
	} catch (err) {
		return false;
	}
};
