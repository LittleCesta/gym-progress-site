// src/routes.ts
import { Router } from "express";
import path from "path";
import { FichaController } from "./controllers/FichaController";
import LoggerHelper from "./shared/utils/logger";

export function createRouter(logger: LoggerHelper): Router {
  const router = Router();
  const fichaController = new FichaController(logger);

  // --- HTML Views ---
  const viewsPath = path.join(process.cwd(), "public", "assets");

  router.get("/", (req, res) =>
    res.sendFile(path.join(viewsPath, "index.html")),
  );
  router.get("/fichas-salvas", (req, res) =>
    res.sendFile(path.join(viewsPath, "fichas-salvas.html")),
  );
  router.get("/cadastro-de-fichas", (req, res) =>
    res.sendFile(path.join(viewsPath, "cadastro-de-fichas.html")),
  );

  // --- API Endpoints ---
  router.get("/api/listar-fichas", fichaController.listarFichas);
  router.post("/api/salvar-ficha", fichaController.salvarFicha);
  router.delete("/api/deletar-ficha/:_id", fichaController.deletarFicha);
  router.get(
    "/api/listar-ficha-especifica/:nome",
    fichaController.buscarPorNome,
  );

  return router;
}
