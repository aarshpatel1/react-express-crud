import express from "express";
import userRoutes from "./user.js";

const router = express.Router();

router.get("/", (req, res) => {
	return res.status(200).json({
		status: "success",
		message: "Welcome to the User Management API",
		data: {
			name: "User Management API",
			version: "1.0.0",
		},
		routes: [
			{ method: "GET", path: "/api/user/getAllUsers" },
			{ method: "GET", path: "/api/user/getUserById/:id" },
			{ method: "POST", path: "/api/user/addUser" },
			{ method: "PUT", path: "/api/user/updateUser/:id" },
			{ method: "PATCH", path: "/api/user/updateUser/:id" },
			{ method: "DELETE", path: "/api/user/deleteUser/:id" },
		],
	});
});

router.use("/user", userRoutes);

export default router;
