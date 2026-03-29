import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import router from "./routes/index";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Servidor Ora corriendo en http://localhost:${PORT}`);
});