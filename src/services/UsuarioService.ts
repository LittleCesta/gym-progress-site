import Usuario, { IUsuario } from "../models/UsuarioModel";
import LoggerHelper from "../shared/utils/logger";
import StringFormatter from "../helpers/string-formatter.helper";
import { UsuarioInputData } from "../types/usuario-from-input";

// Função para buscar todas as Usuarios no banco de dados (Back-end)
async function getUsuarios(logger: LoggerHelper): Promise<IUsuario[]> {
  try {
    const usuarios = await Usuario.find().sort({ criadoEm: -1 });
    logger.log(
      "INFO",
      "Usuarios buscados com sucesso no banco.(buscarTodasOsUsuarios())",
    );
    return usuarios;
  } catch (e: any) {
    logger.log("ERROR", `Erro ao buscar Usuarios no banco: ${e.message}`);
    return [];
  }
}

async function buscarUsuariosPorEmail(
  email: string,
  logger: LoggerHelper,
): Promise<IUsuario[]> {
  try {
    // Remove acentos e normaliza o termo de busca
    const termoNormalizado = StringFormatter.normalize(email);
    const regexComAcentos = StringFormatter.normalizedTerm(termoNormalizado);

    const usuarios = await Usuario.find({
      nome: {
        $regex: new RegExp(regexComAcentos, "i"),
      },
    }).sort({ criadoEm: -1 });

    logger.log(
      "INFO",
      "Usuarios buscadas com sucesso no banco.(buscarUsuariosPorNome())",
    );
    return usuarios;
  } catch (e: any) {
    logger.log("ERROR", `Erro ao buscar Usuarios no banco: ${e.message}`);
    return [];
  }
}

async function createUsuario(
  usuario: UsuarioInputData,
  logger: LoggerHelper,
): Promise<IUsuario | null> {
  try {
    const usuarioSalvo = await Usuario.create({
      email: usuario.email,
      senha: usuario.senha,
      criadoEm: new Date(),
    });
    logger.log("INFO", `[${usuario.email}] usuário salvo com sucesso.`);
    return usuarioSalvo;
  } catch (e: any) {
    logger.log(
      "ERROR",
      `[${usuario.email}] Erro ao salvar Usuario: ${e.message}`,
    );
    return null;
  }
}

async function deletarUsuario(
  idUsuario: string,
  logger: LoggerHelper,
): Promise<boolean> {
  try {
    const resultado = await Usuario.deleteOne({ _id: idUsuario });

    if (resultado.deletedCount === 0) {
      logger.log("WARN", `Nenhuma Usuario encontrada com o ID`);
      return false;
    }

    logger.log("INFO", `Usuario deletada com sucesso do banco.`);
    return true;
  } catch (e: any) {
    logger.log("ERROR", `Erro ao deletar Usuario no banco: ${e.message}`);
    return false;
  }
}

export const usuarioService = {
  createUsuario,
  getUsuarios,
  buscarUsuariosPorEmail,
  deletarUsuario,
};
