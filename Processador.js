class Processador{
    constructor(){
        this.processoEmExecucao = null,
        this.emUso = false
    }

    adicionarProcesso(processo){
        if(!this.emUso){
            this.processoEmExecucao = processo
            this.emUso = true
        }
    }

    retirarProcesso(){
        const processo = this.processoEmExecucao
        this.processoEmExecucao = null
        this.emUso = false

        return processo
    }
}