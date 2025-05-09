class Processo {
    constructor(pid, prioridade, tipoProcesso, tempoParaProcessamento, tempoDeCriacao, tempoEmExecucao, tempoUltimaExecucao){
        this.pid = pid
        this.prioridade = prioridade
        this.tipoProcesso = tipoProcesso
        this.tempoParaProcessamento = tempoParaProcessamento
        this.tempoDeCriacao = tempoDeCriacao
        this.tempoEmExecucao = tempoEmExecucao
        this.tempoUltimaExecucao = tempoUltimaExecucao
    }
}