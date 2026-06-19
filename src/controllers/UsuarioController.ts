import { Request, Response } from "express";
import { UsuarioInputSchema } from "../models/UsuarioModel";
import { usuarioService } from "../services/UsuarioService";
import LoggerHelper from "../shared/utils/logger";

export class UsuarioController {
  constructor(private logger: LoggerHelper) {}

  listarUsuarios = async (req: Request, res: Response) => {
    try {
      const usuarios = await usuarioService.getUsuarios(this.logger);
      return res.json(usuarios);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar usuarios" });
    }
  };

  salvarUsuario = async (req: Request, res: Response) => {
    try {
      const resultado = UsuarioInputSchema.safeParse(req.body);
      if (!resultado.success) {
        return res.status(400).json({ error: resultado.error.issues });
      }

      const novoUsuario = await usuarioService.createUsuario(
        resultado.data,
        this.logger,
      );
      if (!novoUsuario) {
        return res
          .status(500)
          .json({ error: "Erro interno ao salvar no banco." });
      }

      return res.status(201).json(novoUsuario);
    } catch (err: any) {
      this.logger.log("ERROR", `Erro no cadastro: ${err.message}`);
      return res.status(500).json({ error: "Erro ao processar a requisição." });
    }
  };

  buscarUsuarioPorNome = async (req: Request, res: Response) => {
    try {
      const usuario = await usuarioService.buscarUsuariosPorEmail(
        String(req.params.nome),
        this.logger,
      );
      return res.json(usuario);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar usuario" });
    }
  };

  deletarUsuario = async (req: Request, res: Response) => {
    try {
      const usuario = await usuarioService.deletarUsuario(
        String(req.params._id),
        this.logger,
      );
      return res.json(usuario);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao deletar usuario" });
    }
  };
}
