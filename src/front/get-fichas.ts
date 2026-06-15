import DateFormatterHelper from "../helpers/date-formatter.helper";
import { IFicha } from "../models/Ficha";

// const resultBox = document.querySelector(".results") as HTMLElement;
// const resultUl = document.querySelector(".result ul") as HTMLElement;
// const inputBox = document.querySelector(".search-bar") as HTMLInputElement;

export async function initListarFichas(container: HTMLElement) {
  try {
    const response = await fetch("/api/fichas");

    if (!response.ok) {
      throw new Error("Erro ao buscar fichas do servidor");
    }

    const fichas: IFicha[] = await response.json();

    // Alinhando com a classe do seu HTML (.lista-fichas)
    if (!container) return;

    container.innerHTML = "";

    if (fichas.length === 0) {
      container.innerHTML =
        "<p>Nenhuma ficha encontrada no banco de dados.</p>";
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
      .sort() // Ordena as letras
      .forEach((letra) => {
        const fichas = fichasPorLetra[letra];
        const section = document.createElement("section");
        section.classList.add("section-fichas");
        section.id = letra;
        // Adiciona a letra via data-letra (CSS ::before já cuida disso)
        section.setAttribute("data-letra", letra);

        // Cria o container de grid para os cards
        const cardsGrid = document.createElement("div");
        cardsGrid.classList.add("cards-grid");

        fichas.forEach((ficha) => {
          cardsGrid.insertAdjacentHTML(
            "beforeend",
            `
        <div class="ficha-card" view-transition-class="ficha-card">    
          <h3>${ficha.nome} - ${DateFormatterHelper.formatDateAndTime(new Date(ficha.criadoEm))}</h3>
          <p><strong>Email:</strong> ${ficha.email}</p>
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
          <button class="btn-excluir" data-nome="${ficha.nome}" data-letra="${letra}">
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </div>
      `,
          );
        });
        section.appendChild(cardsGrid);
        container.appendChild(section);
      });
  } catch (erro) {
    console.error("Erro ao conectar com a API:", erro);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".lista-fichas");

  if (!(container instanceof HTMLElement)) {
    return;
  }

  initListarFichas(container);
});

// @todo Ajustar parte de buscar ficha, criar rota na api
// function selecionarFicha(element: HTMLElement, nome: string): void {
//   if (!inputBox) return;
//   inputBox.value = nome;
//   if (!resultBox) return;
//   resultBox.innerHTML = ""; // Esconde a lista
//   inputBox.focus();

//   // Rolar até o primeiro card com esse nome
//   const cards = document.querySelectorAll(".ficha-card h3");
//   let targetCard: HTMLElement | null = null;

//   for (const card of cards) {
//     if (card.textContent && card.textContent.includes(nome)) {
//       targetCard = card.parentElement as HTMLElement; // .ficha-card
//       break;
//     }
//   }

//   // 📌 Rola até o card
//   if (targetCard) {
//     targetCard.scrollIntoView({ behavior: "smooth", block: "center" });

//     // 💡 Adiciona destaque
//     targetCard.style.transition = "all 0.3s";
//     targetCard.style.transform = "scale(1.02)";
//     targetCard.style.boxShadow = "0 0 15px rgba(164, 25, 61, 0.5)";

//     // Remove após 2 segundos
//     setTimeout(() => {
//       targetCard.style.transform = "";
//       targetCard.style.boxShadow = "";
//     }, 2000);
//   }
// }

// // Exibe os resultados da busca
// const displayResults = function (result: string[]): void {
//   if (result.length === 0) {
//     resultBox.innerHTML = "";
//     return;
//   }

//   const resultHTML = result
//     .map((nome, index) => {
//       return `
//       <li role="option" tabindex="0" data-nome="${nome}">
//         ${nome}
//       </li>
//     `;
//     })
//     .join("");

//   resultBox.innerHTML = `<ul role="listbox">${resultHTML}</ul>`;

//   // Adiciona os listeners AQUI, depois de criar os elementos
//   resultBox.querySelectorAll("li").forEach((li) => {
//     li.addEventListener("click", () => {
//       const nome = li.getAttribute("data-nome");
//       if (nome) {
//         inputBox.value = nome;
//         resultBox.innerHTML = "";
//         inputBox.focus();
//         selecionarFicha(li, nome);
//       }
//     });
//   });
// };

// // Evento de digitação
// inputBox.addEventListener("keyup", function (e: KeyboardEvent) {
//   const input = inputBox.value.trim().toLowerCase();

