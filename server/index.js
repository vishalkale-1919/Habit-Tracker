import express from "express";
import cors from "cors";
import "dotenv/config";
import habitsRouter from "./routes/habits.js";
import keepAliveRouter from '../api/keepAlive.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "*" }));
app.use(express.json());

app.get("/health", (_, res) => res.json({ status: "SYSTEM_ONLINE" }));
app.use("/keep-alive", keepAliveRouter);
app.use("/habits", habitsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status ?? 500).json({
    error: "SYSTEM_DIAGNOSTIC",
    message: err.message ?? "UNKNOWN_FAILURE",
    code: err.status ?? 500,
  });
});

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`⚡ Neural API @ :${PORT}`));
