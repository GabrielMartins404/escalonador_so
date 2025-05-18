export class Processo {
    constructor(pid, prioridade, tipoProcesso, tempoNecessario, statusAtual){
        this.pid = pid
        this.prioridade = prioridade
        this.tipoProcesso = tipoProcesso
        this.tempoNecessario = tempoNecessario
        this.statusAtual = statusAtual
        this.tempoDeCriacao = 0
        this.tempoEmExecucao = 0
        this.tempoCpuProcesso = 0
        this.isConcluido = false
        this.tempoEmEspera = 0
        this.tempoTotalEmEspera = 0
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