import Ficha, { IFicha } from "../models/Ficha";
import LoggerHelper from "../utils/logger";

// Função para buscar todas as fichas no banco de dados (Back-end)
async function getFichas(logger: LoggerHelper): Promise<IFicha[]> {
  try {
    const fichas = await Ficha.find().sort({ criadoEm: -1 });
    logger.log("INFO", "Fichas buscadas com sucesso no banco.");
    return fichas;
  } catch (e: any) {
    logger.log("ERROR", `Erro ao buscar fichas no banco: ${e.message}`);
    return [];
  }
}

async function createFicha(
  ficha: IFicha,
  logger: LoggerHelper,
): Promise<IFicha | null> {
  try {
    const fichaSalva = await Ficha.create({
      fichaId: ficha.fichaId,
      nome: ficha.nome,
      email: ficha.email,
      criadoEm: ficha.criadoEm,
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

// Exportando os métodos do serviço
export const fichaService = {
  createFicha,
  getFichas,
};
