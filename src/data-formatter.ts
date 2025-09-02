export function zeroAEsquerda(num: number){
    return num >= 10 ? num : `0${num}`
}

export function formatDate(date: Date): string{
    const dia = zeroAEsquerda(date.getDate())
    const mes = zeroAEsquerda(date.getMonth() + 1)
    const ano = zeroAEsquerda(date.getFullYear())
    // const hora = zeroAEsquerda(date.getHours())
    // const min = zeroAEsquerda(date.getMinutes())
    // const sec = zeroAEsquerda(date.getSeconds())

    return ` ${dia}/${mes}/${ano}`
}