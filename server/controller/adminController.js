import Admins from "../models/adminModel.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config({
	path: "./.env",
	quiet: true,
});

const saltRounds = 10;

export const signupAdmin = async (req, res) => {
	const { email, password, confirmPassword } = req.body;

	try {
		const adminExists = await Admins.findOne({ email: email });

		if (adminExists) {
			return res.status(409).json({
				status: "conflict",
				message: "Admin already exists with this email address",
			});
		}

		if (password !== confirmPassword) {
			return res.status(400).json({
				status: "error",
				message: "Password and confirm password do not match",
			});
		}

		const passwordRegex =
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
		if (!passwordRegex.test(password)) {
			return res.status(400).json({
				status: "error",
				message:
					"Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
			});
		}

		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const registerAdmin = await Admins.create({
			email,
			password: hashedPassword,
		});

		const adminResponse = registerAdmin.toObject();
		delete adminResponse.password;

		return res.status(201).json({
			status: "success",
			message: "Admin registered successfully",
			admin: adminResponse,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			status: "failed",
			message: "Faild to register Admin",
			error: err,
		});
	}
};

export const loginAdmin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const adminExists = await Admins.findOne({ email: email });

		if (!adminExists) {
			return res.status(404).json({
				status: "not found",
				message: "Admin not found",
			});
		}

		if (!adminExists.status) {
			return res.status(403).json({
				status: "forbidden",
				message:
					"Account is deactivated. Please contact administrator.",
			});
		}

		const matchPassword = await bcrypt.compare(
			password,
			adminExists.password
		);

		if (!matchPassword) {
			return res.status(401).json({
				status: "unauthorized",
				message: "Invalid credentials",
			});
		}

		const tokenForAdmin = {
			_id: adminExists._id,
			email: adminExists.email,
		};

		const token = jwt.sign(
			{ adminData: tokenForAdmin },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRY || "1h" }
		);

		const adminResponse = adminExists.toObject();
		delete adminResponse.password;

		return res.status(200).json({
			status: "success",
			message: "Admin logged in successfully",
			admin: adminResponse,
			token,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			status: "failed",
			message: "Failed authenticating and generating JWT",
			error: err,
		});
	}
};
