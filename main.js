import { Escalonador } from "./Escalonador.js";
import { Processo } from "./Processo.js";

const escalonador = new Escalonador(1000, 10); // Time slice total de 1000ms, tempo I/O de 10ms

// Adiciona alguns processos de exemplo
escalonador.adicionarProcessoPronto(new Processo(1, 1, 'CPU',3000));
// escalonador.adicionarProcessoPronto(new Processo(2, 1, 'IO', 328));
// escalonador.adicionarProcessoPronto(new Processo(4, 1, 'CPU',258));
// escalonador.adicionarProcessoPronto(new Processo(5, 2, 'CPU',300));
// escalonador.adicionarProcessoPronto(new Processo(6, 2, 'IO',300));
//escalonador.adicionarProcessoPronto(new Processo(3, 3, 1,150));
//escalonador.adicionarProcessoPronto(new Processo(4, 4, 1,400));

escalonador.iniciarSimulacao()
//


