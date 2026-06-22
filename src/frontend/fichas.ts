import DateFormatterHelper from "../helpers/date-formatter.helper";
import HtmlFormatter from "../helpers/html-formatter.helper";
import ErrorFormatterHelper from "../helpers/error-formatter.helper";
import { IFicha } from "../models/FichaModel";

const noResultDiv =
  "<div class='no-results'><p>Nenhuma ficha encontrada no banco de dados.</p></div>";

const cardFicha = (ficha: IFicha, letra: string) => {
  return `
        <div class="ficha-card" view-transition-class="ficha-card" data-letra="${letra}">
          <div class="div-ficha-card-text">    
            <h3>${HtmlFormatter.escapeHtml(ficha.nome)} - ${DateFormatterHelper.formatDateAndTime(new Date(ficha.criadoEm))}</h3>
            <p><strong>Email:</strong> ${HtmlFormatter.escapeHtml(ficha.email)}</p>
            <p><strong>Peso:</strong> ${ficha.peso} kg</p>
            <p><strong>Peito:</strong> ${ficha.peito} cm</p>
            <p><strong>Abdômen:</strong> ${ficha.abdomen} cm</p>
            <p><strong>Ombros:</strong> ${ficha.ombros} cm</p>
            <p><strong>Quadríceps Esq.:</strong> ${ficha.quadricepsEsquerdo} cm</p>
            <p><strong>Quadríceps Dir.:</strong> ${ficha.quadricepsDireito} cm</p>
            <p><strong>Panturrilha Esq.:</strong> ${ficha.panturrilhaEsquerda} cm</p>
            <p><strong>Panturrilha Dir.:</strong> ${ficha.panturrilhaDireita} cm</p>
            <p><strong>Bíceps Esq.:</strong> ${ficha.bicepsEsquerdo} cm</p>
            <p><strong>Bíceps Dir.:</strong> ${ficha.bicepsDireito} cm</p>
          </div>
          <div class="div-ficha-card-buttons">
            <button class="btn-excluir" data-id="${ficha._id}" data-nome="${HtmlFormatter.escapeHtml(ficha.nome)}">
              <ion-icon name="trash-outline"></ion-icon>
            </button>
            <button class="btn-editar" data-id="${ficha._id}" onclick="window.location.href='/editar-ficha-salva/${ficha._id}'">
              <ion-icon name="create-outline"></ion-icon>
            </button>
          </div>
        </div>
      `;
};

// ===== RENDERIZAÇÃO =====
export default class Fichas {
  static async buscarTodasAsFichas(container: HTMLElement) {
    try {
      const response = await fetch("/api/listar-fichas");

      if (!response.ok) {
        throw new Error("Erro ao buscar fichas do servidor");
      }

      const fichas: IFicha[] = await response.json();

      if (!container) return;

      container.innerHTML = "";

      if (fichas.length === 0) {
        container.innerHTML = noResultDiv;
        return;
      }

      fichas.sort((a, b) => a.nome.localeCompare(b.nome));

      const fichasPorLetra: { [key: string]: IFicha[] } = {};
      fichas.forEach((ficha) => {
        const primeiraLetra = ficha.nome[0].toUpperCase();
        if (!fichasPorLetra[primeiraLetra]) {
          fichasPorLetra[primeiraLetra] = [];
        }
        fichasPorLetra[primeiraLetra].push(ficha);
      });

      Object.keys(fichasPorLetra)
        .sort()
        .forEach((letra) => {
          const fichas = fichasPorLetra[letra];
          const section = document.createElement("section");
          section.classList.add("section-fichas");
          section.id = letra;
          section.setAttribute("data-letra", letra);

          const cardsGrid = document.createElement("div");
          cardsGrid.classList.add("cards-grid");

          fichas.forEach((ficha) => {
            cardsGrid.insertAdjacentHTML("beforeend", cardFicha(ficha, letra));
          });
          section.appendChild(cardsGrid);
          container.appendChild(section);
        });
    } catch (erro) {
      console.error("Erro ao conectar com a API:", erro);
    }
  }

  static async buscarFichaEspecifica(
    container: HTMLElement,
    fichaName: string,
  ) {
    try {
      const response = await fetch(
        `/api/listar-ficha-especifica/nome/${encodeURIComponent(fichaName)}`,
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar ficha por nome");
      }

      const fichas: IFicha[] = await response.json();

      if (!container) return;

      container.innerHTML = "";

      if (fichas.length === 0) {
        container.innerHTML = noResultDiv;
        return;
      }

      fichas.sort((a, b) => a.nome.localeCompare(b.nome));
      const section = document.createElement("section");
      section.classList.add("section-fichas");

      const letra = fichaName[0].toUpperCase();
      section.id = letra;
      section.setAttribute("data-letra", letra);

      const cardsGrid = document.createElement("div");
      cardsGrid.classList.add("cards-grid");

      fichas.forEach((ficha) => {
        cardsGrid.insertAdjacentHTML("beforeend", cardFicha(ficha, letra));
      });
      section.appendChild(cardsGrid);
      container.appendChild(section);
    } catch (erro) {
      console.error("Erro ao conectar com a API:", erro);
    }
  }

  // ===== EXCLUSÃO =====

