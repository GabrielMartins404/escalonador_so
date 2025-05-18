import { useState } from 'react';
import '../assets/homepage.css';
import linc from '../assets/fotos/lincoln.png';
import gab from '../assets/fotos/gabriel.jpeg';
import helt from '../assets/fotos/helton.jpeg';

export default function Homepage({ onStart }) {
  const [showScheduler, setShowScheduler] = useState(false);

  // Função para ativar a transição e exibir o escalonador
  const handleStart = () => {
    window.scrollTo(0, 0); // Reseta o scroll para o topo
    setTimeout(() => {
      setShowScheduler(true);
      onStart();
    }, 100);
  };

  return (
    <div className={`homepage ${showScheduler ? 'show-scheduler' : ''}`}>

      <header>
        <h1>ESCALONADOR DE MÚTIPLAS FILAS</h1>
        <p>SISTEMAS OPERACIONAIS - GERENCIAMENTO DE PROCESSOS</p>
      </header>

      <div className="container">
        <div className="description">
          <h2>Sobre o Projeto</h2>
          <p>Este escalonador implementa o algoritmo de múltiplas filas com diferentes prioridades e políticas de escalonamento para cada fila. Desenvolvido para demonstrar os conceitos de escalonamento de processos em Sistemas Operacionais.</p>
        </div>

        <div className="queues-container">
          {/* Aqui pode ser um lugar para componentes adicionais sobre filas */}
        </div>

        <div className="description">
          <h2>Como Funciona</h2>
          <p>O escalonador de múltiplas filas é um algoritmo de escalonamento de processos em sistemas operacionais que organiza os processos em diferentes filas de prioridade, cada uma com seu próprio método de escalonamento. Esse método é útil quando os processos podem ser classificados em grupos distintos, como processos de tempo real, interativos ou em lote (batch).</p>
        </div>

        <div className="developers-container">
          <h2 className="section-title">Equipe de Desenvolvimento</h2>
          <div className="developers-grid">
            <div className="developer-card">
              <div className="developer-photo">
                <img src={gab} alt="Gabriel" />
              </div>
              <h3>Gabriel Martins</h3>
              <p>Engenharia da Computação</p>
              <p className="ra">COMP2023</p>
            </div>

            <div className="developer-card">
              <div className="developer-photo">
                <img src={helt} alt="Helton" />
              </div>
              <h3>Helton Pessoa</h3>
              <p>Engenharia da Computação</p>
              <p className="ra">COMP2023</p>
            </div>

            <div className="developer-card">
              <div className="developer-photo">
                <img src={linc} alt="Lincoln" />
              </div>
              <h3>Lincoln Sanches</h3>
              <p>Engenharia da Computação</p>
              <p className="ra">COMP2023</p>
            </div>
          </div>
        </div>
      </div>

      <div className="button-container">
        <button className="action-button" onClick={handleStart}>
          ACESSAR ESCALONADOR
        </button>
      </div>

      <footer>
        <p>DESENVOLVIDO PARA A DISCIPLINA DE SISTEMAS OPERACIONAIS - 2025</p>
      </footer>
    </div>
  );
}
