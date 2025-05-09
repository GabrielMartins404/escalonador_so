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
    }

    executar(tempo){
        this.tempoEmExecucao += tempo
        this.tempoParaProcessamento -= tempo
        this.tempoUltimaExecucao = 0
    }

    estaConcluido(){
        if(this.tempoEmExecucao < this.tempoNecessario){
            return false
        }else{
            return true
        }
    }

}