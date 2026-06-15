process.env.NODE_ENVIRONMENT == "development"
  ? process.loadEnvFile(".env.development")
  : process.loadEnvFile(".env.production");

import "./server"; // <-- GARANTE QUE ESTA LINHA EXISTE! Ela executa o código do server.ts
import { startServer } from "./server";
import Logger from "./utils/logger";

(async function () {
  const logger = new Logger("./gym-progress.log", "gym-progress");

  await startServer();
})();
