/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/front/cadastro-fichas.ts"
/*!**************************************!*\
  !*** ./src/front/cadastro-fichas.ts ***!
  \**************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initCadastroFicha = initCadastroFicha;
function initCadastroFicha() {
    // 1. Busque o formulário direto aqui dentro
    const formulario = document.querySelector("form");
    console.log("Tentando carregar o formulário de cadastro...", formulario);
    // 2. Se não encontrar o formulário (ex: estamos na index.html), sai da função em paz
    if (!formulario) {
        console.log("Formulário não encontrado nesta página. Função ignorada.");
        return;
    }
    // 3. O ouvinte de 'submit' fica direto no formulário, sem travar em outro DOMContentLoaded
    formulario.addEventListener("submit", async (event) => {
        // SEGUNDA REGRA DE OURO: Para o recarregamento imediatamente!
        event.preventDefault();
        console.log("1. O botão de enviar foi clicado com sucesso!");
        // Captura os dados dos inputs
        const dadosParaEnviar = {
            nome: document.getElementById("nome")?.value || "",
            email: document.getElementById("email")?.value || "",
            peso: Number(document.getElementById("peso")?.value || 0),
            peito: Number(document.getElementById("peito")?.value || 0),
            abdomen: Number(document.getElementById("abdomen")?.value || 0),
            ombros: Number(document.getElementById("ombros")?.value || 0),
            quadricepsEsquerdo: Number(document.getElementById("quadriceps-esquerdo")
                ?.value || 0),
            quadricepsDireito: Number(document.getElementById("quadriceps-direito")
                ?.value || 0),
            panturrilhaEsquerda: Number(document.getElementById("panturrilha-esquerda")
                ?.value || 0),
            panturrilhaDireita: Number(document.getElementById("panturrilha-direita")
                ?.value || 0),
            bicepsEsquerdo: Number(document.getElementById("biceps-esquerdo")
                ?.value || 0),
            bicepsDireito: Number(document.getElementById("biceps-direito")
                ?.value || 0),
        };
        console.log("2. Dados coletados com sucesso:", dadosParaEnviar);
        try {
            const response = await fetch("/api/fichas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosParaEnviar),
            });
            console.log("3. Resposta do servidor chegou:", response.status);
            if (response.ok) {
                alert("Ficha cadastrada com sucesso no MongoDB!");
                formulario.reset();
                window.location.href = "/fichas-salvas";
            }
            else {
                const erro = await response.json();
                alert(`Falha ao cadastrar: ${erro.error}`);
            }
        }
        catch (error) {
            console.error("Erro ao enviar requisição:", error);
            alert("Não foi possível conectar ao servidor.");
        }
    });
}


/***/ },

/***/ "./src/front/get-fichas.ts"
/*!*********************************!*\
  !*** ./src/front/get-fichas.ts ***!
  \*********************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initListarFichas = initListarFichas;
const date_formatter_helper_1 = __importDefault(__webpack_require__(/*! ../helpers/date-formatter.helper */ "./src/helpers/date-formatter.helper.ts"));
async function initListarFichas(container) {
    try {
        const response = await fetch("/api/fichas");
        if (!response.ok) {
            throw new Error("Erro ao buscar fichas do servidor");
        }
        const fichas = await response.json();
        // Alinhando com a classe do seu HTML (.lista-fichas)
        if (!container)
            return;
        container.innerHTML = "";
        if (fichas.length === 0) {
            container.innerHTML =
                "<p>Nenhuma ficha encontrada no banco de dados.</p>";
            return;
        }
        fichas.sort((a, b) => a.nome.localeCompare(b.nome));
        const fichasPorLetra = {};
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
                cardsGrid.insertAdjacentHTML("beforeend", `
        <div class="ficha-card" view-transition-class="ficha-card">    
          <h3>${ficha.nome} - ${date_formatter_helper_1.default.formatDateAndTime(new Date(ficha.criadoEm))}</h3>
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
      `);
            });
            section.appendChild(cardsGrid);
            container.appendChild(section);
        });
    }
    catch (erro) {
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


/***/ },

/***/ "./src/front/toggle-menu.ts"
/*!**********************************!*\
  !*** ./src/front/toggle-menu.ts ***!
  \**********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toggleMenu = toggleMenu;
function toggleMenu() {
    const toggleBtn = document.querySelector(".menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("expanded");
    });
}


/***/ },

/***/ "./src/helpers/date-formatter.helper.ts"
/*!**********************************************!*\
  !*** ./src/helpers/date-formatter.helper.ts ***!
  \**********************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class DateFormatterHelper {
    static formatDate(dateNow) {
        let formattedDate = new Intl.DateTimeFormat("pt-br", {
            timeZone: "America/Sao_Paulo",
            dateStyle: "short",
            timeStyle: "medium",
        }).format(dateNow);
        return formattedDate
            .replace(/\//g, "")
            .replace(/\,\s/g, "_")
            .replace(/\:/g, "");
    }
    static formatDateAndTime(dateNow) {
        let formattedDate = new Intl.DateTimeFormat("pt-br", {
            timeZone: "America/Sao_Paulo",
            dateStyle: "short",
            timeStyle: "short",
        }).format(dateNow);
        return formattedDate;
    }
}
exports["default"] = DateFormatterHelper;


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!***************************!*\
  !*** ./src/front/main.ts ***!
  \***************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const toggle_menu_1 = __webpack_require__(/*! ./toggle-menu */ "./src/front/toggle-menu.ts");
const cadastro_fichas_1 = __webpack_require__(/*! ./cadastro-fichas */ "./src/front/cadastro-fichas.ts");
const get_fichas_1 = __webpack_require__(/*! ./get-fichas */ "./src/front/get-fichas.ts");
document.addEventListener("DOMContentLoaded", () => {
    (0, toggle_menu_1.toggleMenu)();
    const formCadastro = document.querySelector("#form-ficha");
    if (formCadastro) {
        (0, cadastro_fichas_1.initCadastroFicha)();
    }
    const containerFichas = document.querySelector(".lista-fichas");
    if (containerFichas) {
        (0, get_fichas_1.initListarFichas)(containerFichas);
    }
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map