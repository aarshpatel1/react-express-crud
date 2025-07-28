import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/users");

const db = mongoose.connection;

db.once("open", (err) => {
	if (err) {
		console.error("Error connecting mongodb..:", err);
	}
	console.log("mongodb connected successfully..!");
});

export default db;
