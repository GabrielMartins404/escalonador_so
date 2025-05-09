const processo1 = new Processo('10', 1, 'IO', 600, 0, 0, 0)
const escalonador = new Escalonador(1000, 10000)

escalonador.adicionarProcessoEspera(processo1)

console.log(escalonador.filaEspera)