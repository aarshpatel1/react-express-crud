import { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
// import { ToastContainer, toast, Bounce } from "react-toastify";
import { Toast } from "primereact/toast";
import axios from "axios";

function toTitleCase(str) {
	if (!str) {
		return ""; // Handle empty or null strings
	}
	return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}

function RegisterUser() {
	const [user, setUser] = useState({
		firstName: "",
		lastName: "",
		mobileNumber: "",
		email: "",
		gender: "",
		address: "",
		hobbies: [],
	});

	const toast = useRef(null);

	const [loading, setLoading] = useState(false);

	const handleOnChange = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	const onHobbiesChange = (e) => {
		let updatedHobbies = [...user.hobbies];

		if (e.checked) {
			updatedHobbies.push(e.value);
		} else {
			updatedHobbies = updatedHobbies.filter((h) => h !== e.value);
		}

		setUser({ ...user, hobbies: updatedHobbies });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (
			!user.firstName ||
			!user.lastName ||
			!user.gender ||
			!user.mobileNumber ||
			!user.email ||
			!user.address ||
			user.hobbies.length === 0
		) {
			// toast.error("Fields are missing");
			toast.current?.show({
				sevirity: "error",
				summary: "Error",
				detail: "Please fill all the fields.",
				life: 3000,
			});
			setLoading(false);
			return;
		}

		try {
			user.firstName = toTitleCase(user.firstName);
			user.lastName = toTitleCase(user.lastName);
			user.gender = user.gender.toLowerCase();
			user.mobileNumber = user.mobileNumber.toString();
			user.email = user.email.toLowerCase();
			user.address = toTitleCase(user.address.trim());
			user.hobbies = user.hobbies.map((hobby) => hobby.toLowerCase());

			let response = await axios.post(
				"http://127.0.0.1:8000/api/user/addUser",
				user
			);

			if (response.status === 200 || response.status === 201) {
				// toast.success("User added successfully!");
				toast.current?.show({
					severity: "success",
					summary: "Success",
					detail: "User added successfully!",
					life: 3000,
				});
			} else {
				// toast.error("Unexpected response from server.");
				toast.current?.show({
					severity: "error",
					summary: "Error",
					detail: "Unexpected response from server.",
					life: 3000,
				});
			}
			console.log(response);
		} catch (err) {
			// toast.error(
			// 	err.response?.data?.message ||
			// 		"Error adding data! Please try again."
			// );
			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail:
					err.response?.data?.message ||
					"Error adding data! Please try again.",
				life: 3000,
			});
			console.error("Error adding data!", err);
		} finally {
			setLoading(false);
			setUser({
				firstName: "",
				lastName: "",
				mobileNumber: "",
				email: "",
				gender: "",
				address: "",
				hobbies: [],
			});
		}
	};

	return (
		<>
			<h1 className="text-center">CRUD Operations</h1>

			<form action="" onSubmit={onSubmit} className="my-5">
				<div className="flex flex-column align-items-center justify-content-center gap-3">
					<div className="flex flex-wrap align-items-center gap-3">
						<label htmlFor="firstName">First Name: </label>
						<InputText
							name="firstName"
							id="firstName"
							placeholder="First Name"
							autoFocus
							value={user.firstName || ""}
							onChange={handleOnChange}
						/>
					</div>

					<div className="flex flex-wrap align-items-center gap-3">
						<label htmlFor="lastName">Last Name: </label>
						<InputText
							name="lastName"
							id="lastName"
							placeholder="Last Name"
							value={user.lastName || ""}
							onChange={handleOnChange}
						/>
					</div>

					<div className="flex flex-wrap align-items-center gap-3">
						<label htmlFor="mobileNumber">Mobile Number: </label>
						<InputText
							name="mobileNumber"
							id="mobileNumber"
							type="tel"
							keyfilter="int"
							placeholder="Mobile Number"
							value={user.mobileNumber || ""}
							onChange={handleOnChange}
						/>
					</div>

					<div className="flex flex-wrap align-items-center gap-3">
						<label htmlFor="email">Email ID: </label>
						<InputText
							type="email"
							name="email"
							id="email"
							autoComplete="email"
							keyfilter="email"
							placeholder="Email ID"
							value={user.email || ""}
							onChange={handleOnChange}
						/>
					</div>

					<div className="flex flex-wrap align-items-center gap-3">
						<label htmlFor="address">Address: </label>
						<InputTextarea
							name="address"
							autoResize
							id="address"
							rows={5}
							cols={30}
							placeholder="Address"
							value={user.address || ""}
							onChange={handleOnChange}
						/>
					</div>

					<div className="flex flex-wrap gap-3">
						<label htmlFor="gender">Gender: </label>
						<div className="flex align-items-center">
							<RadioButton
								inputId="gender1"
								name="gender"
								value="male"
								onChange={handleOnChange}
								checked={user.gender === "male"}
							/>
							<label htmlFor="gender1" className="ml-2">
								Male
							</label>
						</div>

						<div className="flex align-items-center">
							<RadioButton
								inputId="gender2"
								name="gender"
								value="female"
								onChange={handleOnChange}
								checked={user.gender === "female"}
							/>
							<label htmlFor="gender2" className="ml-2">
								Female
							</label>
						</div>

						<div className="flex align-items-center">
							<RadioButton
								inputId="gender3"
								name="gender"
								value="other"
								onChange={handleOnChange}
								checked={user.gender === "other"}
							/>
							<label htmlFor="gender3" className="ml-2">
								Other
							</label>
						</div>
					</div>

					<div className="card flex flex-wrap justify-content-center gap-3">
						<label htmlFor="hobbies">Hobbies: </label>
						<div className="flex align-items-center">
							<Checkbox
								inputId="reading"
								value="reading"
								onChange={onHobbiesChange}
								checked={user.hobbies.includes("reading")}
							/>
							<label htmlFor="reading" className="ml-2">
								Reading
							</label>
						</div>
						<div className="flex align-items-center">
							<Checkbox
								inputId="playing"
								value="playing"
								onChange={onHobbiesChange}
								checked={user.hobbies.includes("playing")}
							/>
							<label htmlFor="playing" className="ml-2">
								Playing
							</label>
						</div>
						<div className="flex align-items-center">
							<Checkbox
								inputId="singing"
								value="singing"
								onChange={onHobbiesChange}
								checked={user.hobbies.includes("singing")}
							/>
							<label htmlFor="singing" className="ml-2">
								Singing
							</label>
						</div>
					</div>

					<Button
						label="Submit"
						icon="pi pi-check"
						loading={loading}
					/>
				</div>
			</form>

			{/* <ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				transition={Bounce}
			/> */}
			<Toast ref={toast} position="bottom-right" />
		</>
	);
}

export default RegisterUser;
