import Ficha, { IFicha } from "../models/Ficha";
import LoggerHelper from "../utils/logger";
import StringFormatter from "../helpers/string-formatter.helper";
import { z } from "zod";
import { FichaInputData } from "../types/ficha-from-input";

// Função para buscar todas as fichas no banco de dados (Back-end)
async function getFichas(logger: LoggerHelper): Promise<IFicha[]> {
  try {
    const fichas = await Ficha.find().sort({ criadoEm: -1 });
    logger.log(
      "INFO",
      "Fichas buscadas com sucesso no banco.(buscarTodasAsFichas())",
    );
    return fichas;
  } catch (e: any) {
    logger.log("ERROR", `Erro ao buscar fichas no banco: ${e.message}`);
    return [];
  }
}

async function buscarFichasPorNome(
  nome: string,
  logger: LoggerHelper,
): Promise<IFicha[]> {
  try {
    // Remove acentos e normaliza o termo de busca
    const termoNormalizado = StringFormatter.normalize(nome);
    const regexComAcentos = StringFormatter.normalizedTerm(termoNormalizado);

    const fichas = await Ficha.find({
      nome: {
        $regex: new RegExp(regexComAcentos, "i"),
      },
    }).sort({ criadoEm: -1 });

    logger.log(
      "INFO",
      "Fichas buscadas com sucesso no banco.(buscarFichasPorNome())",
    );
    return fichas;
  } catch (e: any) {
    logger.log("ERROR", `Erro ao buscar fichas no banco: ${e.message}`);
    return [];
  }
}

async function createFicha(
  ficha: FichaInputData,
  logger: LoggerHelper,
): Promise<IFicha | null> {
  try {
    const fichaSalva = await Ficha.create({
      nome: ficha.nome,
      email: ficha.email,
      criadoEm: new Date(),
      peso: ficha.peso,
      peito: ficha.peito,
      abdomen: ficha.abdomen,
      ombros: ficha.ombros,
      quadricepsEsquerdo: ficha.quadricepsEsquerdo,
      quadricepsDireito: ficha.quadricepsDireito,
      panturrilhaEsquerda: ficha.panturrilhaEsquerda,
      panturrilhaDireita: ficha.panturrilhaDireita,
      bicepsEsquerdo: ficha.bicepsEsquerdo,
      bicepsDireito: ficha.bicepsDireito,
    });
    logger.log("INFO", `[${ficha.nome}] Ficha salva com sucesso.`);
    return fichaSalva;
  } catch (e: any) {
    logger.log("ERROR", `[${ficha.nome}] Erro ao salvar ficha: ${e.message}`);
    return null;
  }
}

export const fichaService = {
  createFicha,
  getFichas,
  buscarFichasPorNome,
};
