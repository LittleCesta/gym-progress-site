import { toggleMenu } from "./toggle-menu";
import { initCadastroFicha } from "./cadastro-fichas";
import { initListarFichas } from "./get-fichas";

document.addEventListener("DOMContentLoaded", () => {
  toggleMenu();

  const formCadastro = document.querySelector("#form-ficha");
  if (formCadastro) {
    initCadastroFicha();
  }

  const containerFichas: HTMLElement = document.querySelector(".lista-fichas");
  if (containerFichas) {
    initListarFichas(containerFichas);
  }
});
