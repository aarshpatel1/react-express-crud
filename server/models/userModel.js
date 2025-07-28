import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		mobileNumber: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			required: true,
		},
		hobbies: {
			type: Array,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Users = mongoose.model("User", userSchema);

export default Users;
