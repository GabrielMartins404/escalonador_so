// Escalonador.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, HardDrive, Clock, Zap, List, Trash2, Plus, Play, Pause, Activity, X, Info } from 'lucide-react';
import {
  Processador as ProcessadorClass,
  Escalonador as EscalonadorClass,
  FilaPrioridade as FilaPrioridadeClass,
  Processo as ProcessoClass
}
  from '../../../'; //Componentes do backend


// Modal de Informação
const InfoModal = ({ isOpen, section, onClose }) => {
  if (!isOpen) return null;
  const infoMap = {
    create: {
      title: 'Criar Processo',
      text: 'Esta seção permite que você crie novos processos. Defina a prioridade do processo (de 1 a 4), o tipo (CPU-bound ou I/O-bound) e o tempo de execução (duração) em segundos. O processo será adicionado à fila de acordo com sua prioridade.'
    },
    queues: {
      title: 'Filas de Prioridade',
      text: 'Existem 4 filas de prioridade, numeradas de 1 (mais alta) a 4 (mais baixa). O escalonador sempre seleciona o próximo processo da fila de maior prioridade que não está vazia. As filas são usadas para garantir que processos mais importantes sejam executados primeiro.'
    },
    execution: {
      title: 'Execução e Espera',
      text: '"Em Execução" significa que o processo está sendo processado pela CPU. "Em Espera" significa que o processo está aguardando na fila para ser executado. Quando um processo é executado, seu tempo de execução diminui até que termine ou seja interrompido.'
    },
    pending: {
      title: 'Tabela de Processos Pendentes',
      text: 'A tabela exibe todos os processos que estão no sistema, incluindo aqueles que já foram concluídos. Para cada processo, é mostrado o PID, prioridade, tempo restante de execução, estado (em execução, esperando ou concluído), e tempo de espera.'
    },
    completed: {
      title: 'Tabela de Processos Concluídos',
      text: 'A tabela exibe todos os processos que estão no sistema, incluindo aqueles que já foram concluídos. Para cada processo, é mostrado o PID, prioridade, tempo restante de execução, estado (em execução, esperando ou concluído), e tempo de espera.'
    }
  };
  const info = infoMap[section] || {};
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{info.title}</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body"><p>{info.text}</p></div>
      </motion.div>
    </div>
  );
};


