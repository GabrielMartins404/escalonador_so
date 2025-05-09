export class FilaPrioridade {
    constructor(prioridade, timeSlice){
        this.processos = []
        this.prioridade = prioridade
        this.qtdProcessos = 0
        this.timeSlice = timeSlice
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