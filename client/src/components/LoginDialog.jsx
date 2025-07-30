import { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast"; // Add Toast for notifications
import { useRef } from "react"; // Add useRef for Toast
import axios from "axios"; // Use axios directly
import { useNavigate } from "react-router-dom";

export default function LoginDialog() {
	const [visible, setVisible] = useState(false);
	const [credentials, setCredentials] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false); // Add loading state
	const [formErrors, setFormErrors] = useState({}); // Add form validation
	const toast = useRef(null); // Add toast reference
	const navigate = useNavigate();

	// Form validation function
	const validateForm = () => {
		const errors = {};
		if (!credentials.email?.trim()) {
			errors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
			errors.email = "Email is invalid";
		}

		if (!credentials.password?.trim()) {
			errors.password = "Password is required";
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleOnChange = (e) => {
		const { name, value } = e.target;
		setCredentials({ ...credentials, [name]: value });

		// Clear error when user types
		if (formErrors[name]) {
			setFormErrors({ ...formErrors, [name]: null });
		}
	};

	const handleOnSubmit = async (e) => {
		e.preventDefault(); // Prevent form submission

		// Validate form
		if (!validateForm()) {
			return;
		}

		setLoading(true);
		try {
			// Make API request to login
			const response = await axios.post(
				"http://127.0.0.1:8000/api/admin/loginAdmin",
				credentials
			);

			// Check if response contains token
			if (response.data && response.data.token) {
				// Store token in localStorage
				localStorage.setItem("token", response.data.token);

				// Show success message
				toast.current.show({
					severity: "success",
					summary: "Login Successful",
					detail: "Welcome back!",
					life: 3000,
				});

				// Close dialog
				setVisible(false);

				// Navigate to dashboard
				navigate("/dashboard");
			} else {
				toast.current.show({
					severity: "error",
					summary: "Login Failed",
					detail: "Invalid response from server",
					life: 3000,
				});
			}
		} catch (error) {
			console.error("Login error:", error);

			// Show appropriate error message based on response
			let errorMessage = "Login failed. Please try again.";

			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				if (error.response.status === 401) {
					errorMessage = "Invalid email or password";
				} else if (error.response.status === 404) {
					errorMessage = "Account not found";
				} else if (error.response.status === 403) {
					errorMessage = "Account is inactive";
				} else if (error.response.data && error.response.data.message) {
					errorMessage = error.response.data.message;
				}
			} else if (error.request) {
				// The request was made but no response was received
				errorMessage =
					"No response from server. Check your connection.";
			}

			toast.current.show({
				severity: "error",
				summary: "Login Failed",
				detail: errorMessage,
				life: 5000,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="card flex justify-content-center">
			<Toast ref={toast} position="bottom-right" />
			<Button
				label="Login"
				icon="pi pi-user"
				onClick={() => setVisible(true)}
			/>
			<Dialog
				className="border-round-xl"
				visible={visible}
				modal
				onHide={() => {
					if (!visible) return;
					setVisible(false);
					// Reset form when dialog is closed
					setCredentials({ email: "", password: "" });
					setFormErrors({});
				}}
				content={({ hide }) => (
					<form
						className="flex flex-column px-6 py-3 gap-4 border-round-xl shadow-8"
						style={{
							backdropFilter: "blur(50px)",
						}}
						onSubmit={handleOnSubmit}
					>
						<h2 className="text-3xl mb-0 text-center">Login</h2>
						<div className="inline-flex flex-column gap-2">
							<label
								htmlFor="email"
								className="text-primary-50 font-semibold"
							>
								Email
							</label>
							<InputText
								id="email"
								name="email" // Add name attribute
								label="Email"
								type="email"
								className={`bg-white-alpha-20 border-none p-3 text-primary-50 ${
									formErrors.email ? "p-invalid" : ""
								}`}
								value={credentials.email || ""}
								onChange={handleOnChange}
							/>
							{formErrors.email && (
								<small className="p-error">
									{formErrors.email}
								</small>
							)}
						</div>
						<div className="inline-flex flex-column gap-2">
							<label
								htmlFor="password"
								className="text-primary-50 font-semibold"
							>
								Password
							</label>
							<InputText
								id="password"
								name="password" // Add name attribute
								label="Password"
								className={`bg-white-alpha-20 border-none p-3 text-primary-50 ${
									formErrors.password ? "p-invalid" : ""
								}`}
								type="password"
								value={credentials.password || ""}
								onChange={handleOnChange}
							/>
							{formErrors.password && (
								<small className="p-error">
									{formErrors.password}
								</small>
							)}
						</div>
						<div className="flex align-items-center gap-4 mb-4">
							<Button
								label="Sign-In"
								type="submit" // Change to submit button
								text
								className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
								loading={loading} // Add loading state
							/>
							<Button
								label="Cancel"
								onClick={(e) => hide(e)}
								text
								className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
								disabled={loading} // Disable during loading
							/>
						</div>
					</form>
				)}
			/>
		</div>
	);
}
