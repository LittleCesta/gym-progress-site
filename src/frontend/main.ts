import { toggleMenu } from "./toggle-menu";
import { initCadastroFicha } from "./cadastro-fichas";
import {
  buscarTodasAsFichas,
  buscarFichaEspecifica,
  deletarFicha,
} from "./get-fichas";

document.addEventListener("DOMContentLoaded", () => {
  toggleMenu();

  const formCadastro = document.querySelector("#form-ficha");
  if (formCadastro) {
    initCadastroFicha();
  }

  const containerFichas: HTMLElement | null =
    document.querySelector(".lista-fichas");

  if (containerFichas) {
    const searchFichasButton: HTMLButtonElement | null =
      document.querySelector(".btn-search");
    const searchFichasInput: HTMLInputElement | null =
      document.querySelector("#search-bar");

    searchFichasButton!.addEventListener("click", () => {
      const termo = searchFichasInput!.value.trim();
      if (termo !== "") {
        buscarFichaEspecifica(containerFichas, termo);
      } else {
        buscarTodasAsFichas(containerFichas);
      }
    });

    searchFichasInput!.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const termo = searchFichasInput!.value.trim();
        if (termo !== "") {
          buscarFichaEspecifica(containerFichas, termo);
        } else {
          buscarTodasAsFichas(containerFichas);
        }
      }
    });

    containerFichas.addEventListener("click", (e: MouseEvent) => {
      const alvo = e.target;

      if (
        alvo instanceof HTMLElement &&
        alvo.classList.contains("btn-excluir")
      ) {
        const idFicha = alvo.getAttribute("data-id");

        if (idFicha && confirm("Deseja mesmo excluir esta ficha?")) {
          deletarFicha(idFicha);
        }
      }
    });
  }
});
