import { Processador } from "./Processador.js"
import { FilaPrioridade } from "./FilaPrioridade.js"

export class Escalonador {
    constructor(tempoCpuTotal, tempoIo){
        this.filasPronto = {
            4: new FilaPrioridade(4, 40),
            3: new FilaPrioridade(3, 30),
            2: new FilaPrioridade(2, 20),
            1: new FilaPrioridade(1, 10)
        }
        this.prioridadeAtual = 4
        this.tempoPrioridade = 0 //Tempo para cada tempoCpu de acordo com a fila
        this.filaEspera = []
        this.tempoCpuTotal = tempoCpuTotal
        this.tempoIo = tempoIo
        this.processador = new Processador()
        this.processoConcluido = []
    }

    adicionarProcessoEspera(processo){
        this.filaEspera.push(processo)
    }

    adicionarProcessoConcluido(processo){
        this.processoConcluido.push(processo)
    }

    incrementarTempoEspera(){
        if(this.filaEspera.length > 0){
            this.filaEspera.map((processo, index) => {
                if(processo.tempoEmEspera < this.tempoIo){
                    processo.tempoEmEspera += 1
                    console.log(`===== Processo ${processo.pid} incrementou. Falta ${this.tempoIo - processo.tempoEmEspera} =====`)
                }else{
                    console.log(`===== Processo ${processo.pid} saiu da fila de espera =====`)
                    this.adicionarProcessoPronto(processo)
                    this.filaEspera.splice(index, 1)
                }
            })
        }else{
            console.log("===== Não há processos em espera ====")
        }
    }


    adicionarProcessoPronto(processo){
        if(processo.prioridade == 1){
            this.filasPronto[1].adicionarProcesso(processo) //Adiciono o processo na fila de prioridade
        }else if(processo.prioridade == 2){
            this.filasPronto[2].adicionarProcesso(processo)
        }else if(processo.prioridade == 3){
            this.filasPronto[3].adicionarProcesso(processo)
        }else{
            this.filasPronto[4].adicionarProcesso(processo)
        }
    }

    //Esse método serve somente para garanti que um processo concluido não conste em nenhuma outra fila
    removerProcessoDeTodasFilas(pid) {
        // Remove da fila de espera
        this.filaEspera = this.filaEspera.filter(p => p.pid !== pid);
        
        // Remove de todas as filas de pronto
        for(const prioridade in this.filasPronto) {
            this.filasPronto[prioridade].processos = 
                this.filasPronto[prioridade].processos.filter(p => p.pid !== pid);
            this.filasPronto[prioridade].qtdProcessos = 
                this.filasPronto[prioridade].processos.length;
        }
    }

    //Cálculo da distribuição dos timesSlices de acordo com os processos
    calcularDistribuicao(){
        //Identifica processos prontos
        const filasAtivas = Object.values(this.filasPronto).filter(fila => fila.qtdProcessos > 0) //Converte a fila em array e filtra somente as que tem processo
        
        //Retorna nada se não tiver nenhuma fila
        if(filasAtivas.length == 0){
            return {}
        }

        //Calcula o percentua total das filas ativas
        const percentualTotal = filasAtivas.reduce((total, fila) => total + fila.percentualBase, 0) //Soma todos os percentuais de filas ativas

        const fatorNormalizacao = 100 / percentualTotal

        const distribuicao = {}
        filasAtivas.forEach(fila => {
            //Ajusta o percentual atual garantindo a redistribuição dos valores
            const percentualAjustado = fila.percentualBase * fatorNormalizacao

            distribuicao[fila.prioridade] = {
                percentual: percentualAjustado,
                tempoCpuProcesso: (this.tempoCpuTotal * percentualAjustado / 100) / fila.qtdProcessos //Aqui é feito a divisão do tempoCpu igualmente para cada processo
            }

            //Aqui pode surgir um problema, onde o tempo para finalizar um processo é menor que o tempo distribuido. Isso pode causar ociosidade na CPU. Depois avaliar isso
        })

        return distribuicao
    }