  static async deletarFicha(idFicha: string) {
    try {
      const response = await fetch(`/api/deletar-ficha/${idFicha}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Ficha deletada com sucesso!");
        window.location.reload();
      } else {
        const erro = await response.json();
        alert(`Erro: ${erro.error}`);
      }
    } catch (erro) {
      console.error("Falha na requisição:", erro);
    }
  }
  static async editarFicha(idFicha: string, dadosParaEnviar: object) {
    try {
      const response = await fetch(`/api/editar-ficha/${idFicha}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (response.ok) {
        alert("Ficha editada com sucesso!");
        window.location.href = "/fichas-salvas";
      } else {
        const erro = await response.json();
        alert(`Erro ao editar ficha: ${erro.error}`);
      }
    } catch (erro) {
      console.error("Falha na requisição:", erro);
    }
  }

  // ===== CADASTRO =====

  static initCadastroFicha() {
    const formulario = document.querySelector(
      ".form-cadastro-ficha",
    ) as HTMLFormElement;
    if (!formulario) {
      console.log("Formulário não encontrado nesta página. Função ignorada.");
      return;
    }

    formulario.addEventListener("submit", async (event) => {
      event.preventDefault();

      const dadosParaEnviar = {
        nome:
          (document.getElementById("nome") as HTMLInputElement)?.value || "",
        email:
          (document.getElementById("email") as HTMLInputElement)?.value || "",
        peso: Number(
          (document.getElementById("peso") as HTMLInputElement)?.value || 0,
        ),
        peito: Number(
          (document.getElementById("peito") as HTMLInputElement)?.value || 0,
        ),
        abdomen: Number(
          (document.getElementById("abdomen") as HTMLInputElement)?.value || 0,
        ),
        ombros: Number(
          (document.getElementById("ombros") as HTMLInputElement)?.value || 0,
        ),
        quadricepsEsquerdo: Number(
          (document.getElementById("quadriceps-esquerdo") as HTMLInputElement)
            ?.value || 0,
        ),
        quadricepsDireito: Number(
          (document.getElementById("quadriceps-direito") as HTMLInputElement)
            ?.value || 0,
        ),
        panturrilhaEsquerda: Number(
          (document.getElementById("panturrilha-esquerda") as HTMLInputElement)
            ?.value || 0,
        ),
        panturrilhaDireita: Number(
          (document.getElementById("panturrilha-direita") as HTMLInputElement)
            ?.value || 0,
        ),
        bicepsEsquerdo: Number(
          (document.getElementById("biceps-esquerdo") as HTMLInputElement)
            ?.value || 0,
        ),
        bicepsDireito: Number(
          (document.getElementById("biceps-direito") as HTMLInputElement)
            ?.value || 0,
        ),
      };

      try {
        const response = await fetch("/api/salvar-ficha", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosParaEnviar),
        });

        if (response.ok) {
          alert("Ficha cadastrada com sucesso no MongoDB!");
          formulario.reset();
          window.location.href = "/fichas-salvas";
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

  static initListagemFichas() {
    const containerFichas: HTMLElement | null =
      document.querySelector(".lista-fichas");

    if (!containerFichas) {
      console.log("Container de fichas não encontrado. Função ignorada.");
      return;
    }

    const searchFichasButton: HTMLButtonElement | null =
      document.querySelector(".btn-search");
    const searchFichasInput: HTMLInputElement | null =
      document.querySelector("#search-bar");

    const realizarBusca = () => {
      const termo = searchFichasInput?.value.trim() ?? "";
      if (termo !== "") {
        this.buscarFichaEspecifica(containerFichas, termo);
      } else {
        this.buscarTodasAsFichas(containerFichas);
      }
    };

    searchFichasButton?.addEventListener("click", realizarBusca);

    searchFichasInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        realizarBusca();
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
          this.deletarFicha(idFicha);
        }
      }
    });
  }

  static initEditarFicha() {
    const formulario = document.querySelector(
      ".form-editar-ficha",
    ) as HTMLFormElement | null;

    if (!formulario) {
      console.log("Formulário não encontrado nesta página. Função ignorada.");
      return;
    }

    const idFicha = formulario.getAttribute("data-id");

    if (!idFicha) {
      console.log("ID da ficha não encontrado no formulário. Função ignorada.");
      return;
    }

    formulario.addEventListener("submit", async (event) => {
      event.preventDefault();

      const dadosParaEnviar = {
        nome:
          (document.getElementById("nome") as HTMLInputElement)?.value || "",
        email:
          (document.getElementById("email") as HTMLInputElement)?.value || "",
        peso: Number(
          (document.getElementById("peso") as HTMLInputElement)?.value || 0,
        ),
        peito: Number(
          (document.getElementById("peito") as HTMLInputElement)?.value || 0,
        ),
        abdomen: Number(
          (document.getElementById("abdomen") as HTMLInputElement)?.value || 0,
        ),
        ombros: Number(
          (document.getElementById("ombros") as HTMLInputElement)?.value || 0,
        ),
        quadricepsEsquerdo: Number(
          (document.getElementById("quadriceps-esquerdo") as HTMLInputElement)
            ?.value || 0,
        ),
        quadricepsDireito: Number(
          (document.getElementById("quadriceps-direito") as HTMLInputElement)
            ?.value || 0,
        ),
        panturrilhaEsquerda: Number(
          (document.getElementById("panturrilha-esquerda") as HTMLInputElement)
            ?.value || 0,
        ),
        panturrilhaDireita: Number(
          (document.getElementById("panturrilha-direita") as HTMLInputElement)
            ?.value || 0,
        ),
        bicepsEsquerdo: Number(
          (document.getElementById("biceps-esquerdo") as HTMLInputElement)
            ?.value || 0,
        ),
        bicepsDireito: Number(
          (document.getElementById("biceps-direito") as HTMLInputElement)
            ?.value || 0,
        ),
      };

      this.editarFicha(idFicha, dadosParaEnviar);
    });
  }
}
