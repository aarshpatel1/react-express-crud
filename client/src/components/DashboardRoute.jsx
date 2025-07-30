import jwtDecode from "jwt-decode";
import Dashboard from "../pages/Dashboard";
import Carousal from "./Carousal";

const isAuthenticated = () => {
	const token = localStorage.getItem("token");
	if (!token) return false;

	try {
		const { exp } = jwtDecode(token);
		return Date.now() < exp * 1000;
	} catch (err) {
		return false;
	}
};

const DashboardRoute = () => {
	return isAuthenticated() ? <Dashboard /> : <Carousal />;
};

export default DashboardRoute;
