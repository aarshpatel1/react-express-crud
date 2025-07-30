import mongoose from "mongoose";
import { config } from "dotenv";

config({
	path: "./.env",
	quiet: true,
});

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.once("open", (err) => {
	if (err) {
		console.error("Error connecting mongodb..:", err);
	}
	console.log("mongodb connected successfully..!");
});

export default db;
