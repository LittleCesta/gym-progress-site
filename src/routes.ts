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
  router.get("/fichas-salvas", fichaController.mostrarPaginaFichasSalvas);
  router.get(
    "/cadastro-de-fichas",
    fichaController.mostrarPaginaCadastroDeFichas,
  );
  router.get(
    "/editar-ficha-salva/:id",
    fichaController.mostrarPaginaEditarFichas,
  );

  // --- API Endpoints ---
  // Fichas
  router.get("/api/listar-fichas", fichaController.listarFichas);
  router.post("/api/salvar-ficha", fichaController.salvarFicha);
  router.delete("/api/deletar-ficha/:_id", fichaController.deletarFicha);
  router.post("/api/editar-ficha/:_id", fichaController.editarFicha);
  router.get(
    "/api/listar-ficha-especifica/nome/:nome",
    fichaController.buscarFichaPorNome,
  );
  router.get(
    "/api/listar-ficha-especifica/id/:id",
    fichaController.buscarFichaPorId,
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
