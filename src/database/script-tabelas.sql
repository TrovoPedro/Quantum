CREATE DATABASE QuantumDB;

USE QuantumDB;



CREATE TABLE tipoUsuario(
    idTipoUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome varchar(45)
);

INSERT INTO tipoUsuario (nome) 
VALUES ('Administrador'), ('Gerente'), ('Tecnico');


CREATE TABLE situacao(
    idSituacao INT PRIMARY KEY AUTO_INCREMENT,
    tipo varchar(45)
);

INSERT INTO situacao (tipo) 
VALUES ('Desativado'), ('Ativado');


CREATE TABLE tipoComponente(
    idTipoComponente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45)
);

INSERT INTO tipoComponente(nome) 
VALUES ('Ram'), ('CPU'), ('Disco'), ('Rede');

-- Tabela periodoAtividade
CREATE TABLE periodoAtividade(
    idEstado INT PRIMARY KEY AUTO_INCREMENT,
    dtHora DATETIME,
    tempoAtivo INT
);

INSERT INTO periodoAtividade(dtHora, tempoAtivo) 
VALUES (NOW(), 5), (NOW(), 10);

-- Tabela empresa
CREATE TABLE empresa(
    idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(100),
    cnpj CHAR(14),
    fkSituacao INT,
    FOREIGN KEY (fkSituacao) REFERENCES situacao(idSituacao)
);


select idEmpresa, razao_social from empresa;

INSERT INTO empresa(razao_social, cnpj, fkSituacao) 
VALUES ('Santa Marcelina', '90847581904876', 2),
       ('Doutor consulta', '90847581904221', 2),
       ('A.C Camargo', '10289465718298', 2);

-- Tabela endereco
CREATE TABLE endereco(
    idEndereco INT PRIMARY KEY AUTO_INCREMENT,
    cep CHAR(8),
    rua VARCHAR(45),
    complemento VARCHAR(45),
    num INT,
    fkEmpresa INT,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

INSERT INTO endereco(cep, rua, complemento, num, fkEmpresa) 
VALUES ('08485430', 'Rua arroio triunfo', 'Hospital', 42, 1),
       ('08485540', 'Rua ladeira porto geral', 'Hospital', 1991, 2),
       ('09283727', 'Rua liberdade', 'Hospital', 3955, 3);

CREATE TABLE usuario(
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255),
    email VARCHAR(255),
    senha VARCHAR(255),
    data_cadastro DATETIME,
    fotoPerfil VARCHAR(600),
    fkEmpresa INT,
    fkTipoUsuario INT,
    fkSituacao INT,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa),
    FOREIGN KEY (fkTipoUsuario) REFERENCES tipoUsuario(idTipoUsuario),
    FOREIGN KEY (fkSituacao) REFERENCES situacao(idSituacao)
);

SELECT 
    usuario.nome AS nomeUsuario,
    usuario.email,
    empresa.razao_social AS nomeEmpresa,
    tipoUsuario.nome AS cargoUsuario
FROM usuario
JOIN empresa ON usuario.fkEmpresa = empresa.idEmpresa
JOIN tipoUsuario ON usuario.fkTipoUsuario = tipoUsuario.idTipoUsuario;

CREATE TABLE servidor(
    idServidor INT PRIMARY KEY AUTO_INCREMENT,
    nomeServidor VARCHAR(45),
    fkEmpresa INT,
    fkLocalizacao INT,
    fkTempoAtividade INT,
    fkSituacao INT,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa),
    FOREIGN KEY (fkLocalizacao) REFERENCES endereco(idEndereco),
    FOREIGN KEY (fkSituacao) REFERENCES situacao(idSituacao),
    FOREIGN KEY (fkTempoAtividade) REFERENCES periodoAtividade(idEstado)
);

INSERT INTO servidor(nomeServidor, fkEmpresa, fkLocalizacao, fkTempoAtividade, fkSituacao) 
VALUES ('Servidor 1', 1, 1, 1, 2),
       ('Servidor 2', 2, 2, 2, 1),
       ('Servidor 3', 3, 3, 1, 2);

-- Tabela componente
CREATE TABLE componente(
    idComponente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    fabricante VARCHAR(45),
    fkServidor INT,
    fkTipoComponente INT,
    FOREIGN KEY (fkServidor) REFERENCES servidor(idServidor),
    FOREIGN KEY (fkTipoComponente) REFERENCES tipoComponente(idTipoComponente)
);

INSERT INTO componente(nome, fabricante, fkServidor, fkTipoComponente) 
VALUES ('CPU', 'Intel', 1, 2),
       ('RAM', 'Corsair', 1, 1),
       ('DISCO', 'Seagate', 1, 3);

