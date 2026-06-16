import { toggleMenu } from "./toggle-menu";
import { initCadastroFicha } from "./cadastro-fichas";
import { buscarTodasAsFichas, buscarFichaEspecifica } from "./get-fichas";

document.addEventListener("DOMContentLoaded", () => {
  toggleMenu();

  const formCadastro = document.querySelector("#form-ficha");
  if (formCadastro) {
    initCadastroFicha();
  }

  const containerFichas: HTMLElement = document.querySelector(".lista-fichas");
  if (containerFichas) {
    const searchFichasButton: HTMLButtonElement =
      document.querySelector(".btn-search");
    const searchFichasInput: HTMLInputElement =
      document.querySelector("#search-bar");

    searchFichasButton.addEventListener("click", () => {
      const termo = searchFichasInput.value.trim();
      if (termo !== "") {
        buscarFichaEspecifica(containerFichas, termo);
      } else {
        buscarTodasAsFichas(containerFichas);
      }
    });

    searchFichasButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const termo = searchFichasInput.value.trim();
        if (termo !== "") {
          buscarFichaEspecifica(containerFichas, termo);
        } else {
          buscarTodasAsFichas(containerFichas);
        }
      }
    });
  }
});
