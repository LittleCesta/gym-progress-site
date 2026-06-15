import { ENVIRONMENT } from "./environment";

import express from "express";
import path from "path";
import mongoose from "mongoose";
import LoggerHelper from "./utils/logger"; // Ajuste o caminho se necessário

import { fichaService } from "./services/fichaService";

const logger = new LoggerHelper("./gym-progress.log", "gym-progress");
const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "assets", "index.html"));
});

app.get("/fichas-salvas", (req, res) => {
  res.sendFile(
    path.join(process.cwd(), "public", "assets", "fichas-salvas.html"),
  );
});

app.post("/api/fichas", async (req, res) => {
  try {
    const dadosFicha = req.body;
    if (!dadosFicha.nome) {
      return res.status(400).json({ error: "O nome do aluno é obrigatório." });
    }

    const novaFicha = await fichaService.createFicha(dadosFicha, logger);

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

app.get("/cadastro-de-fichas", (req, res) => {
  res.sendFile(
    path.join(process.cwd(), "public", "assets", "cadastro-de-fichas.html"),
  );
});

app.get("/api/fichas", async (req, res) => {
  try {
    const fichas = await fichaService.getFichas(logger);
    res.json(fichas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar fichas" });
  }
});

export async function startServer() {
  const uri = ENVIRONMENT.mongoose.uri;
  if (!uri) throw new Error("MONGO_URI não definido");

  await mongoose.connect(uri);
  console.log("MongoDB conectado.");

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}
