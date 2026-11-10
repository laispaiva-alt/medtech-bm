CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) DEFAULT 'cidadao',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS unidades (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  bairro VARCHAR(50) NOT NULL,
  endereco VARCHAR(150)
);

CREATE TABLE IF NOT EXISTS agendamentos (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  unidade_id INT REFERENCES unidades(id),
  tipo VARCHAR(50) NOT NULL,
  especialidade VARCHAR(100) NOT NULL,
  data_agendamento DATE NOT NULL,
  horario TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'Solicitado',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO unidades (nome, bairro, endereco) VALUES 
('UBS Centro - Barra Mansa', 'Centro', 'Rua Juiz de Fora, 100'),
('USF Ano Bom', 'Ano Bom', 'Av. Presidente Kennedy, 500'),
('UBS Vila Maria', 'Vila Maria', 'Rua Antônio Graciano, 45')
ON CONFLICT DO NOTHING;
