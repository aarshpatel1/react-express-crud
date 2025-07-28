import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { RadioButton } from "primereact/radiobutton";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Tag } from "primereact/tag";
import { Message } from "primereact/message";
import axios from "axios";

export default function DisplayUser() {
	let chosenUser = {
		id: null,
		firstName: "",
		lastName: "",
		mobileNumber: "",
		email: "",
		gender: "",
		address: "",
		hobbies: [],
	};

	const [user, setUser] = useState(chosenUser);
	const [users, setUsers] = useState([]);
	const [userDialog, setUserDialog] = useState(false);
	const [deleteUserDialog, setDeleteUserDialog] = useState(false);
	const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [submitted, setSubmitted] = useState(false);
	const [globalFilter, setGlobalFilter] = useState(null);
	const toast = useRef(null);
	const dt = useRef(null);

	useEffect(() => {
		fetchUsers();
	});

	const fetchUsers = async () => {
		try {
			const response = await axios.get(
				"http://127.0.0.1:8000/api/user/getAllUsers"
			);

			const userData = response?.data?.users || [];

			if (!Array.isArray(userData) || userData.length === 0) {
				toast.current?.show({
					severity: "info",
					summary: "No Users",
					detail: "No users found in the system.",
					life: 3000,
					position: "bottom-right",
				});
				setUsers([]);
				return;
			}

			const processedData = userData.map((user) => ({
				...user,
				id: user.id || user._id || null,
			}));

			setUsers(processedData);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 404) {
				// toast.current?.show({
				// 	severity: "info",
				// 	summary: "No Users Found",
				// 	detail: "The user list could not be found (404).",
				// 	life: 3000,
				// 	position: "bottom-right",
				// });
				setUsers([]);
			} else {
				console.error("Error fetching users:", error.message);
				toast.current?.show({
					severity: "error",
					summary: "Server Error",
					detail: "Failed to fetch users. Try again later.",
					life: 3000,
					position: "bottom-right",
				});
			}
		}
	};

	const openNew = () => {
		// Ensure a fresh user object with empty hobbies array
		setUser({
			...chosenUser,
			hobbies: [],
		});
		setSubmitted(false);
		setUserDialog(true);
	};

	const hideDialog = () => {
		setSubmitted(false);
		setUserDialog(false);
	};

	const hideDeleteUserDialog = () => {
		setDeleteUserDialog(false);
	};

	const hideDeleteUsersDialog = () => {
		setDeleteUsersDialog(false);
	};

	const saveUser = async () => {
		setSubmitted(true);

		if (
			user.firstName?.trim() &&
			user.lastName?.trim() &&
			user.email?.trim() &&
			user.mobileNumber?.trim() &&
			user.gender?.trim() &&
			user.address?.trim()
		) {
			try {
				if (user.id) {
					user.firstName = toTitleCase(user.firstName);
					user.lastName = toTitleCase(user.lastName);
					user.email = user.email.toLowerCase();
					user.mobileNumber = user.mobileNumber.toString();
					user.address = toTitleCase(user.address.trim());
					user.hobbies = user.hobbies.map((hobby) =>
						hobby.toLowerCase()
					);

					await axios.put(
						`http://127.0.0.1:8000/api/user/updateUser/${user.id}`,
						user
					);
					toast.current.show({
						severity: "success",
						summary: "Successful",
						detail: "User Updated",
						life: 3000,
						position: "bottom-right",
					});
				} else {
					// Add new user
					await axios.post(
						"http://127.0.0.1:8000/api/user/addUser",
						user
					);
					toast.current.show({
						severity: "success",
						summary: "Successful",
						detail: "User Created",
						life: 3000,
						position: "bottom-right",
					});
				}

				// Refresh users list
				await fetchUsers();
				setUserDialog(false);
				setUser({ ...chosenUser });
			} catch (error) {
				console.error("Error saving user:", error);
				toast.current.show({
					severity: "error",
					summary: "Error",
					detail: "Failed to save user",
					life: 3000,
					position: "bottom-right",
				});
			}
		}
	};

	const editUser = (userData) => {
		// Ensure hobbies is always an array when editing
		const userWithValidHobbies = {
			...userData,
			hobbies: Array.isArray(userData.hobbies) ? userData.hobbies : [],
		};
		setUser(userWithValidHobbies);
		setUserDialog(true);
	};

	const confirmDeleteUser = (userData) => {
		setUser(userData);
		setDeleteUserDialog(true);
	};

	const deleteUser = async () => {
		try {
			await axios.delete(
				`http://127.0.0.1:8000/api/user/deleteUser/${user.id}`
			);

			await fetchUsers();
			setDeleteUserDialog(false);
			setUser({ ...chosenUser });
			toast.current.show({
				severity: "success",
				summary: "Successful",
				detail: "User Deleted",
				life: 3000,
				position: "bottom-right",
			});
		} catch (error) {
			console.error("Error deleting user:", error);
			toast.current.show({
				severity: "error",
				summary: "Error",
				detail: "Failed to delete user",
				life: 3000,
				position: "bottom-right",
			});
		}
	};

	const exportCSV = () => {
		dt.current.exportCSV();
	};

	const confirmDeleteSelected = () => {
		if (!selectedUsers || selectedUsers.length === 0) {
			toast.current.show({
				severity: "warn",
				summary: "Warning",
				detail: "No users selected for deletion",
				life: 3000,
				position: "bottom-right",
			});
			return;
		}
		setDeleteUsersDialog(true);
	};

	const deleteSelectedUsers = async () => {
		try {
			if (!selectedUsers || selectedUsers.length === 0) {
				toast.current.show({
					severity: "warn",
					summary: "Warning",
					detail: "No users selected for deletion",
					life: 3000,
					position: "bottom-right",
				});
				return;
			}

			// Create an array of promises for each deletion request
			const deletePromises = selectedUsers.map((user) =>
				axios.delete(
					`http://127.0.0.1:8000/api/user/deleteUser/${user.id}`
				)
			);

			// Wait for all deletion requests to complete
			await Promise.all(deletePromises);

			// Refresh the users list
			await fetchUsers();

			// Close the confirmation dialog and reset selection
			setDeleteUsersDialog(false);
			setSelectedUsers([]);

			toast.current.show({
				severity: "success",
				summary: "Successful",
				detail: `${selectedUsers.length} ${
					selectedUsers.length > 1 ? "Users" : "User"
				} Deleted`,
				life: 3000,
				position: "bottom-right",
			});
		} catch (error) {
			console.error("Error deleting users:", error);
			toast.current.show({
				severity: "error",
				summary: "Error",
				detail: "Failed to delete users",
				life: 3000,
				position: "bottom-right",
			});
		}
	};

	const onInputChange = (e, name) => {
		const val = (e.target && e.target.value) || "";
		let _user = { ...user };
		_user[name] = val;
		setUser(_user);
	};

	const onHobbiesChange = (e) => {
		// Create a proper copy of the hobbies array, ensuring it exists
		let updatedHobbies = [...(user.hobbies || [])];

		if (e.checked) {
			updatedHobbies.push(e.value);
		} else {
			updatedHobbies = updatedHobbies.filter((h) => h !== e.value);
		}

		setUser({ ...user, hobbies: updatedHobbies });
	};

	const leftToolbarTemplate = () => {
		return (
			<div className="flex flex-wrap gap-2">
				<Button
					label="New"
					icon="pi pi-plus"
					severity="success"
					onClick={openNew}
				/>
				<Button
					label="Delete"
					icon="pi pi-trash"
					severity="danger"
					onClick={confirmDeleteSelected}
					disabled={!selectedUsers || selectedUsers.length === 0}
				/>
			</div>
		);
	};

	const rightToolbarTemplate = () => {
		return (
			<Button
				label="Export"
				icon="pi pi-upload"
				className="p-button-help"
				onClick={exportCSV}
			/>
		);
	};

	const genderBodyTemplate = (rowData) => {
		return rowData.gender ? toTitleCase(rowData.gender) : "Unknown";
	};

	const toTitleCase = (str) => {
		if (!str) {
			return ""; // Handle empty or null strings
		}
		return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
	};

	const hobbiesBodyTemplate = (rowData) => {
		if (Array.isArray(rowData.hobbies) && rowData.hobbies.length > 0) {
			const hobbyColors = {
				playing: "success",
				reading: "info",
				singing: "warning",
			};
			return (
				<>
					{rowData.hobbies.map((hobby, idx) => (
						<Tag
							key={hobby + idx}
							value={toTitleCase(hobby)}
							severity={hobbyColors[hobby] || "secondary"}
							className="mr-1 mb-1"
						/>
					))}
				</>
			);
		}
		return "None";
	};

	const actionBodyTemplate = (rowData) => {
		return (
			<React.Fragment>
				<Button
					icon="pi pi-pencil"
					rounded
					outlined
					className="mr-2"
					onClick={() => editUser(rowData)}
				/>
				<Button
					icon="pi pi-trash"
					rounded
					outlined
					severity="danger"
					onClick={() => confirmDeleteUser(rowData)}
				/>
			</React.Fragment>
		);
	};

	const header = (
		<div className="flex flex-wrap gap-2 align-items-center justify-content-between">
			<h4 className="m-0">Manage Users</h4>
			<IconField iconPosition="left">
				<InputIcon className="pi pi-search" />
				<InputText
					type="search"
					onInput={(e) => setGlobalFilter(e.target.value)}
					placeholder="Search..."
				/>
			</IconField>
		</div>
	);

	const userDialogFooter = (
		<React.Fragment>
			<Button
				label="Cancel"
				icon="pi pi-times"
				outlined
				onClick={hideDialog}
			/>
			<Button label="Save" icon="pi pi-check" onClick={saveUser} />
		</React.Fragment>
	);

	const deleteUserDialogFooter = (
		<React.Fragment>
			<Button
				label="No"
				icon="pi pi-times"
				outlined
				onClick={hideDeleteUserDialog}
			/>
			<Button
				label="Yes"
				icon="pi pi-check"
				severity="danger"
				onClick={deleteUser}
			/>
		</React.Fragment>
	);

	const deleteUsersDialogFooter = (
		<React.Fragment>
			<Button
				label="No"
				icon="pi pi-times"
				outlined
				onClick={hideDeleteUsersDialog}
			/>
			<Button
				label="Yes"
				icon="pi pi-check"
				severity="danger"
				onClick={deleteSelectedUsers}
			/>
		</React.Fragment>
	);

	return users.length === 0 ? (
		<div className="card w-3 m-auto">
			<Message
				className="border-primary w-full justify-content-start"
				severity="info"
				text="No users found. Please add a new user."
			/>
		</div>
	) : (
		<div>
			<Toast ref={toast} position="bottom-right" />
			<div className="card">
				<Toolbar
					className="mb-4"
					left={leftToolbarTemplate}
					right={rightToolbarTemplate}
				></Toolbar>

				<DataTable
					ref={dt}
					value={users}
					selection={selectedUsers}
					onSelectionChange={(e) => setSelectedUsers(e.value)}
					dataKey="id"
					rowHover
					paginator
					rows={10}
					rowsPerPageOptions={[5, 10, 25]}
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
					globalFilter={globalFilter}
					header={header}
					emptyMessage="No users found. Add a new user to get started."
					selectionMode="multiple"
					responsiveLayout="scroll"
				>
					<Column
						selectionMode="multiple"
						exportable={false}
					></Column>
					<Column
						field="firstName"
						header="First Name"
						sortable
						style={{ minWidth: "12rem" }}
					></Column>
					<Column
						field="lastName"
						header="Last Name"
						sortable
						style={{ minWidth: "12rem" }}
					></Column>
					<Column
						field="email"
						header="Email"
						sortable
						style={{ minWidth: "16rem" }}
					></Column>
					<Column
						field="mobileNumber"
						header="Mobile"
						sortable
						style={{ minWidth: "12rem" }}
					></Column>
					<Column
						field="gender"
						header="Gender"
						body={genderBodyTemplate}
						sortable
						style={{ minWidth: "8rem" }}
					></Column>
					<Column
						field="hobbies"
						header="Hobbies"
						body={hobbiesBodyTemplate}
						style={{ minWidth: "12rem" }}
					></Column>
					<Column
						body={actionBodyTemplate}
						exportable={false}
						style={{ minWidth: "12rem" }}
					></Column>
				</DataTable>
			</div>

			<Dialog
				visible={userDialog}
				style={{ width: "32rem" }}
				breakpoints={{ "960px": "75vw", "641px": "90vw" }}
				header="User Details"
				modal
				className="p-fluid"
				footer={userDialogFooter}
				onHide={hideDialog}
			>
				<div className="field">
					<label htmlFor="firstName" className="font-bold">
						First Name
					</label>
					<InputText
						id="firstName"
						value={user.firstName || ""}
						onChange={(e) => onInputChange(e, "firstName")}
						required
						autoFocus
						className={classNames({
							"p-invalid": submitted && !user.firstName,
						})}
					/>
					{submitted && !user.firstName && (
						<small className="p-error">
							First Name is required.
						</small>
					)}
				</div>

				<div className="field">
					<label htmlFor="lastName" className="font-bold">
						Last Name
					</label>
					<InputText
						id="lastName"
						value={user.lastName || ""}
						onChange={(e) => onInputChange(e, "lastName")}
						required
						className={classNames({
							"p-invalid": submitted && !user.lastName,
						})}
					/>
					{submitted && !user.lastName && (
						<small className="p-error">
							Last Name is required.
						</small>
					)}
				</div>

				<div className="field">
					<label htmlFor="email" className="font-bold">
						Email
					</label>
					<InputText
						id="email"
						value={user.email || ""}
						onChange={(e) => onInputChange(e, "email")}
						required
						className={classNames({
							"p-invalid": submitted && !user.email,
						})}
					/>
					{submitted && !user.email && (
						<small className="p-error">Email is required.</small>
					)}
				</div>

				<div className="field">
					<label htmlFor="mobileNumber" className="font-bold">
						Mobile Number
					</label>
					<InputText
						id="mobileNumber"
						value={user.mobileNumber || ""}
						onChange={(e) => onInputChange(e, "mobileNumber")}
						required
						className={classNames({
							"p-invalid": submitted && !user.mobileNumber,
						})}
					/>
					{submitted && !user.mobileNumber && (
						<small className="p-error">
							Mobile Number is required.
						</small>
					)}
				</div>

				<div className="field">
					<label htmlFor="address" className="font-bold">
						Address
					</label>
					<InputTextarea
						id="address"
						value={user.address || ""}
						onChange={(e) => onInputChange(e, "address")}
						required
						rows={3}
						cols={20}
					/>
				</div>

				<div className="field">
					<label className="mb-3 font-bold">Gender</label>
					<div className="formgrid grid">
						<div className="field-radiobutton col-4">
							<RadioButton
								inputId="gender1"
								name="gender"
								value="male"
								onChange={(e) => onInputChange(e, "gender")}
								checked={user.gender === "male"}
							/>
							<label htmlFor="gender1">Male</label>
						</div>
						<div className="field-radiobutton col-4">
							<RadioButton
								inputId="gender2"
								name="gender"
								value="female"
								onChange={(e) => onInputChange(e, "gender")}
								checked={user.gender === "female"}
							/>
							<label htmlFor="gender2">Female</label>
						</div>
						<div className="field-radiobutton col-4">
							<RadioButton
								inputId="gender3"
								name="gender"
								value="other"
								onChange={(e) => onInputChange(e, "gender")}
								checked={user.gender === "other"}
							/>
							<label htmlFor="gender3">Other</label>
						</div>
					</div>
				</div>

				<div className="field">
					<label className="mb-3 font-bold">Hobbies</label>
					<div className="formgrid grid">
						<div className="field-checkbox col-4">
							<Checkbox
								inputId="reading"
								value="reading"
								onChange={onHobbiesChange}
								checked={
									Array.isArray(user.hobbies) &&
									user.hobbies.includes("reading")
								}
							/>
							<label htmlFor="reading">Reading</label>
						</div>
						<div className="field-checkbox col-4">
							<Checkbox
								inputId="playing"
								value="playing"
								onChange={onHobbiesChange}
								checked={
									Array.isArray(user.hobbies) &&
									user.hobbies.includes("playing")
								}
							/>
							<label htmlFor="playing">Playing</label>
						</div>
						<div className="field-checkbox col-4">
							<Checkbox
								inputId="singing"
								value="singing"
								onChange={onHobbiesChange}
								checked={
									Array.isArray(user.hobbies) &&
									user.hobbies.includes("singing")
								}
							/>
							<label htmlFor="singing">Singing</label>
						</div>
					</div>
				</div>
			</Dialog>

			<Dialog
				visible={deleteUserDialog}
				style={{ width: "32rem" }}
				breakpoints={{ "960px": "75vw", "641px": "90vw" }}
				header="Confirm"
				modal
				footer={deleteUserDialogFooter}
				onHide={hideDeleteUserDialog}
			>
				<div className="confirmation-content">
					<i
						className="pi pi-exclamation-triangle mr-3"
						style={{ fontSize: "2rem" }}
					/>
					{user && (
						<span>
							Are you sure you want to delete{" "}
							<b>
								{user.firstName} {user.lastName}
							</b>
							?
						</span>
					)}
				</div>
			</Dialog>

			<Dialog
				visible={deleteUsersDialog}
				style={{ width: "32rem" }}
				breakpoints={{ "960px": "75vw", "641px": "90vw" }}
				header="Confirm"
				modal
				footer={deleteUsersDialogFooter}
				onHide={hideDeleteUsersDialog}
			>
				<div className="confirmation-content">
					<i
						className="pi pi-exclamation-triangle mr-3"
						style={{ fontSize: "2rem" }}
					/>
					{selectedUsers && selectedUsers.length > 0 && (
						<span>
							Are you sure you want to delete{" "}
							{selectedUsers.length}{" "}
							{selectedUsers.length > 1 ? "users" : "user"}?
						</span>
					)}
				</div>
			</Dialog>
		</div>
	);
}
