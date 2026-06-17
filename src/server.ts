// src/server.ts
import { ENVIRONMENT } from "./config/environment";
import LoggerHelper from "./shared/utils/logger";
import { connectDB } from "./shared/utils/dataBase";
import { createApp } from "./app";

export async function startServer(logger: LoggerHelper) {
  try {
    // 1. Inicializa o Banco de Dados primeiro
    await connectDB(logger);

    // 2. Cria a instância do Express configurada
    const app = createApp(logger);

    // 3. Levanta o servidor
    app.listen(ENVIRONMENT.server.port, () => {
      console.log(
        `Servidor rodando em http://localhost:${ENVIRONMENT.server.port}`,
      );
    });
  } catch (error) {
    logger.log("ERROR", `Falha catastrófica ao iniciar o servidor: ${error}`);
    process.exit(1);
  }
}
