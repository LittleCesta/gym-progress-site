const formulatio = document.getElementById("form-ficha");
if (formulatio) {
    class FichaApp {
        constructor() {
            this.form = formulatio;
            this.btnSalvar = document.getElementById("btn-salvar");
            this.inputs = this.form.querySelectorAll("input");
            this.dataInput = document.getElementById("data-avaliacao");
        }
        // Coleta os dados dos inputs em objeto
        coletarDados() {
            const ficha = {};
            this.inputs.forEach((input) => {
                ficha[input.name] = input.value.trim();
            });
            return ficha;
        }
        // Valida se todos os campos estão preenchidos
        validar(ficha) {
            let valido = true;
            this.inputs.forEach((input) => {
                if (input.value.trim() === "") {
                    input.classList.add("erro");
                    valido = false;
                }
                else {
                    input.classList.remove("erro");
                }
            });
            return valido;
        }
        // Salva a ficha no array e localStorage
        salvar(ficha) {
            let fichaDados = JSON.parse(localStorage.getItem("fichas") || "[]") || [];
            fichaDados.push(ficha);
            // gerarDadosFicticios(3, 2)
            localStorage.setItem("fichas", JSON.stringify(fichaDados));
        }
        definirData() {
            this.dataInput.valueAsDate = new Date();
        }
        // Inicializa app
        iniciar() {
            this.definirData();
            this.btnSalvar.addEventListener("click", (e) => {
                e.preventDefault();
                const ficha = this.coletarDados();
                if (!this.validar(ficha)) {
                    alert("Preencha todos os campos antes de salvar.");
                    return;
                }
                this.salvar(ficha);
                this.form.reset();
            });
        }
    }
    // Instância global para poder chamar no botão excluir
    const app = new FichaApp();
    app.iniciar();
}
export {};
// const pesosMedidos = [150, 135, 180];
// for (let i = 0; i < pesosMedidos.length; i++) {
//   let pesos = [] 
//     if (i == 0) {
//         pesos = pesosMedidos.slice(0, 2)
//     } else {
//         pesos = pesosMedidos.slice(i, i + 2);
//     }
//     console.log({
//         peso: pesos[0] < pesos[1] ? "Perdeu" : "Ganhou",
//     });
// }
//# sourceMappingURL=main.js.map