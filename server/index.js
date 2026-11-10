const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rota de Teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor MedTech BM rodando perfeitamente!' });
});

// 1. ROTA DE CADASTRO REAL DE USUÁRIOS
app.post('/api/usuarios', async (req, res) => {
  const { nome, cpf, senha } = req.body;
  try {
    const userExist = await pool.query('SELECT * FROM usuarios WHERE cpf = $1', [cpf]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: 'CPF já cadastrado.' });
    }

    const newUser = await pool.query(
      'INSERT INTO usuarios (nome, cpf, senha) VALUES ($1, $2, $3) RETURNING id, nome, cpf',
      [nome, cpf, senha]
    );

    res.status(201).json({ user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});

// 2. ROTA DE LOGIN COM VALIDAÇÃO DE BANCO
app.post('/api/login', async (req, res) => {
  const { cpf, senha } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, nome, cpf FROM usuarios WHERE cpf = $1 AND senha = $2',
      [cpf, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'CPF ou senha incorretos. Cadastre-se primeiro!' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor ao tentar login.' });
  }
});

// 3. AGENDAMENTOS
app.get('/api/agendamentos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM agendamentos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
});

app.post('/api/agendamentos', async (req, res) => {
  const { paciente, cpf, tipo, especialidade, unidade, data } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO agendamentos (paciente_nome, cpf, tipo, especialidade, unidade, data) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [paciente, cpf, tipo, especialidade, unidade, data]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
