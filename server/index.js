const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ mensagem: 'API do MedTech BM está rodando!' });
});

// Listar unidades
app.get('/api/unidades', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM unidades ORDER BY nome ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro no Banco:', err.message);
    res.status(500).json({ erro: 'Erro ao buscar unidades.' });
  }
});

// Listar agendamentos
app.get('/api/agendamentos', async (req, res) => {
  try {
    const queryText = `
      SELECT a.id, a.tipo, a.especialidade, a.data_agendamento, a.horario, a.status,
             u.nome AS unidade_nome, u.bairro AS unidade_bairro
      FROM agendamentos a
      LEFT JOIN unidades u ON a.unidade_id = u.id
      ORDER BY a.data_agendamento DESC, a.horario ASC
    `;
    const result = await db.query(queryText);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro no Banco:', err.message);
    res.status(500).json({ erro: 'Erro ao buscar agendamentos.' });
  }
});

// Criar agendamento
app.post('/api/agendamentos', async (req, res) => {
  const { unidade_id, tipo, especialidade, data_agendamento, horario } = req.body;

  if (!unidade_id || !tipo || !especialidade || !data_agendamento || !horario) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }

  try {
    const checagem = await db.query(
      'SELECT id FROM agendamentos WHERE unidade_id = $1 AND data_agendamento = $2 AND horario = $3 AND status != $4',
      [unidade_id, data_agendamento, horario, 'Cancelado']
    );

    if (checagem.rows.length > 0) {
      return res.status(400).json({ erro: 'Este horário já está ocupado nesta unidade.' });
    }

    const queryText = `
      INSERT INTO agendamentos (unidade_id, tipo, especialidade, data_agendamento, horario)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [unidade_id, tipo, especialidade, data_agendamento, horario];
    const result = await db.query(queryText, values);
    
    res.status(201).json({
      mensagem: 'Agendamento criado com sucesso!',
      agendamento: result.rows[0]
    });
  } catch (err) {
    console.error('Erro no Banco:', err.message);
    res.status(500).json({ erro: 'Erro ao salvar agendamento.' });
  }
});

// Cancelar agendamento
app.delete('/api/agendamentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM agendamentos WHERE id = $1', [id]);
    res.json({ mensagem: 'Agendamento cancelado com sucesso!' });
  } catch (err) {
    console.error('Erro no Banco:', err.message);
    res.status(500).json({ erro: 'Erro ao cancelar agendamento.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor MedTech BM rodando na porta ${PORT}`);
});
