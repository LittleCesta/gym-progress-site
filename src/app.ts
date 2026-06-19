// src/app.ts
import express from "express";
import path from "path";
import { createRouter } from "./routes";
import LoggerHelper from "./shared/utils/logger";

export function createApp(logger: LoggerHelper) {
  const app = express();

  // Middlewares Globais
  app.use(express.json());

  // Configuração do EJS como view engine
  app.set("view engine", "ejs");
  app.set("views", path.join(process.cwd(), "views"));

  // Servir arquivos estáticos (CSS, JS, Imagens) mapeado corretamente para evitar erro MIME
  app.use(
    "/assets",
    express.static(path.join(process.cwd(), "public", "assets")),
  );

  // Injeção de Rotas
  app.use(createRouter(logger));

  return app;
}
