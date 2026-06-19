// src/routes.ts
import { Router } from "express";
import { FichaController } from "./controllers/FichaController";
import LoggerHelper from "./shared/utils/logger";
import { UsuarioController } from "./controllers/UsuarioController";

export function createRouter(logger: LoggerHelper): Router {
  const router = Router();

  const fichaController = new FichaController(logger);
  const usuarioController = new UsuarioController(logger);

  // --- HTML Views ---
  router.get("/", (req, res) =>
    res.render("index", { titulo: "Menu principal" }),
  );
  router.get("/login", (req, res) => res.render("login", { titulo: "Login" }));
  router.get("/fichas-salvas", (req, res) =>
    res.render("fichas-salvas", { titulo: "Fichas de Treino" }),
  );
  router.get("/cadastro-de-fichas", (req, res) =>
    res.render("cadastro-de-fichas", { titulo: "Cadastro de Ficha" }),
  );

  // --- API Endpoints ---
  // Fichas
  router.get("/api/listar-fichas", fichaController.listarFichas);
  router.post("/api/salvar-ficha", fichaController.salvarFicha);
  router.delete("/api/deletar-ficha/:_id", fichaController.deletarFicha);
  router.get(
    "/api/listar-ficha-especifica/:nome",
    fichaController.buscarFichaPorNome,
  );

  // Usuários
  router.get("/api/listar-usuarios", usuarioController.listarUsuarios);
  router.post("/api/salvar-usuario", usuarioController.salvarUsuario);
  router.delete("/api/deletar-usuario/:_id", usuarioController.deletarUsuario);
  router.post(
    "/api/listar-usuario-especifico/:nome",
    usuarioController.buscarUsuarioPorNome,
  );

  return router;
}
