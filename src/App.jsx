import React, { useState, useEffect } from 'react';

function App() {
  const [unidades, setUnidades] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [busca, setBusca] = useState('');
  
  const opcoesEspecialidades = [
    'Clínico Geral',
    'Pediatria',
    'Ginecologia',
    'Odontologia',
    'Cardiologia',
    'Ortopedia',
    'Enfermagem / Curativos',
    'Exame - Hemograma Completo',
    'Exame - Raio-X',
    'Exame - Ultrassonografia'
  ];

  const opcoesHorarios = [
    '07:30',
    '08:30',
    '09:30',
    '10:30',
    '13:30',
    '14:30',
    '15:30'
  ];

  const [form, setForm] = useState({
    unidade_id: '',
    tipo: 'Consulta',
    especialidade: 'Clínico Geral',
    data_agendamento: '',
    horario: '08:30'
  });
  
  const [mensagem, setMensagem] = useState('');

  const carregarUnidades = () => {
    fetch('http://localhost:3001/api/unidades')
      .then(res => res.json())
      .then(data => setUnidades(data))
      .catch(err => console.error('Erro ao buscar unidades:', err));
  };

  const carregarAgendamentos = () => {
    fetch('http://localhost:3001/api/agendamentos')
      .then(res => res.json())
      .then(data => setAgendamentos(data))
      .catch(err => console.error('Erro ao buscar agendamentos:', err));
  };

  useEffect(() => {
    carregarUnidades();
    carregarAgendamentos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensagem('');

    if (!form.unidade_id) {
      setMensagem('❌ Por favor, selecione uma unidade de saúde.');
      return;
    }

    fetch('http://localhost:3001/api/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.erro) {
          setMensagem(`❌ ${data.erro}`);
        } else {
          setMensagem('✅ Agendamento realizado com sucesso!');
          setForm({
            unidade_id: '',
            tipo: 'Consulta',
            especialidade: 'Clínico Geral',
            data_agendamento: '',
            horario: '08:30'
          });
          carregarAgendamentos();
        }
      })
      .catch(err => {
        console.error('Erro ao agendar:', err);
        setMensagem('❌ Erro na conexão com o servidor.');
      });
  };

  const handleCancelar = (id) => {
    if (!window.confirm('Deseja realmente cancelar este agendamento?')) return;

    fetch(`http://localhost:3001/api/agendamentos/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.erro) {
          setMensagem(`❌ ${data.erro}`);
        } else {
          setMensagem('🗑️ Agendamento cancelado com sucesso.');
          carregarAgendamentos();
        }
      })
      .catch(err => console.error('Erro ao deletar:', err));
  };

  const agendamentosFiltrados = agendamentos.filter(item => {
    const termo = busca.toLowerCase();
    return (
      (item.especialidade && item.especialidade.toLowerCase().includes(termo)) ||
      (item.unidade_nome && item.unidade_nome.toLowerCase().includes(termo)) ||
      (item.unidade_bairro && item.unidade_bairro.toLowerCase().includes(termo))
    );
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🏥 MedTech BM - Agendamento de Saúde</h1>
      <p>Sistema de Marcação de Consultas e Exames - Barra Mansa / RJ</p>

      {mensagem && (
        <div style={{ padding: '12px', backgroundColor: '#e2e8f0', borderRadius: '5px', marginBottom: '15px', fontWeight: 'bold' }}>
          {mensagem}
        </div>
      )}

      {/* Formulário de Agendamento */}
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h3>Novo Agendamento</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label><strong>Unidade de Saúde:</strong></label><br />
          <select 
            name="unidade_id" 
            value={form.unidade_id} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          >
            <option value="">Selecione uma unidade...</option>
            {unidades.map(u => (
              <option key={u.id} value={u.id}>
                {u.nome} ({u.bairro})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label><strong>Tipo:</strong></label><br />
            <select 
              name="tipo" 
              value={form.tipo} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            >
              <option value="Consulta">Consulta</option>
              <option value="Exame">Exame</option>
            </select>
          </div>

          <div style={{ flex: 2 }}>
            <label><strong>Especialidade / Serviço:</strong></label><br />
            <select 
              name="especialidade" 
              value={form.especialidade} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            >
              {opcoesEspecialidades.map((esp, i) => (
                <option key={i} value={esp}>{esp}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label><strong>Data:</strong></label><br />
            <input
              type="date"
              name="data_agendamento"
              value={form.data_agendamento}
              onChange={handleChange}
              required
              style={{ width: '90%', padding: '10px', marginTop: '5px' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label><strong>Horário Disponível:</strong></label><br />
            <select 
              name="horario" 
              value={form.horario} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            >
              {opcoesHorarios.map((h, i) => (
                <option key={i} value={h}>{h}h</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          style={{ backgroundColor: '#0284c7', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Confirmar Agendamento
        </button>
      </form>

      {/* Seção de Filtro e Lista de Agendamentos */}
      <h3 style={{ marginTop: '30px' }}>Agendamentos Realizados</h3>

      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="🔍 Buscar agendamento por especialidade ou posto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ width: '97%', padding: '10px', borderRadius: '5px', border: '1px solid #aaa' }}
        />
      </div>

      {agendamentosFiltrados.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {agendamentosFiltrados.map(item => (
            <li key={item.id} style={{ borderBottom: '1px solid #ddd', padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{item.tipo} - {item.especialidade}</strong><br />
                <span>📍 {item.unidade_nome || 'Unidade'} ({item.unidade_bairro || 'Barra Mansa'})</span><br />
                <small>📅 {new Date(item.data_agendamento).toLocaleDateString('pt-BR')} às {item.horario} | Status: <b>{item.status}</b></small>
              </div>
              <button 
                onClick={() => handleCancelar(item.id)}
                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
