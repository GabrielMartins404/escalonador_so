export class FilaPrioridade {
    constructor(prioridade, percentualBase){
        this.processos = []
        this.prioridade = prioridade
        this.qtdProcessos = 0
        this.percentualBase = percentualBase
        this.tempoCpuFila = 0
    }

    adicionarProcesso(processo){
        this.processos.push(processo)
        //console.log(this.processos)
        this.qtdProcessos++
    }

    retirarProcesso(){
        const processo = this.processos.shift()
        return processo
    }
}