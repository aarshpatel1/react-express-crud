import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../Authenticate";
import { useEffect } from "react";

/**
 * Protected route component that redirects to login if not authenticated
 * @param {object} props - Component props
 * @param {React.Component} props.component - Component to render if authenticated
 * @returns {React.Component} - Protected component or redirect
 */
const ProtectedRoute = ({ component: Component }) => {
	const location = useLocation();
	const authenticated = isAuthenticated();

	// Check authentication
	if (!authenticated) {
		// Redirect to home page with return URL
		return <Navigate to="/" state={{ from: location.pathname }} replace />;
	}

	// If authenticated, render the component
	return <Component />;
};

export default ProtectedRoute;
