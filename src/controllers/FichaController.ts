import { Request, Response } from "express";
import { FichaInputSchema } from "../models/FichaModel";
import { fichaService } from "../services/FichaService";
import LoggerHelper from "../shared/utils/logger";

export class FichaController {
  constructor(private logger: LoggerHelper) {}

  listarFichas = async (req: Request, res: Response) => {
    try {
      const fichas = await fichaService.getFichas(this.logger);
      return res.json(fichas);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar fichas" });
    }
  };

  salvarFicha = async (req: Request, res: Response) => {
    try {
      const resultado = FichaInputSchema.safeParse(req.body);
      if (!resultado.success) {
        return res.status(400).json({ error: resultado.error.issues });
      }

      const novaFicha = await fichaService.createFicha(
        resultado.data,
        this.logger,
      );
      if (!novaFicha) {
        return res
          .status(500)
          .json({ error: "Erro interno ao salvar no banco." });
      }

      return res.status(201).json(novaFicha);
    } catch (err: any) {
      this.logger.log("ERROR", `Erro no cadastro: ${err.message}`);
      return res.status(500).json({ error: "Erro ao processar a requisição." });
    }
  };

  buscarFichaPorNome = async (req: Request, res: Response) => {
    try {
      const ficha = await fichaService.buscarFichasPorNome(
        String(req.params.nome),
        this.logger,
      );
      return res.json(ficha);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar ficha" });
    }
  };

  deletarFicha = async (req: Request, res: Response) => {
    try {
      const ficha = await fichaService.deletarFicha(
        String(req.params._id),
        this.logger,
      );
      return res.json(ficha);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao deletar ficha" });
    }
  };
}
