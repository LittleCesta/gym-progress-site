import { ENVIRONMENT } from "./environment";
import LoggerHelper from "./utils/logger"; // Ajuste o caminho se necessário
import { fichaService } from "./services/fichaService";
import { connectDB } from "./utils/dataBase";

import express from "express";
import path from "path";

import { z } from "zod";

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "..", "public")));

const FichaSchema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().optional().or(z.literal("")),
  peso: z.number().min(0).max(500).default(0),
  peito: z.number().min(0).max(300).default(0),
  abdomen: z.number().min(0).max(300).default(0),
  ombros: z.number().min(0).max(300).default(0),
  quadricepsEsquerdo: z.number().min(0).max(150).default(0),
  quadricepsDireito: z.number().min(0).max(150).default(0),
  panturrilhaEsquerda: z.number().min(0).max(100).default(0),
  panturrilhaDireita: z.number().min(0).max(100).default(0),
  bicepsEsquerdo: z.number().min(0).max(100).default(0),
  bicepsDireito: z.number().min(0).max(100).default(0),
});

export async function startServer(logger: LoggerHelper) {
  // Página inicial
  app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "assets", "index.html"));
  });

  // Página de fichas salvas
  app.get("/fichas-salvas", (req, res) => {
    res.sendFile(
      path.join(process.cwd(), "public", "assets", "fichas-salvas.html"),
    );
  });

  // Listagem de fichas
  app.get("/api/listar-fichas", async (req, res) => {
    try {
      const fichas = await fichaService.getFichas(logger);
      res.json(fichas);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar fichas" });
    }
  });

  // Cadastro de ficha
  app.post("/api/salvar-ficha", async (req, res) => {
    try {
      const resultado = FichaSchema.safeParse(req.body);
      if (!resultado.success) {
        return res.status(400).json({ error: resultado.error.issues });
      }

      // resultado.data já tem os valores validados e com defaults aplicados
      const novaFicha = await fichaService.createFicha(resultado.data, logger);

      if (!novaFicha) {
        return res
          .status(500)
          .json({ error: "Erro interno ao salvar a ficha no banco." });
      }

      res.status(201).json(novaFicha);
    } catch (err: any) {
      logger.log("ERROR", `Erro na rota de cadastro: ${err.message}`);
      res.status(500).json({ error: "Erro ao processar a requisição." });
    }
  });

  // Página de cadastro de fichas
  app.get("/cadastro-de-fichas", (req, res) => {
    res.sendFile(
      path.join(process.cwd(), "public", "assets", "cadastro-de-fichas.html"),
    );
  });

  // Listagem de fichas por nome
  app.get("/api/listar-ficha-especifica/:nome", async (req, res) => {
    try {
      const ficha = await fichaService.buscarFichasPorNome(
        req.params.nome,
        logger,
      );
      res.json(ficha);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar ficha" });
    }
  });

  await connectDB(logger);

  app.listen(ENVIRONMENT.server.port, () => {
    console.log(
      `Servidor rodando em http://localhost:${ENVIRONMENT.server.port}`,
    );
  });
}
