import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api";
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
	res.send(`Server Running on port ${PORT}, Time: ${new Date().toLocaleTimeString()}`);
});

app.use("/api", apiRoutes);

app.listen(PORT, () => {
	console.log(`Server Running on port http://localhost:${PORT}`);
});
