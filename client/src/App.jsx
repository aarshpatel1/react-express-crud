import "primeflex/primeflex.css";
import RegisterUser from "./components/RegisterUser";
import DisplayUser from "./components/DisplayUser";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Carousal from "./components/Carousal";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

function App() {
	return (
		<>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path="/" element={<Carousal />} />
					{/* Use ProtectedRoute for authenticated routes */}
					<Route
						path="/registerUser"
						element={<ProtectedRoute component={RegisterUser} />}
					/>
					<Route
						path="/dashboard"
						element={<ProtectedRoute component={DisplayUser} />}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
