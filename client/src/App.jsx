import "primeflex/primeflex.css";
import RegisterUser from "./components/RegisterUser";
import DisplayUser from "./components/DisplayUser";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Carousal from "./components/Carousal";

function App() {
	return (
		<>
			<Navbar />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Carousal />} />
					<Route path="/registerUser" element={<RegisterUser />} />
					<Route path="/dashboard" element={<DisplayUser />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
