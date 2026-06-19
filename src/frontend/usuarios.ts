import DateFormatterHelper from "../helpers/date-formatter.helper";
import HtmlFormatter from "../helpers/html-formatter.helper";
import ErrorFormatterHelper from "../helpers/error-formatter.helper";
import { IUsuario } from "../models/UsuarioModel";

const noResultDiv =
  "<div class='no-results'><p>Nenhuma ficha encontrada no banco de dados.</p></div>";

const cardFicha = (usuario: IUsuario) => {
  return `
        <div class="ficha-card" view-transition-class="ficha-card">
          <div class="div-ficha-card-text">    
            <h3>${HtmlFormatter.escapeHtml(usuario.email)} - ${DateFormatterHelper.formatDateAndTime(new Date(usuario.criadoEm))}</h3>
          </div>
          <div class="div-ficha-card-buttons">
            <button class="btn-excluir" data-id="${usuario._id}">
              <ion-icon name="trash-outline"></ion-icon>
            </button>
            <button class="btn-editar" data-id="${usuario._id}">
              <ion-icon name="create-outline"></ion-icon>
            </button>
          </div>
        </div>
      `;
};

// ===== RENDERIZAÇÃO =====
export default class Usuarios {
  static async buscarTodasOsUsuarios(container: HTMLElement) {
    try {
      const response = await fetch("/api/listar-usuarios");

      if (!response.ok) {
        throw new Error("Erro ao buscar usuarios do servidor");
      }

      const usuarios: IUsuario[] = await response.json();

      if (!container) return;

      container.innerHTML = "";

      if (usuarios.length === 0) {
        container.innerHTML = noResultDiv;
        return;
      }

      usuarios.sort((a, b) => a.email.localeCompare(b.email));

      const cardsGrid = document.createElement("div");
      cardsGrid.classList.add("cards-grid");

      const section = document.createElement("section");
      section.classList.add("section-fichas");
      // section.id = letra;
      // section.setAttribute("data-letra", letra);
      usuarios.forEach((usuario) => {
        cardsGrid.insertAdjacentHTML("beforeend", cardFicha(usuario));
      });
      section.appendChild(cardsGrid);
      container.appendChild(section);
    } catch (erro) {
      console.error("Erro ao conectar com a API:", erro);
    }
  }

  static async buscarUsuarioEspecifico(
    container: HTMLElement,
    emailUsuario: string,
  ) {
    try {
      const response = await fetch(
        `/api/listar-usuario-especifico/${encodeURIComponent(emailUsuario)}`,
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar usuario por email");
      }

      const usuarios: IUsuario[] = await response.json();

      if (!container) return;

      container.innerHTML = "";

      if (usuarios.length === 0) {
        container.innerHTML = noResultDiv;
        return;
      }

      usuarios.sort((a, b) => a.email.localeCompare(b.email));
      const section = document.createElement("section");
      section.classList.add("section-fichas");

      const letra = emailUsuario[0].toUpperCase();
      section.id = letra;
      section.setAttribute("data-letra", letra);

      const cardsGrid = document.createElement("div");
      cardsGrid.classList.add("cards-grid");

      usuarios.forEach((usuario) => {
        cardsGrid.insertAdjacentHTML("beforeend", cardFicha(usuario));
      });
      section.appendChild(cardsGrid);
      container.appendChild(section);
    } catch (erro) {
      console.error("Erro ao conectar com a API:", erro);
    }
  }

  // ===== EXCLUSÃO =====

  static async deletarUsuario(idUsuario: string) {
    try {
      const response = await fetch(`/api/deletar-usuario/${idUsuario}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Usuario deletada com sucesso!");
        window.location.reload();
      } else {
        const erro = await response.json();
        alert(`Erro: ${erro.error}`);
      }
    } catch (erro) {
      console.error("Falha na requisição:", erro);
    }
  }

  // ===== CADASTRO =====

  static initCadastroUsuario() {
    const formulario = document.querySelector("form");
    if (!formulario) {
      console.log("Formulário não encontrado nesta página. Função ignorada.");
      return;
    }

    formulario.addEventListener("submit", async (event) => {
      event.preventDefault();

      const dadosParaEnviar = {
        email:
          (document.getElementById("email") as HTMLInputElement)?.value || "",
        senha:
          (document.getElementById("senha") as HTMLInputElement)?.value || "",
      };

      try {
        const response = await fetch("/api/salvar-usuario", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosParaEnviar),
        });

        if (response.ok) {
          alert("Usuario cadastrado com sucesso no MongoDB!");
          formulario.reset();
          window.location.href = "/usuarios-salvos";
        } else {
          const erro = await response.json();

          if (erro.error && Array.isArray(erro.error)) {
            const mensagens = ErrorFormatterHelper.formatarErrosValidacao(
              erro.error,
            );
            alert(`Falha ao cadastrar:\n${mensagens}`);
          } else {
            alert(`Falha ao cadastrar: ${erro.message || "Erro desconhecido"}`);
          }
        }
      } catch (error) {
        console.error("Erro ao enviar requisição:", error);
        alert("Não foi possível conectar ao servidor.");
      }
    });
  }

  static initListagemUsuarios() {
    const containerUsuarios: HTMLElement | null =
      document.querySelector(".lista-usuarios");

    if (!containerUsuarios) {
      console.log("Container de fichas não encontrado. Função ignorada.");
      return;
    }

    const searchUsuariosButton: HTMLButtonElement | null =
      document.querySelector(".btn-search");
    const searchUsuariosInput: HTMLInputElement | null =
      document.querySelector("#search-bar");

    const realizarBusca = () => {
      const termo = searchUsuariosInput?.value.trim() ?? "";
      if (termo !== "") {
        this.buscarUsuarioEspecifico(containerUsuarios, termo);
      } else {
        this.buscarTodasOsUsuarios(containerUsuarios);
      }
    };

    searchUsuariosButton?.addEventListener("click", realizarBusca);

    searchUsuariosInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        realizarBusca();
      }
    });

    containerUsuarios.addEventListener("click", (e: MouseEvent) => {
      const alvo = e.target;

      if (
        alvo instanceof HTMLElement &&
        alvo.classList.contains("btn-excluir")
      ) {
        const idUsuario = alvo.getAttribute("data-id");

        if (idUsuario && confirm("Deseja mesmo excluir esta ficha?")) {
          this.deletarUsuario(idUsuario);
        }
      }
    });
  }
}
