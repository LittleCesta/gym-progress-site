import { gerarDadosFicticios } from "./gerar-dados-ficticios.js"
import { formatDate } from "./data-formatter.js"

interface Medidas {
    peso: number;
    peito: number;
    abdomen: number;
    ombros: number;
    quadricepsEsquerdo: number;
    quadricepsDireito: number;
    panturrilhaEsquerda: number;
    panturrilhaDireita: number;
    bicepsEsquerdo: number;
    bicepsDireito: number;
}

interface Ficha extends Medidas {
    nome: string;
    email: string;
    data: Date;
}

// let fichaDados: Ficha[][] = JSON.parse(localStorage.getItem("fichas")) || []
let fichaDados: Ficha[][] = gerarDadosFicticios(10, 5) ?? [];

const lista = document.querySelector(".lista-fichas") as HTMLElement;
const resultBox = document.querySelector(".results") as HTMLElement;
const resultUl = document.querySelector(".result ul") as HTMLElement;
const inputBox = document.querySelector(".search-bar") as HTMLInputElement;

// function remover(index) {
//   fichaDados.splice(index, 1)
//   localStorage.setItem("fichas", JSON.stringify(fichaDados))
//   renderizar()
// }

function selecionarFicha(element: HTMLElement, nome: string): void {
  if (!inputBox) return;
  inputBox.value = nome;
  if (!resultBox) return;
  resultBox.innerHTML = ""; // Esconde a lista
  inputBox.focus();

  // Rolar até o primeiro card com esse nome
  const cards = document.querySelectorAll(".ficha-card h3");
  let targetCard: HTMLElement | null = null;

  for (const card of cards) {
    if (card.textContent && card.textContent.includes(nome)) {
      targetCard = card.parentElement as HTMLElement; // .ficha-card
      break;
    }
  }

  // 📌 Rola até o card
  if (targetCard) {
    targetCard.scrollIntoView({ behavior: "smooth", block: "center" });

    // 💡 Adiciona destaque
    targetCard.style.transition = "all 0.3s";
    targetCard.style.transform = "scale(1.02)";
    targetCard.style.boxShadow = "0 0 15px rgba(164, 25, 61, 0.5)";

    // Remove após 2 segundos
    setTimeout(() => {
      targetCard.style.transform = "";
      targetCard.style.boxShadow = "";
    }, 2000);
  }
}

// Exibe os resultados da busca
const displayResults = function (result: string[]): void {
  if (result.length === 0) {
    resultBox.innerHTML = "";
    return;
  }

  const resultHTML = result.map((nome, index) => {
    return `
      <li role="option" tabindex="0" data-nome="${nome}">
        ${nome}
      </li>
    `;
  }).join("");

  resultBox.innerHTML = `<ul role="listbox">${resultHTML}</ul>`;

  // Adiciona os listeners AQUI, depois de criar os elementos
  resultBox.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", () => {
      const nome = li.getAttribute("data-nome");
      if(nome)
      {
        inputBox.value = nome;
        resultBox.innerHTML = "";
        inputBox.focus();
        selecionarFicha(li, nome)}
    });
  });
};

// Evento de digitação
inputBox.addEventListener("keyup", function (e: KeyboardEvent) {
  const input = inputBox.value.trim().toLowerCase();

  if (input.length === 0) {
    resultBox.innerHTML = "";
    return;
  }

  // Achata e filtra os nomes
  const todasFichas: Ficha[] = fichaDados.flat();

  // Tranformamos o array de nomes filtrados em um set para tirar os duplicados  
  const nomesFiltradosUnicos = [...new Set(todasFichas
    .map(f => f.nome)
    .filter(nome => nome.toLowerCase().startsWith(input))
  )];

  displayResults(nomesFiltradosUnicos);
});

// (Opcional) Fechar a lista com ESC
inputBox.addEventListener("keydown", function (e: KeyboardEvent) {
  if (e.key === "Escape") {
    resultBox.innerHTML = "";
  }
});

// (Opcional) Navegação com setas + Enter
// resultBox.addEventListener("keydown", function (e) {
//   const options = resultBox.querySelectorAll("li");
//   if (!options.length) return;

//   let current = document.activeElement;

//   if (e.key === "ArrowDown") {
//     e.preventDefault();
//     const next = current.nextElementSibling || options[0];
//     next.focus();
//   } else if (e.key === "ArrowUp") {
//     e.preventDefault();
//     const prev = current.previousElementSibling || options[options.length - 1];
//     prev.focus();
//   } else if (e.key === "Enter") {
//     if (current && current.tagName === "LI") {
//       selecionarFicha(current);
//     }
//   }
// });

function remover(nome: string, letra: string): void {
  // Achata, filtra e reconstrói os grupos
  let encontrou = false;
  for (let i = 0; i < fichaDados.length; i++) {
    const idx = fichaDados[i].findIndex(f => f.nome === nome);
    if (idx !== -1) {
      fichaDados[i].splice(idx, 1);
      if (fichaDados[i].length === 0) {
        fichaDados.splice(i, 1);
      }
      encontrou = true;
      break;
    }
  }

  if (!encontrou) {
    console.warn(`Ficha com nome "${nome}" não encontrada para remoção.`);
  }

  // Re-renderiza tudo
  renderizar();
}

// Renderiza todas as fichas
function renderizar() {
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

renderizar()

// View Transitions API - https://developer.chrome.com/docs/web-platform/view-transitions?hl=pt-br