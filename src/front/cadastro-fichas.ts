export function initCadastroFicha() {
  // 1. Busque o formulário direto aqui dentro
  const formulario = document.querySelector("form");
  console.log("Tentando carregar o formulário de cadastro...", formulario);

  if (!formulario) {
    console.log("Formulário não encontrado nesta página. Função ignorada.");
    return;
  }

  formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    console.log("1. O botão de enviar foi clicado com sucesso!");

    // Captura os dados dos inputs
    const dadosParaEnviar = {
      nome: (document.getElementById("nome") as HTMLInputElement)?.value || "",
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

    console.log("2. Dados coletados com sucesso:", dadosParaEnviar);

    try {
      const response = await fetch("/api/salvar-ficha", {
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
      } else {
        const erro = await response.json();
        alert(`Falha ao cadastrar: ${erro.error}`);
      }
    } catch (error) {
      console.error("Erro ao enviar requisição:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  });
}
