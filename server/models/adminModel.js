import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		status: {
			type: Boolean,
			default: true,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Admins = mongoose.model("admin", adminSchema);

export default Admins;
