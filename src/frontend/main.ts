import { toggleMenu } from "./toggle-menu";
import Fichas from "./fichas";

document.addEventListener("DOMContentLoaded", () => {
  toggleMenu();
  Fichas.initCadastroFicha();
  Fichas.initListagemFichas();
  Fichas.initEditarFicha();
});
