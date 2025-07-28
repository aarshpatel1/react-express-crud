import Users from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
	try {
		const users = await Users.find();
		if (users.length > 0) {
			return res.status(200).json({
				status: "success",
				message: "Users fetched successfully",
				users,
			});
		} else {
			return res.status(404).json({
				status: "not found",
				message: "No users found",
			});
		}
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: "Failed to fetch users",
		});
	}
};

export const getUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await Users.findById(userId);
		if (user) {
			return res.status(200).json({
				status: "success",
				message: "User fetched successfully",
				user,
			});
		} else {
			return res.status(404).json({
				status: "not found",
				message: "User not found",
			});
		}
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: "Failed to fetch user",
		});
	}
};

export const addUser = async (req, res) => {
	console.log(req.body);
	try {
		const userExists = await Users.findOne({ email: req.body.email });
		if (!userExists) {
			await Users.create(req.body);
			console.log("User add successfully..!");
			return res.status(201).json({
				status: "success",
				message: "User add successfully",
				user: req.body,
			});
		} else {
			return res.status(409).json({
				status: "already exists",
				message: "User already exists",
			});
		}
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: "Failed to add user",
		});
	}
};

export const updateUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const updatedUser = await Users.findByIdAndUpdate(userId, req.body, {
			new: true,
		});
		if (updatedUser) {
			return res.status(200).json({
				status: "success",
				message: "User updated successfully",
				user: updatedUser,
			});
		} else {
			return res.status(404).json({
				status: "not found",
				message: "User not found",
			});
		}
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: "Failed to update user",
		});
	}
};

export const deleteUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await Users.findByIdAndDelete(userId);
		if (user) {
			return res.status(200).json({
				status: "success",
				message: "User deleted successfully",
			});
		} else {
			return res.status(404).json({
				status: "not found",
				message: "User not found",
			});
		}
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: "Failed to delete user",
		});
	}
};