-- Tabela log
CREATE TABLE log(
    idLog INT PRIMARY KEY AUTO_INCREMENT,
    dtHora DATETIME,
    tempoAtividade DATETIME,
    usoComponente DOUBLE,
    fkComponente INT,
    FOREIGN KEY (fkComponente) REFERENCES componente(idComponente)
);

-- Tabela limiteComponente
CREATE TABLE limiteComponente(
    idLimiteComponente INT PRIMARY KEY AUTO_INCREMENT,
    valorLimite DOUBLE,
    fkComponente INT,
    FOREIGN KEY (fkComponente) REFERENCES componente(idComponente)
);

-- Tabela alerta
CREATE TABLE alerta(
    idAlerta INT PRIMARY KEY AUTO_INCREMENT,
    data DATETIME,
    descricao VARCHAR(45),
    fkLog INT,
    fkLimiteComponente INT,
    FOREIGN KEY (fkLog) REFERENCES log(idLog),
    FOREIGN KEY (fkLimiteComponente) REFERENCES limiteComponente(idLimiteComponente)
);

-- View para análise do uso dos componentes
CREATE VIEW analiseUsoComponentes AS
SELECT 
    componente.nome AS nomeComponente,
    MIN(log.usoComponente) AS usoMinimo,
    MAX(log.usoComponente) AS usoMaximo
FROM log
JOIN componente ON log.fkComponente = componente.idComponente
GROUP BY componente.nome;

-- Consulta de servidores
SELECT servidor.nomeServidor, empresa.razao_social, situacao.tipo
FROM servidor
JOIN empresa ON servidor.fkEmpresa = empresa.idEmpresa
JOIN situacao ON servidor.fkSituacao = situacao.idSituacao;

INSERT INTO usuario(nome,email,senha,fktipoUsuario) VALUES ("Julia Araujo", "julia.araujo","12345",1);
CREATE VIEW usuarioDados AS SELECT 
	usuario.idUsuario as idUsuario,
    usuario.nome AS nomeUsuario,
    usuario.data_cadastro AS dataCadastro,
    usuario.email,
    empresa.razao_social AS nomeEmpresa,
    tipoUsuario.nome AS cargoUsuario
FROM usuario
JOIN empresa ON usuario.fkEmpresa = empresa.idEmpresa
JOIN tipoUsuario ON usuario.fkTipoUsuario = tipoUsuario.idTipoUsuario;

SELECT * FROM tipoUsuario;
SELECT * FROM usuario;



-- Inserir 10 registros na tabela usuario
-- Inserir 6 registros na tabela usuario (somente Gerente e Técnico)
INSERT INTO usuario (nome, email, senha, data_cadastro, fkEmpresa, fkTipoUsuario, fkSituacao)
VALUES
    ('Maria Oliveira', 'maria.oliveira@santamarcelina.com', 'senha123', NOW(), 1, 2, 2),  -- Gerente, Santa Marcelina, Ativo
    ('Carlos Santos', 'carlos.santos@doutorconsulta.com', 'senha123', NOW(), 2, 3, 2),  -- Técnico, Doutor consulta, Ativo
    ('Fernanda Souza', 'fernanda.souza@doutorconsulta.com', 'senha123', NOW(), 2, 2, 2),  -- Gerente, Doutor consulta, Ativo
    ('Luciana Costa', 'luciana.costa@accamargo.com', 'senha123', NOW(), 3, 3, 2),  -- Técnico, A.C Camargo, Ativo
    ('Ricardo Almeida', 'ricardo.almeida@santamarcelina.com', 'senha123', NOW(), 1, 3, 2),  -- Técnico, Santa Marcelina, Ativo
    ('Eduardo Gomes', 'eduardo.gomes@accamargo.com', 'senha123', NOW(), 3, 2, 2);  -- Gerente, A.C Camargo, Ativo
    
    -- Inserir 6 novos registros na tabela usuario (somente Gerente e Técnico), com datas diferentes e sem foto de perfil
INSERT INTO usuario (nome, email, senha, data_cadastro, fkEmpresa, fkTipoUsuario, fkSituacao)
VALUES
    ('João Martins', 'joao.martins@santamarcelina.com', 'senha456', '2024-05-10 14:23:10', 1, 2, 2),  -- Gerente, Santa Marcelina, Ativo
    ('Luana Ferreira', 'luana.ferreira@doutorconsulta.com', 'senha456', '2024-06-15 09:10:05', 2, 3, 2),  -- Técnico, Doutor consulta, Ativo
    ('Ricardo Souza', 'ricardo.souza@santamarcelina.com', 'senha456', '2024-04-21 16:45:30', 1, 2, 2),  -- Gerente, Santa Marcelina, Ativo
    ('Tatiane Lima', 'tatiane.lima@accamargo.com', 'senha456', '2024-07-05 13:15:20', 3, 3, 2),  -- Técnico, A.C Camargo, Ativo
    ('Vitor Costa', 'vitor.costa@doutorconsulta.com', 'senha456', '2024-06-10 11:20:55', 2, 2, 2),  -- Gerente, Doutor consulta, Ativo
    ('Mariana Alves', 'mariana.alves@accamargo.com', 'senha456', '2024-03-18 18:30:45', 3, 3, 2);  -- Técnico, A.C Camargo, Ativo
    
    
