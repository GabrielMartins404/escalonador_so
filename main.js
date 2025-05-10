import { Escalonador } from "./Escalonador.js";
import { Processo } from "./Processo.js";

const escalonador = new Escalonador(1000, 50); // Time slice total de 1000ms, tempo I/O de 50ms

// Adiciona alguns processos de exemplo
escalonador.adicionarProcessoPronto(new Processo(1, 1, 1,100));
escalonador.adicionarProcessoPronto(new Processo(2, 1, 1, 328));
escalonador.adicionarProcessoPronto(new Processo(4, 1, 1,258));
escalonador.adicionarProcessoPronto(new Processo(5, 2, 1,300));
escalonador.adicionarProcessoPronto(new Processo(6, 2, 1,300));
//escalonador.adicionarProcessoPronto(new Processo(3, 3, 1,150));
//escalonador.adicionarProcessoPronto(new Processo(4, 4, 1,400));

escalonador.iniciarSimulacao()
//