    //Defino o tempoCpu das filas
    definirTempoCpuFilas(){
       const distribuicao = this.calcularDistribuicao()

       //Atualiza cada fila
       for(const [prioridade, fila] of Object.entries(this.filasPronto)){
        if(distribuicao[prioridade]){
            fila.tempoCpuFila = distribuicao[prioridade].tempoCpuProcesso
            //Cada processo recebe a informação de quanto tempo deverá executar. 
            fila.processos.map((processo) => {
                processo.tempoCpuProcesso = distribuicao[prioridade].tempoCpuProcesso
            })
        }else{
            fila.tempoCpuFila = 0
        }
       }
    }

    obterProximoProcesso(){

        // Se ainda há tempo alocado para a prioridade atual
        if(this.tempoPrioridade > 0){ //O primeiro ciclo, não entra aqui. Só a partir do segundo
            const filaAtual = this.filasPronto[this.prioridadeAtual]
            if(filaAtual.qtdProcessos > 0 && filaAtual.tempoCpuFila > 0){ //Verifico se há processos e o tempoCpu é zero. Sempre será zero porque é definido na função acima
                this.tempoPrioridade -= filaAtual.tempoCpuFila //Decrementa o tempoCpu de cada processo
                return{
                    processo: filaAtual.retirarProcesso(),
                    tempoCpu: filaAtual.tempoCpuFila
                }
            }
        }
        //É feito 4 tentativas para verifica se há alguma fila com processo
        let tentativas = 0
        while(tentativas < 4){
            console.log("prioridade atual", this.prioridadeAtual)
            this.prioridadeAtual = this.prioridadeAtual === 1 ? 4 : this.prioridadeAtual - 1 
            const fila = this.filasPronto[this.prioridadeAtual]
            // console.log(`Prioridade atual ${this.prioridadeAtual}`)
            // console.log(fila)

            if(fila.qtdProcessos > 0 && fila.tempoCpuFila > 0){
                // Redefine o tempo alocado para esta prioridade
                this.tempoPrioridade = this.tempoCpuTotal * (fila.percentualBase / 100)
                return {
                    processo: fila.retirarProcesso(),
                    tempoCpu: fila.tempoCpuFila    
                }
            }

            tentativas++
        }
       return { processo: null, tempoCpu: 0 };

    }

    escalonar(){
        this.incrementarTempoEspera() //Toda a vez que escalona, verifica se incrementa o tempo de processos IO em espera
        // Se o processador está ocioso, busca o próximo processo
        if(!this.processador.emUso){
            this.definirTempoCpuFilas()
            console.log("Buscando novos processos")
            const proximo = this.obterProximoProcesso()
            if(proximo?.processo) {
                this.processador.adicionarProcesso(proximo.processo);
            }else{
                console.log("Nenhum processo para execução")
            }
        }else{
            //Executa o processo atual
            this.processador.executarProcesso(100) //Quero que ele execute de 10 em 10
            if(this.processador.tempoRestanteProcessamento <= 0 || (this.processador.processoEmExecucao && this.processador.processoEmExecucao.isConcluido)){
                //console.log(`Processo ${this.processador.processoEmExecucao.pid} terminou seu tempoCpu`)
                const processo = this.processador.retirarProcesso() //Retiro o processo da CPU
                //Se o processo não foi concluido, deverá voltar para alguma das filas abaixo
                if(processo.isConcluido){
                    console.log(`O processo ${processo.pid} foi concluído`);
                    this.adicionarProcessoConcluido(processo);
                    // Remove o processo de todas as filas possíveis
                    this.removerProcessoDeTodasFilas(processo.pid);
                }else if(processo.tipoProcesso == 'IO'){ //Se o processo for IO, vai para espera
                    this.adicionarProcessoEspera(processo)
                }else{
                    this.adicionarProcessoPronto(processo)
                }
            }
            
        }
        
    }

    // Método para simulação contínua
    iniciarSimulacao() {
        setInterval(() => {
            this.escalonar();
        }, 2000); // Executa a cada 2000ms
    }
}