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


-- TABELAS DASHBOARD JULIA ARAUJO
CREATE TABLE tentativa_login (
    idTentativa INT PRIMARY KEY AUTO_INCREMENT,
    ipUsuario VARCHAR(45) NOT NULL,
    email VARCHAR(255),
    dataHora DATETIME NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL,
    fkUsuario INT,
    FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario)
);

SELECT ipUsuario, dataHora,COUNT(*) AS tentativas
FROM tentativa_login
GROUP BY ipUsuario LIMIT 4;


CREATE TABLE erros (
    idErro INT PRIMARY KEY AUTO_INCREMENT,
    descricaoErro VARCHAR(255) NOT NULL,
    dataHora DATETIME NOT NULL DEFAULT NOW(),
    fkUsuario INT,
    enderecoIp VARCHAR(45),
    modulo VARCHAR(100),
    FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario)
);

SELECT descricaoErro, COUNT(*) AS frequencia
FROM erros
GROUP BY descricaoErro
ORDER BY frequencia DESC;


CREATE TABLE sessoes (
    idSessao INT PRIMARY KEY AUTO_INCREMENT,
    fkUsuario INT,
    inicioSessao DATETIME NOT NULL DEFAULT NOW(),
    fimSessao DATETIME,
    cpuUsado DOUBLE,
    ramUsada DOUBLE,
    discoUsado DOUBLE,
    FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario)
);

SELECT fkUsuario, AVG(cpuUsado) AS mediaCpu, AVG(ramUsada) AS mediaRam, AVG(discoUsado) AS mediaDisco
FROM sessoes
GROUP BY fkUsuario;


-- Inserindo tentativas de login na tabela tentativa_login
INSERT INTO tentativa_login (ipUsuario, email, dataHora, status, fkUsuario) 
VALUES 
('192.168.0.1', 'usuario1@teste.com', '2024-11-16 10:05:00', 'sucesso', 2),
('192.168.0.2', 'usuario2@teste.com', '2024-11-16 10:10:00', 'falha', NULL),
('192.168.0.3', 'usuario3@teste.com', '2024-11-16 10:20:00', 'sucesso', 2),
('192.168.0.1', 'usuario1@teste.com', '2024-11-16 10:25:00', 'falha', NULL),
('192.168.0.4', 'usuario4@teste.com', '2024-11-16 10:30:00', 'sucesso', 2),
('192.168.0.2', 'usuario2@teste.com', '2024-11-16 10:40:00', 'falha', NULL),
('192.168.0.5', 'usuario5@teste.com', '2024-11-16 11:00:00', 'falha', NULL),
('192.168.0.1', 'usuario1@teste.com', '2024-11-16 11:15:00', 'sucesso', 2),
('192.168.0.6', 'usuario6@teste.com', '2024-11-16 11:20:00', 'falha', NULL),
('192.168.0.4', 'usuario4@teste.com', '2024-11-16 11:30:00', 'sucesso', 2),
('192.168.0.3', 'usuario3@teste.com', '2024-11-16 11:40:00', 'sucesso', 2),
('192.168.0.7', 'usuario7@teste.com', '2024-11-16 11:50:00', 'falha', NULL),
('192.168.0.2', 'usuario2@teste.com', '2024-11-16 12:00:00', 'falha', NULL),
('192.168.0.1', 'usuario1@teste.com', '2024-11-16 12:10:00', 'sucesso', 2);

