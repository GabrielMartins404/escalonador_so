class Escalonador {
    constructor(timeSlice, tempoIo){
        this.filasPronto = {
            1: new FilaPrioridade(1, 40),
            2: new FilaPrioridade(2, 30),
            3: new FilaPrioridade(3, 20),
            4: new FilaPrioridade(4, 10)
        }
        this.filaEspera = []
        this.timeSlice = timeSlice
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

    //Defino o timeSlice das filas
    definirTimeSliceFilas(){
        const fila1 = this.filasPronto[1]
        const fila2 = this.filasPronto[2]
        const fila3 = this.filasPronto[3]
        const fila4 = this.filasPronto[4]

        //Fila1 deverá pegar 40% do meu timeSlice geral. Desse modo, esses 40% deverá ser distribuido de forma igualitária para os processos da fila
        if(fila1.qtdProcessos > 0){
            fila1.timeSlice = (this.timeSlice*0.4) / fila1.qtdProcessos
        }else{
            fila1.timeSlice = 0
        }

        if(fila2.qtdProcessos > 0){
            fila2.timeSlice = (this.timeSlice*0.3) / fila3.qtdProcessos
        }else{
            fila2.timeSlice = 0
        }

        if(fila3.qtdProcessos > 0){
            fila3.timeSlice = (this.timeSlice*0.2) / fila3.qtdProcessos
        }else{
            fila3.timeSlice = 0
        }

        if(fila4.qtdProcessos > 0){
            fila4.timeSlice = (this.timeSlice*0.1) / fila4.qtdProcessos
        }else{
            fila4.timeSlice = 0
        }
        
    }

    escalonar(){
        // Se o processador está ocioso, busca o próximo processo
        if(!this.processador.emUso){
            this.definirTimeSliceFilas()
            for(var fila = 1; fila <= 4; fila++){
                
            }
        }
        
    }
}