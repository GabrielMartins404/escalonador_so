export class Processador{
    constructor(){
        this.processoEmExecucao = null,
        this.emUso = false
        this.tempoRestanteProcessamento = 0
    }

    adicionarProcesso(processo){
        // console.log(" ===== Novo processo adicionado =====")
        // console.log(processo)
        // console.log(" ===== =================")
        this.processoEmExecucao = processo
        processo.statusAtual = 'Em execução'
        this.emUso = true
        this.tempoRestanteProcessamento = processo.tempoCpuProcesso
    }

    retirarProcesso(){
        const processo = this.processoEmExecucao
        this.processoEmExecucao = null
        this.emUso = false
        this.tempoRestanteProcessamento = 0
        // console.log(this.processoEmExecucao)
        // console.log(this.emUso)
        return processo
    }

    executarProcesso(tempo){
        //A cpu recebe quanto tempo deverá executar um processo
        this.processoEmExecucao.executar(tempo)
        this.tempoRestanteProcessamento -= tempo //Aqui decrementa o tempo restante do processamento definido pelo escalonador
        this.processoEmExecucao.tempoDeCriacao += 1
        // console.log('O processo abaixo está executando: ', this.tempoRestanteProcessamento, ' segundos')
        // console.log(this.processoEmExecucao)
    }
}