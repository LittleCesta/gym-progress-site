export default class ErrorFormatterHelper {
  static formatarErrosValidacao(
    erros: { path: string[]; message: string }[],
  ): string {
    const NOMES_CAMPOS: Record<string, string> = {
      nome: "Nome",
      email: "E-mail",
      peso: "Peso",
      peito: "Peito",
      abdomen: "Abdômen",
      ombros: "Ombros",
      quadricepsEsquerdo: "Quadríceps Esquerdo",
      quadricepsDireito: "Quadríceps Direito",
      panturrilhaEsquerda: "Panturrilha Esquerda",
      panturrilhaDireita: "Panturrilha Direita",
      bicepsEsquerdo: "Bíceps Esquerdo",
      bicepsDireito: "Bíceps Direito",
    };
    return erros
      .map((item) => {
        const campoTecnico = item.path?.[0] ?? "";
        const nomeAmigavel =
          NOMES_CAMPOS[campoTecnico] || campoTecnico || "Campo";
        return `• ${nomeAmigavel}: ${item.message}`;
      })
      .join("\n");
  }
}
