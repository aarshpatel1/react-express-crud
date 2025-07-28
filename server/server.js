import db from "./config/db.js";
import express from "express";
import router from "./routes/index.js";
import helmet from "helmet";
import cors from "cors";

const app = express();
const port = 8000;

// Security headers
app.use(helmet());

// CORS configuration
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "*",
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.listen(port, (err) => {
	err
		? console.error("Error starting server", err)
		: console.log("Server is running on http://127.0.0.1:" + port);
});
