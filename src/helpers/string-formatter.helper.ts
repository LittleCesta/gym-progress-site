export default class StringFormatter {
  static normalize(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  static normalizedTerm(termo: string) {
    return termo
      .split("")
      .map((char) => {
        const variacoes: Record<string, string> = {
          a: "[aáàâãäå]",
          e: "[eéèêë]",
          i: "[iíìîï]",
          o: "[oóòôõö]",
          u: "[uúùûü]",
          c: "[cç]",
          n: "[nñ]",
          A: "[AÁÀÂÃÄÅa]",
          E: "[EÉÈÊËe]",
          I: "[IÍÌÎÏi]",
          O: "[OÓÒÔÕÖo]",
          U: "[UÚÙÛÜu]",
          C: "[CÇc]",
          N: "[NÑn]",
        };
        return variacoes[char] ?? char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      })
      .join("");
  }
}
