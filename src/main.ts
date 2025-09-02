// Constructor function para lidar com fichas
import { gerarDadosFicticios } from "./gerar-dados-ficticios"
interface Ficha {
  nome: string
  email: string
  data: string
  peso: number
  peito: number
  panturrilhaEsquerda: number
  panturrilhaDireita: number
  bicepsEsquerdo: number
  bicepsDireito: number
}

const formulatio = document.getElementById("form-ficha") as HTMLFormElement

if (formulatio) {
  class FichaApp {
    private form = formulatio
    private btnSalvar = document.getElementById("btn-salvar") as HTMLButtonElement
    private inputs = this.form.querySelectorAll("input") as NodeListOf<HTMLInputElement>
    private dataInput = document.getElementById("data-avaliacao") as HTMLInputElement

    // Coleta os dados dos inputs em objeto
    private coletarDados(): Ficha {
      const ficha: any = {}
      this.inputs.forEach((input: HTMLInputElement) => {
        ficha[input.name] = input.value.trim()
      })
      return ficha
    }

    // Valida se todos os campos estão preenchidos
    private validar(ficha: Ficha): boolean {
      let valido = true
      this.inputs.forEach((input: HTMLInputElement) => {
        if (input.value.trim() === "") {
          input.classList.add("erro")
          valido = false
        } else {
          input.classList.remove("erro")
        }
      })
      return valido
    }

    // Salva a ficha no array e localStorage
    private salvar(ficha: Ficha) {
      let fichaDados: Ficha[] = JSON.parse(localStorage.getItem("fichas") || "[]") || []
      fichaDados.push(ficha)
      // gerarDadosFicticios(3, 2)
      localStorage.setItem("fichas", JSON.stringify(fichaDados))
    }

    private definirData(){
      this.dataInput.valueAsDate = new Date()
    }

    // Inicializa app
    public iniciar() {
      this.definirData()

      this.btnSalvar.addEventListener("click", (e: Event) => {
        e.preventDefault()
        const ficha = this.coletarDados()
        if (!this.validar(ficha)) {
          alert("Preencha todos os campos antes de salvar.")
          return
        }
        this.salvar(ficha)
        this.form.reset()
      })
    }
  }

  // Instância global para poder chamar no botão excluir
  const app = new FichaApp()
  app.iniciar()
}

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