// Modal de Histórico
const HistoryModal = ({ isOpen, onClose, movementLog, onClear }) => {

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3><List size={18} /> Histórico de Processos</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
          <button className="clear-btn" onClick={onClear}><Trash2 size={16} /> Limpar</button>
        </div>
        <div className="log-table">
          <div className="log-header"><span>PID</span><span>Evento</span><span>Horário</span></div>
          {movementLog.map((log, index) => (
            <div key={index} className="log-row"><span>#{log.pid}</span><span>{log.evento}</span><span>{log.horario}</span></div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Card de Processo
const ProcessCard = ({ processo, onRemove, tempoRestante, isEspera }) => {
  if (!processo) return null;

  const typeColors = {
    'CPU-bound': '#f59e0b',
    'I/O-bound': '#3b82f6',
    waiting: '#10b981'
  };

  // Escolhe a cor correta:
  const borderColor = isEspera
    ? typeColors.waiting
    : typeColors[processo.tipoProcesso] || typeColors['CPU-bound'];

  let progress = 0
  if (!tempoRestante) {
    progress = (processo.tempoEmExecucao / processo.tempoNecessario) * 100;
  } else {
    progress = ((processo.tempoCpuProcesso - tempoRestante) / processo.tempoCpuProcesso) * 100
  }

  if (isEspera) {
    progress = (processo.tempoEmEspera / 10) * 100
  }
  return (
    <motion.div className="processo-card" style={{ borderLeft: `4px solid ${borderColor}` }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="card-header">
        <span className="card-title">PID {processo.pid}</span>
        <span className={`state-badge ${processo.statusAtual}`}><Activity size={12} /> {processo.statusAtual}</span>
      </div>
      <div className="card-body">
        <div className="card-row">{processo.tipoProcesso === 'CPU-bound' ? <Cpu size={12} /> : <HardDrive size={12} />} {processo.tipoProcesso}</div>
        <div className="card-row"><Zap size={12} /> Prioridade {processo.prioridade}</div>
        <div className="card-row"><Clock size={12} /> Tempo restante: {processo.tempoNecessario - processo.tempoEmExecucao}s</div>
        {
          !isEspera ?
            tempoRestante ?
              <>
                <div className="card-row"><Clock size={12} /> Execução restante: {tempoRestante}s</div>
                <div className="card-row">
                  <div className="card-progress"><div className="progress-bg"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><span>{Math.round(progress)}%</span></div>
                </div>
              </>
              :
              <div className="card-row">
                <div className="card-progress"><div className="progress-bg"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><span>{Math.round(progress)}%</span></div>
              </div>
            :
            <>
              <div className="card-row"><Clock size={12} /> Espera restante: {10 - processo.tempoEmEspera}s</div>
              <div className="card-row">
                <div className="card-progress"><div className="progress-bg"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><span>{Math.round(progress)}%</span></div>
              </div>
            </>
        }

        {/* Criar função para retirar o processo da fila pronto */}
        <button className="remove-btn-card" onClick={() => onRemove(processo.pid)}><Trash2 size={14} /> Remover</button>
      </div>
    </motion.div>
  );
};

// Linhas da Tabela
const ProcessRow = ({ processo, onRemove, isConcluido }) => {
  if (!processo) return null;
  const progress = (processo?.tempoEmExecucao / processo.tempoNecessario) * 100;
  return (
    <motion.tr initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }}>
      <td>{processo.pid}</td>
      <td><Zap size={14} /> {processo.prioridade}</td>
      <td><Clock size={14} /> {processo.tempoDeCriacao}s</td>
      <td>{processo.tempoNecessario}s</td>
      <td>{processo.tipoProcesso}</td>
      <td><div className="remaining-time-container"><div className="remaining-time-bar" style={{ width: `${(processo.tempoEmExecucao / processo.tempoNecessario) * 100}%` }} /><span>{processo.tempoEmExecucao}s</span></div></td>
      <td><div className="progress-container"><div className="progress-bar" style={{ width: `${progress}%` }}><span>{Math.round(progress)}%</span></div></div></td>
      <td className={`state-badge ${processo.statusAtual}`}><Activity size={14} /> {processo.statusAtual}</td>
      <td>{processo.tempoTotalEmEspera}s</td>
      {
        !isConcluido &&
        <td>
          <button className="remove-btn" onClick={() => onRemove(processo.pid)}>
            <Trash2 size={14} />
          </button>
        </td>
      }

    </motion.tr>
  );
};

// Fila de Processos
const Queue = ({ prioridade, processos, onRemove }) => {
  //console.log(processos)
  return (
    <div className="queue">
      <div className="queue-header"><div className="queue-title"><List size={16} /> <h3>Fila {prioridade}</h3></div><span className="process-count">{processos.length}</span></div>
      <div className="process-stack">
        {processos.map((p, index) =>
          <ProcessCard
            key={index}
            processo={p}
            onRemove={onRemove}
          />)}
      </div>
    </div>
  )
};

// Escalonador
const Escalonador = () => {

  const escalonadorRef = useRef(new EscalonadorClass(10, 10));
  const escalonador = escalonadorRef.current

  const [filaEspera, setFilaEspera] = useState([])
  const [processoEmExecucao, setProcessoEmExecucao] = useState(null)

  const [tempoDeSimulacao, setTempoDeSimulacao] = useState(0)

  const [form, setForm] = useState({ prioridade: 1, type: 'CPU-bound', time: '' });
  const [log, setLog] = useState([]);
  const [refresh, setRefresh] = useState(0) //Isso serve unicamente para forçar uma renderização
  const [running, setRunning] = useState(false);
  const [pid, setPid] = useState(1);
  const [showHist, setShowHist] = useState(false);
  const [infoSection, setInfoSection] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const colors = { 'CPU-bound': '#f59e0b', 'I/O-bound': '#3b82f6', waiting: '#10b981' };

  const clearHistory = () => {
    setLog([]);
    escalonador.logHistorico = []; // Limpa também no objeto escalonador
  };
  // Loop de escalonamento
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {

      setTempoDeSimulacao(t => t + 1)
      escalonador.escalonar()

      setFilaEspera([...escalonador.filaEspera])
      setProcessoEmExecucao({ ...escalonador.processador.processoEmExecucao })
      setLog([...escalonador.logHistorico])

    }, 1000);
    return () => clearInterval(interval);
  }, [running]);


  // Adicionar processo
  const handleAdd = () => {
    const id = `P${pid.toString().padStart(3, '0')}`
    const processoCriado = new ProcessoClass(id, form.prioridade, form.type, +form.time, 'Pronto')

    escalonador.adicionarProcessoPronto(processoCriado)
    setPid(pid + 1);
    setForm({ ...form, time: '' });
  };

  // Finaliza o processo
  const handleRemove = id => {
    console.log(id)
    escalonador.removerProcessoDeTodasFilas(id)
    // Se o processo removido for o que está em execução, limpa ele
    if (escalonador.processador.processoEmExecucao?.pid === id) {
      escalonador.processador.processoEmExecucao = null;
      setProcessoEmExecucao({});
    }

    // Atualiza lista de espera e log
    setFilaEspera([...escalonador.filaEspera]);
    setLog([...escalonador.logHistorico]);

    // Força renderização
    setRefresh(p => p + 1)
  };

  const openInfo = sec => { setInfoSection(sec); setShowInfo(true); };

  return (
    <div className="scheduler-app">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1><Zap size={24} /> Escalonador MLQ</h1>
        <p>Sistema multi-nível com monitoramento em tempo real</p>
        <p>Tempo de simulação: {tempoDeSimulacao}s</p>
      </motion.header>

      {/* Criar Processo */}
      <section className="control-panel">
        <div className="section-header"><h2>Criar Processo</h2><Info className="info-icon" size={16} onClick={() => openInfo('create')} /></div>
        <div className="form-container">
          <input
            type="number"
            value={form.prioridade}
            onChange={e => {
              const value = parseInt(e.target.value, 10);
              if (value >= 1 && value <= 4) {
                setForm({ ...form, prioridade: value });
              }
            }}
            placeholder="Prioridade (1–4)"
          />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="CPU-bound">CPU-bound</option>
            <option value="I/O-bound">I/O-bound</option>
          </select>
          <input type="number" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="Burst (s)" />
          <button className="add-btn" onClick={handleAdd}><Plus size={14} /> Adicionar</button>
          <button className={`control-btn ${running ? 'pause' : 'start'}`} onClick={() => setRunning(!running)}>{running ? <><Pause size={14} /> Pausar</> : <><Play size={14} /> Iniciar</>}</button>
        </div>
      </section>

      {/* Filas */}
      <section className="queues-section">
        <div className="section-header">
          <h2>Filas</h2>
          <Info className="info-icon" size={16} onClick={() => openInfo('queues')} />
        </div>
        <div className="queues-grid">
          {[4, 3, 2, 1].map(pr =>
            <Queue
              key={pr}
              prioridade={pr}
              processos={escalonador.filasPronto[pr].processos}
              color={pr <= 2 ? colors['CPU-bound'] : colors['I/O-bound']}
              onRemove={handleRemove}
            />)}
        </div>
        <button className="history-btn" onClick={() => setShowHist(true)}>
          <List size={16} /> Ver Histórico
        </button>
      </section>

      {/* Execução/Espera */}
      <section className="execution-waiting-section">
        <div className="section-header"><h2>Execução/Espera</h2><Info className="info-icon" size={16} onClick={() => openInfo('execution')} /></div>
        <div className="execution-section">
          <div>
            <h3><Zap size={18} /> Execução</h3>
            <div className="process-stack">
              {
                !processoEmExecucao || Object.keys(processoEmExecucao).length === 0 ?
                  <div>
                    <p>{!running ? 'Não há processo em execução' : 'Buscando novos processos'}</p>
                  </div>
                  :
                  <ProcessCard
                    processo={processoEmExecucao}
                    colors={colors[processoEmExecucao?.tipoProcesso]}
                    onRemove={handleRemove}
                    tempoRestante={escalonador.processador.tempoRestanteProcessamento}
                  />
              }

            </div>
          </div>
          <div><h3><Clock size={18} /> Espera</h3>
            <div className="process-stack">
              {filaEspera.map((p, index) =>
                <ProcessCard
                  key={index}
                  processo={p}
                  colors={colors.waiting}
                  onRemove={handleRemove}
                  isEspera={true}
                />)}
            </div>
          </div>
        </div>
      </section>

      {/* Tabela */}
      <section className="process-table-section">
        <div className="section-header"><h2>Tabela de processos pendentes</h2><Info className="info-icon" size={16} onClick={() => openInfo('pending')} /></div>
        <motion.div className="table-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <table className="process-table">
            <thead>
              <tr>
                <th>PID</th>
                <th>Prioridade</th>
                <th>Criação</th>
                <th>Necessário</th>
                <th>Tipo de processo</th>
                <th>Executado</th>
                <th>%</th>
                <th>Estado</th>
                <th>Espera</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {
                  [
                    // Processos das filas de pronto
                    ...[4, 3, 2, 1].flatMap((pr) =>
                      escalonador.filasPronto[pr].processos.map((p) => ({
                        ...p
                      }))
                    ),
                    // Processos da fila de espera
                    ...escalonador.filaEspera.map((p) => ({
                      ...p
                    }))
                  ].map((p) => (
                    <ProcessRow key={p.pid} processo={p} onRemove={handleRemove} status={p.status} />
                  ))
                }
              </AnimatePresence>
            </tbody>

          </table>
        </motion.div>
      </section>

      <section className="process-table-section">
        <div className="section-header"><h2>Tabela de processos concluídos</h2><Info className="info-icon" size={16} onClick={() => openInfo('completed')} /></div>
        <motion.div className="table-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <table className="process-table">
            <thead>
              <tr>
                <th>PID</th>
                <th>Prioridade</th>
                <th>Criação</th>
                <th>Necessário</th>
                <th>Tipo de processo</th>
                <th>Executado</th>
                <th>%</th>
                <th>Estado</th>
                <th>Espera</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {escalonador.processoConcluido
                  .map((p, index) => (
                    <ProcessRow key={index} processo={p} onRemove={handleRemove} isConcluido={true} />
                  ))}
              </AnimatePresence>


            </tbody>
          </table>
        </motion.div>
      </section>

      {/* Modais */}
      <HistoryModal isOpen={showHist} onClose={() => setShowHist(false)} movementLog={log} onClear={clearHistory} />
      <InfoModal isOpen={showInfo} section={infoSection} onClose={() => setShowInfo(false)} />
    </div>
  );
};

export default Escalonador;
