import express from "express";
import * as userController from "../controller/userController.js";

const router = express.Router();

router.get("/getAllUsers", userController.getAllUsers);

router.get("/getUserById/:id", userController.getUserById);

router.post("/addUser", userController.addUser);

router.put("/updateUser/:id", userController.updateUser);

router.patch("/updateUser/:id", userController.updateUser);

router.delete("/deleteUser/:id", userController.deleteUser);

export default router;
