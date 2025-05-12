export class Processo {
    constructor(pid, prioridade, tipoProcesso, tempoNecessario){
        this.pid = pid
        this.prioridade = prioridade
        this.tipoProcesso = tipoProcesso
        this.tempoNecessario = tempoNecessario
        this.tempoDeCriacao = 0
        this.tempoEmExecucao = 0
        this.tempoUltimaExecucao = 0
        this.timeSliceProcesso = 0
        this.isConcluido = false
        this.tempoEmEspera = 0
    }

    executar(tempo){
        this.tempoEmExecucao += tempo
        //this.tempoParaProcessamento -= tempo
        this.tempoUltimaExecucao = 0

        //Verifico se o tempo que ele passa executando é igual ou maior ao tempo que ele necessita. Se sim, é porque o processo foi concluido
        if(this.tempoEmExecucao >= this.tempoNecessario){
            this.isConcluido = true
        }
    }

}