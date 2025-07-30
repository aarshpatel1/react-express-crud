import Admins from "../models/adminModel.js";

import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { config } from "dotenv";

config({
	path: "./.env",
	quiet: true,
});

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

export default passport.use(
	"jwt",
	Strategy(jwtOptions, async (payload, done) => {
		try {
			if (!payload.adminData || !payload.adminData._id) {
				return done(null, false, {
					message: "Invalid Payload Token",
				});
			}

			const currentTimestamp = Math.floor(Date.now() / 1000);
			if (payload.exp && payload.exp < currentTimestamp) {
				return done(null, false, { message: "Token expired" });
			}

			const adminExists = await Admins.findById(payload.adminData._id);

			if (!adminExists) {
				return done(null, false, {
					message: "Admin not Found",
				});
			}

			if (!adminExists.status) {
				return done(null, false, {
					message: "Admin is inactive",
				});
			}

			return done(null, adminExists);
		} catch (err) {
			console.error(err);
			return done(null, false, {
				message: "Server Error",
			});
		}
	})
);
