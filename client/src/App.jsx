import "primeflex/primeflex.css";
import RegisterUser from "./components/RegisterUser";
import DisplayUser from "./components/DisplayUser";
import Navbar from "./components/Navbar";

function App() {
	return (
		<>
			<Navbar />
			<RegisterUser />
			<DisplayUser />
		</>
	);
}

export default App;
