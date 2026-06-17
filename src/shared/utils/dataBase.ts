import mongoose from "mongoose";
import LoggerHelper from "../utils/logger";
import { ENVIRONMENT } from "../../config/environment";

export async function connectDB(logger: LoggerHelper): Promise<void> {
  if (!ENVIRONMENT.mongoose.uri) {
    logger.log("ERROR", "MONGO_URI não definido no .env");
    process.exit(1);
  }

  try {
    mongoose.connection.on("error", (err) =>
      console.error("Mongoose error:", err),
    );
    await mongoose.connect(ENVIRONMENT.mongoose.uri!, {
      serverSelectionTimeoutMS: 10000,
    });
    logger.log("INFO", "MongoDB conectado.");
  } catch (err: any) {
    console.log("Erro ao conectar ao banco de dados: " + err.message);
    process.exit(1);
  }
}
