import { Processador } from "./Processador.js"
import { Processo } from "./Processo.js"
import { FilaPrioridade } from "./FilaPrioridade.js"

export class Escalonador {
    constructor(timeSliceTotal, tempoIo){
        this.filasPronto = {
            1: new FilaPrioridade(1, 40),
            2: new FilaPrioridade(2, 30),
            3: new FilaPrioridade(3, 20),
            4: new FilaPrioridade(4, 10)
        }
        this.filaEspera = []
        this.timeSliceTotal = timeSliceTotal
        this.tempoIo = tempoIo
        this.processador = new Processador()
    }

    adicionarProcessoEspera(processo){
        this.filaEspera.push(processo)
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

    //Cálculo da distribuição dos timesSlices de acordo com os processos
    calcularDistribuicao(){
        //Identifica processos prontos
        const filasAtivas = Object.values(this.filasPronto).filter(fila => fila.qtdProcessos > 0) //Converte a fila em array e filtra somente as que tem processo
        
        //Retorna nada se não tiver nenhuma fila
        if(filasAtivas.length == 0){
            return {}
        }

        //Calcula o percentua total das filas ativas
        const percentualTotal = filasAtivas.reduce((total, fila) => total + fila.timeSlice, 0) //Soma todos os percentuais de filas ativas

        const fatorNormalizacao = 100 / percentualTotal

        const distribuicao = {}
        filasAtivas.forEach(fila => {
            //Ajusta o percentual atual garantindo a redistribuição dos valores
            const percentualAjustado = fila.timeSlice * fatorNormalizacao

            distribuicao[fila.prioridade] = {
                percentual: percentualAjustado,
                timeSliceFila: this.timeSliceTotal * percentualAjustado,
                timeSliceProcesso: (this.timeSliceTotal * percentualAjustado / 100) / fila.qtdProcessos //Aqui é feito a divisão do timeSlice igualmente para cada processo
            }

            //Aqui pode surgir um problema, onde o tempo para finalizar um processo é menor que o tempo distribuido. Isso pode causar ociosidade na CPU. Depois avaliar isso
        })

        return distribuicao
    }

    //Defino o timeSlice das filas
    definirTimeSliceFilas(){
       const distribuicao = this.calcularDistribuicao()

       //Atualiza cada fila
       for(const [prioridade, fila] of Object.entries(this.filasPronto)){
        if(distribuicao[prioridade]){
            fila.timeSlice = distribuicao[prioridade].timeSliceFila
            fila.processos.map((processo) => {
                processo.timeSlice = distribuicao[prioridade].timeSliceProcesso
            })
        }else{
            fila.timeSlice = 0
        }
       }
        
    }

    obterProximoProcesso(){
        for(var prioridade = 1; prioridade <= 4; prioridade++){
            const fila = this.filasPronto[prioridade]
            if(fila.qtdProcessos > 0 && fila.timeSlice > 0){
                return{
                    processo: fila.retirarProcesso(),
                    timeSlice: fila.timeSlice
                }
            }
        }
        return null
    }

    escalonar(){
        // Se o processador está ocioso, busca o próximo processo
        if(!this.processador.emUso){
            this.definirTimeSliceFilas()
            const proximo = this.obterProximoProcesso()
            
            if(proximo){
                console.log(proximo.processo)
                console.log(this.processador)
                this.processador.adicionarProcesso(proximo.processo)
                console.log(this.processador)
            }
        }
        
    }
}