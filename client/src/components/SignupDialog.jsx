import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignupDialog() {
	// State management
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [userData, setUserData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});

	// References and hooks
	const toast = useRef(null);
	const navigate = useNavigate();

	// Handle input changes
	const handleInputChange = (e) => {
		const { id, value } = e.target;
		setUserData({ ...userData, [id]: value });

		// Clear error when user types
		if (errors[id]) {
			setErrors({ ...errors, [id]: null });
		}
	};

	// Form validation
	const validateForm = () => {
		const newErrors = {};

		// Email validation
		if (!userData.email?.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(userData.email)) {
			newErrors.email = "Email is invalid";
		}

		// Password validation
		if (!userData.password?.trim()) {
			newErrors.password = "Password is required";
		} else if (userData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		} else if (
			!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(
				userData.password
			)
		) {
			newErrors.password =
				"Password must include uppercase, lowercase, number, and special character";
		}

		// Confirm password validation
		if (!userData.confirmPassword?.trim()) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (userData.password !== userData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Reset form state
	const resetForm = () => {
		setUserData({
			email: "",
			password: "",
			confirmPassword: "",
		});
		setErrors({});
		setLoading(false);
	};

	// Handle dialog close
	const handleClose = () => {
		resetForm();
		setVisible(false);
	};

	// Handle signup
	const handleSignup = async (e) => {
		e.preventDefault();

		// Validate form
		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			// Make API call to register user
			const response = await axios.post(
				"http://127.0.0.1:8000/api/admin/signupAdmin",
				{
					email: userData.email,
					password: userData.password,
					confirmPassword: userData.confirmPassword,
				}
			);

			// Check for successful registration
			if (response.data && response.data.status === "success") {
				// Show success message
				toast.current.show({
					severity: "success",
					summary: "Registration Successful",
					detail: "You can now log in with your credentials",
					life: 5000,
				});

				// Close dialog
				handleClose();
			}
		} catch (error) {
			console.error("Signup error:", error);

			// Handle specific error responses
			if (error.response) {
				const { status, data } = error.response;

				if (status === 409) {
					// Email already exists
					setErrors({
						...errors,
						email: "Email already in use. Please use a different email.",
					});
				} else if (status === 400 && data.message) {
					// Validation errors from server
					if (data.message.includes("Password")) {
						setErrors({
							...errors,
							password: data.message,
						});
					} else if (data.message.includes("match")) {
						setErrors({
							...errors,
							confirmPassword: data.message,
						});
					} else {
						// Generic error message
						toast.current.show({
							severity: "error",
							summary: "Registration Failed",
							detail:
								data.message ||
								"Please check your information and try again",
							life: 5000,
						});
					}
				} else {
					// Generic error
					toast.current.show({
						severity: "error",
						summary: "Registration Failed",
						detail: "An error occurred during registration. Please try again later.",
						life: 5000,
					});
				}
			} else {
				// Network error
				toast.current.show({
					severity: "error",
					summary: "Connection Error",
					detail: "Could not connect to the server. Please check your internet connection.",
					life: 5000,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="card flex justify-content-center">
			<Toast ref={toast} position="bottom-right" />
			<Button
				label="Signup"
				icon="pi pi-user-plus"
				className="p-button-secondary"
				onClick={() => setVisible(true)}
			/>
			<Dialog
				className="border-round-xl"
				visible={visible}
				modal
				onHide={handleClose}
				content={() => (
					<form
						className="flex flex-column px-6 py-3 gap-4 border-round-xl shadow-8"
						style={{ backdropFilter: "blur(50px)" }}
						onSubmit={handleSignup}
					>
						<h2 className="text-3xl mb-0 text-center">Signup</h2>

						{/* Email field */}
						<div className="inline-flex flex-column gap-2">
							<label
								htmlFor="email"
								className="text-primary-50 font-semibold"
							>
								Email
							</label>
							<InputText
								id="email"
								type="email"
								value={userData.email}
								onChange={handleInputChange}
								className={`bg-white-alpha-20 border-none p-3 text-primary-50 ${
									errors.email ? "p-invalid" : ""
								}`}
							/>
							{errors.email && (
								<small className="p-error">
									{errors.email}
								</small>
							)}
						</div>

						{/* Password field */}
						<div className="inline-flex flex-column gap-2">
							<label
								htmlFor="password"
								className="text-primary-50 font-semibold"
							>
								Password
							</label>
							<InputText
								id="password"
								type="password"
								value={userData.password}
								onChange={handleInputChange}
								className={`bg-white-alpha-20 border-none p-3 text-primary-50 ${
									errors.password ? "p-invalid" : ""
								}`}
							/>
							{errors.password && (
								<small className="p-error">
									{errors.password}
								</small>
							)}
							{!errors.password && (
								<small className="text-primary-100 opacity-60">
									Must be at least 8 characters with
									uppercase, lowercase, number, and special
									character
								</small>
							)}
						</div>

						{/* Confirm Password field */}
						<div className="inline-flex flex-column gap-2">
							<label
								htmlFor="confirmPassword"
								className="text-primary-50 font-semibold"
							>
								Confirm Password
							</label>
							<InputText
								id="confirmPassword"
								type="password"
								value={userData.confirmPassword}
								onChange={handleInputChange}
								className={`bg-white-alpha-20 border-none p-3 text-primary-50 ${
									errors.confirmPassword ? "p-invalid" : ""
								}`}
							/>
							{errors.confirmPassword && (
								<small className="p-error">
									{errors.confirmPassword}
								</small>
							)}
						</div>

						{/* Action buttons */}
						<div className="flex align-items-center gap-4 mb-4">
							<Button
								label="Sign-Up"
								type="submit"
								text
								loading={loading}
								className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
							/>
							<Button
								label="Cancel"
								onClick={handleClose}
								text
								disabled={loading}
								className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
							/>
						</div>
					</form>
				)}
			/>
		</div>
	);
}