//   if (input.length === 0) {
//     resultBox.innerHTML = "";
//     return;
//   }

//   // Achata e filtra os nomes
//   const todasFichas: Ficha[] = fichaDados.flat();

//   // Tranformamos o array de nomes filtrados em um set para tirar os duplicados
//   const nomesFiltradosUnicos = [
//     ...new Set(
//       todasFichas
//         .map((f) => f.nome)
//         .filter((nome) => nome.toLowerCase().startsWith(input)),
//     ),
//   ];

//   displayResults(nomesFiltradosUnicos);
// });

// // (Opcional) Fechar a lista com ESC
// inputBox.addEventListener("keydown", function (e: KeyboardEvent) {
//   if (e.key === "Escape") {
//     resultBox.innerHTML = "";
//   }
// });

/* function renderizar() {
  lista.innerHTML = ""; // Limpa a lista

  // Achata o array de fichas (caso esteja em arrays aninhados)
  const todasFichas: Ficha[] = fichaDados.flat();

  // Ordena alfabeticamente pelo nome
  todasFichas.sort((a, b) => a.nome.localeCompare(b.nome));

  // Agrupa por letra inicial
  const fichasPorLetra:{[key: string]: Ficha[]} = {};
  todasFichas.forEach(ficha => {
    const primeiraLetra = ficha.nome[0].toUpperCase();
    if (!fichasPorLetra[primeiraLetra]) {
      fichasPorLetra[primeiraLetra] = [];
    }
    fichasPorLetra[primeiraLetra].push(ficha);
  });

  // Renderiza cada grupo de letras que existem
  Object.keys(fichasPorLetra)
    .sort() // Ordena as letras
    .forEach(letra => {
      const fichas = fichasPorLetra[letra];
      const section = document.createElement("section");
      section.classList.add("section-fichas");
      section.id = letra;
      // Adiciona a letra via data-letra (CSS ::before já cuida disso)
      section.setAttribute("data-letra", letra);

      // Cria o container de grid para os cards
      const cardsGrid = document.createElement("div");
      cardsGrid.classList.add("cards-grid");

      fichas.forEach((fichaDaPessoa) => {
        cardsGrid.insertAdjacentHTML("beforeend", `
          <div class="ficha-card" view-transition-class="ficha-card">
            <h3>${fichaDaPessoa.nome} - ${formatDate(fichaDaPessoa.data)}</h3>
            <p><strong>Email:</strong> ${fichaDaPessoa.email}</p>
            <p><strong>Peso:</strong> ${fichaDaPessoa.peso} kg</p>
            <p><strong>Peito:</strong> ${fichaDaPessoa.peito} cm</p>
            <p><strong>Abdômen:</strong> ${fichaDaPessoa.abdomen} cm</p>
            <p><strong>Ombros:</strong> ${fichaDaPessoa.ombros} cm</p>
            <p><strong>Quadríceps Esq.:</strong> ${fichaDaPessoa.quadricepsEsquerdo} cm</p>
            <p><strong>Quadríceps Dir.:</strong> ${fichaDaPessoa.quadricepsDireito} cm</p>
            <p><strong>Panturrilha Esq.:</strong> ${fichaDaPessoa.panturrilhaEsquerda} cm</p>
            <p><strong>Panturrilha Dir.:</strong> ${fichaDaPessoa.panturrilhaDireita} cm</p>
            <p><strong>Bíceps Esq.:</strong> ${fichaDaPessoa.bicepsEsquerdo} cm</p>
            <p><strong>Bíceps Dir.:</strong> ${fichaDaPessoa.bicepsDireito} cm</p>
            <button class="btn-excluir" data-nome="${fichaDaPessoa.nome}" data-letra="${letra}">
              <ion-icon name="trash-outline"></ion-icon>
            </button>
          </div>
        `);
      });

      // Adiciona o grid de cards à seção
      section.appendChild(cardsGrid);
      lista.appendChild(section);
      });
}

lista.addEventListener("click", (e: MouseEvent) => {
  const btn = (e.target as HTMLElement).closest(".btn-excluir") as HTMLButtonElement;
  if (!btn) return;

  const nome = btn.dataset.nome;
  const letra = btn.dataset.letra;

  if (!nome || !letra) return;

  if (!document.startViewTransition) {
    remover(nome, letra);
    return;
  }

  const card = btn.closest(".ficha-card") as HTMLElement;
  card.style.viewTransitionName = "targeted-card";

  document.startViewTransition(() => {
    remover(nome, letra);
  });
});

renderizar() */
