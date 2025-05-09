class FilaPrioridade {
    constructor(prioridade, timeSlice){
        this.processos = []
        this.prioridade = prioridade
        this.qtdProcessos = 0
        this.timeSlice = timeSlice
    }

    adicionarProcesso(processo){
        this.processos.push(processo)
        this.qtdProcessos++
        this.logEvent(`Processo ${processo.pid} adicionado na fila ${processo.prioridade}`);
    }

    retirarProcesso(){
        return this.processos.shift()
    }
}