SELECT 
    YEAR(data_cadastro) AS ano,  -- Ano do cadastro
    MONTH(data_cadastro) AS mes,  -- Mês do cadastro
    DAY(data_cadastro) AS dia,  -- Dia do cadastro
    COUNT(idUsuario) AS usuarios_cadastrados  -- Contagem de usuários cadastrados
FROM 
    usuario
GROUP BY 
    YEAR(data_cadastro), MONTH(data_cadastro), DAY(data_cadastro)  -- Agrupar por ano, mês e dia
ORDER BY 
    ano ASC, mes ASC, dia ASC;  -- Ordenar por ano, mês e dia

    
    
    -- Inserir usuários cadastrados em outubro de 2024 até hoje (19/10/2024)
INSERT INTO usuario (nome, email, senha, data_cadastro, fkEmpresa, fkTipoUsuario, fkSituacao)
VALUES
    ('Alice Oliveira', 'alice.oliveira@santamarcelina.com', 'senha789', '2024-10-01 09:00:00', 1, 2, 2),  -- Gerente, Santa Marcelina, Ativo
    ('Bruno Mendes', 'bruno.mendes@santamarcelina.com', 'senha789', '2024-10-02 10:15:20', 1, 3, 2),  -- Técnico, Santa Marcelina, Ativo
    ('Cláudia Ferreira', 'claudia.ferreira@doutorconsulta.com', 'senha789', '2024-10-05 11:45:30', 2, 2, 2),  -- Gerente, Doutor consulta, Ativo
    ('Daniel Costa', 'daniel.costa@doutorconsulta.com', 'senha789', '2024-10-07 14:10:45', 2, 3, 2),  -- Técnico, Doutor consulta, Ativo
    ('Eliane Rocha', 'eliane.rocha@accamargo.com', 'senha789', '2024-10-09 08:30:00', 3, 2, 2),  -- Gerente, A.C Camargo, Ativo
    ('Felipe Lima', 'felipe.lima@accamargo.com', 'senha789', '2024-10-10 12:00:00', 3, 3, 2),  -- Técnico, A.C Camargo, Ativo
    ('Gustavo Almeida', 'gustavo.almeida@santamarcelina.com', 'senha789', '2024-10-12 13:50:30', 1, 3, 2),  -- Técnico, Santa Marcelina, Ativo
    ('Heloísa Martins', 'heloisa.martins@doutorconsulta.com', 'senha789', '2024-10-14 10:25:00', 2, 2, 2),  -- Gerente, Doutor consulta, Ativo
    ('Igor Silva', 'igor.silva@accamargo.com', 'senha789', '2024-10-16 15:20:00', 3, 3, 2),  -- Técnico, A.C Camargo, Ativo
    ('Juliana Souza', 'juliana.souza@santamarcelina.com', 'senha789', '2024-10-19 09:30:00', 1, 2, 2);  -- Gerente, Santa Marcelina, Ativo
SELECT 
    YEAR(data_cadastro) AS ano,  -- Ano do cadastro
    CASE 
        WHEN MONTH(data_cadastro) = 1 THEN 'Janeiro'
        WHEN MONTH(data_cadastro) = 2 THEN 'Fevereiro'
        WHEN MONTH(data_cadastro) = 3 THEN 'Março'
        WHEN MONTH(data_cadastro) = 4 THEN 'Abril'
        WHEN MONTH(data_cadastro) = 5 THEN 'Maio'
        WHEN MONTH(data_cadastro) = 6 THEN 'Junho'
        WHEN MONTH(data_cadastro) = 7 THEN 'Julho'
        WHEN MONTH(data_cadastro) = 8 THEN 'Agosto'
        WHEN MONTH(data_cadastro) = 9 THEN 'Setembro'
        WHEN MONTH(data_cadastro) = 10 THEN 'Outubro'
        WHEN MONTH(data_cadastro) = 11 THEN 'Novembro'
        WHEN MONTH(data_cadastro) = 12 THEN 'Dezembro'
    END AS nome_mes,  -- Nome do mês em português
    DAY(data_cadastro) AS dia,  -- Dia do cadastro
    COUNT(idUsuario) AS usuarios_cadastrados  -- Contagem de usuários cadastrados
FROM 
    usuario
GROUP BY 
    YEAR(data_cadastro), MONTH(data_cadastro), DAY(data_cadastro)  -- Agrupar por ano, mês e dia
ORDER BY 
    ano ASC, MONTH(data_cadastro) ASC, dia ASC;  -- Ordenar por ano, nome do mês e dia






