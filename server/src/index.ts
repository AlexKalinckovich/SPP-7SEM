import express = require("express");
import cors = require("cors");
import { SlotController } from "./controllers/SlotController";
import { SlotService } from "./services/SlotService";
import { SlotRepository } from "./repositories/SlotRepository";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const repository = new SlotRepository();
const service = new SlotService(repository);
const controller = new SlotController(service);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/slots", controller.list);
app.get("/api/slots/:id", controller.get);
app.post("/api/slots", controller.create);
app.put("/api/slots/:id", controller.update);
app.delete("/api/slots/:id", controller.delete);

app.listen(PORT, () => {
  console.log(`API server on http://localhost:${PORT}`);
});