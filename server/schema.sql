-- Tabela de Usuários (Cidadãos e Administradores)
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) DEFAULT 'cidadao',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Unidades de Saúde
CREATE TABLE IF NOT EXISTS unidades (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  bairro VARCHAR(100) NOT NULL,
  endereco VARCHAR(200) NOT NULL
);

-- Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id SERIAL PRIMARY KEY,
  paciente_nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  especialidade VARCHAR(50) NOT NULL,
  unidade VARCHAR(100) NOT NULL,
  data DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'Solicitado',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserção inicial de unidades com o campo bairro
INSERT INTO unidades (nome, bairro, endereco) VALUES
('UBS Centro - Barra Mansa', 'Centro', 'Rua Luis Ponce, nº 263 - Centro'),
('UBS Ano Bom', 'Ano Bom', 'Rua Presidente Kennedy, s/n - Ano Bom'),
('UBS Vila Maria', 'Vila Maria', 'Av. Antonio Silva, s/n - Vila Maria'),
('UPA 24h - Barra Mansa', 'Centro', 'Rua Prefeito João Chiesse Filho, s/n - Centro')
ON CONFLICT DO NOTHING;
