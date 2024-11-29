CREATE DATABASE QuantumDB;

-- drop database QuantumDB;

USE QuantumDB;


SELECT * FROM componente;



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


select * from usuario; 

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


SELECT 
    s.nomeServidor AS Servidor,
    c.nome AS Componente,
    MIN(l.usoComponente) AS MinimoDeUso,
    MAX(l.usoComponente) AS MaximoDeUso
FROM log l
JOIN componente c ON l.fkComponente = c.idComponente
JOIN servidor s ON l.fkServidor = s.idServidor
JOIN situacao st ON s.fkSituacao = st.idSituacao
WHERE DATE(l.dtHora) = CURDATE()
  AND st.tipo = 'Ativado'
GROUP BY s.nomeServidor, c.nome
ORDER BY s.nomeServidor, c.nome;



SELECT 
    s.nomeServidor AS NomeServidor,
    e.razao_social AS Empresa,
    st.tipo AS Situacao
FROM servidor s
JOIN empresa e ON s.fkEmpresa = e.idEmpresa
JOIN situacao st ON s.fkSituacao = st.idSituacao
ORDER BY st.tipo = 'Desativado', s.nomeServidor;


SELECT 
    s.nomeServidor AS NomeServidor,
    CASE
        WHEN COUNT(c.idComponente) >= 2 THEN 'Crítico'
        ELSE st.tipo
    END AS Estado
FROM servidor s
JOIN situacao st ON s.fkSituacao = st.idSituacao
LEFT JOIN log l ON l.fkServidor = s.idServidor
LEFT JOIN componente c ON l.fkComponente = c.idComponente
LEFT JOIN limiteComponente lc ON c.idComponente = lc.fkComponente
WHERE l.dtHora >= CURDATE() - INTERVAL 1 DAY
  AND l.usoComponente > lc.valorLimite
GROUP BY s.nomeServidor, st.tipo
ORDER BY s.nomeServidor
LIMIT 0, 1000;




select * from servidor;



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
    tempoAtividade INT,
    usoComponente DOUBLE,
    fkComponente INT,
    fkServidor INT,
    FOREIGN KEY (fkComponente) REFERENCES componente(idComponente),
    FOREIGN KEY (fkServidor) REFERENCES servidor(idServidor)
);


INSERT INTO log (dtHora, tempoAtividade, usoComponente, fkComponente, fkServidor)
VALUES ('2024-11-19 10:30:00', 120, 85.5, 1, 1);


-- Logs para o Servidor 1
INSERT INTO log (dtHora, tempoAtividade, usoComponente, fkComponente, fkServidor)
VALUES 
    (CONCAT(CURDATE(), ' 09:00:00'), 120, 82.9, 1, 1),  -- CPU
    (CONCAT(CURDATE(), ' 11:00:00'), 120, 53.3, 2, 1),  -- RAM
    (CONCAT(CURDATE(), ' 14:00:00'), 120, 67.9, 3, 1);-- DISCO
 -- REDE

-- Logs para o Servidor 2
INSERT INTO log (dtHora, tempoAtividade, usoComponente, fkComponente, fkServidor)
VALUES 
    (CONCAT(CURDATE(), ' 08:30:00'), 120, 50.5, 1, 2),  -- CPU
    (CONCAT(CURDATE(), ' 10:45:00'), 120, 78.4, 2, 2),  -- RAM
    (CONCAT(CURDATE(), ' 13:15:00'), 120, 82.9, 3, 2); -- DISCO
  -- REDE

-- Logs para o Servidor 3
INSERT INTO log (dtHora, tempoAtividade, usoComponente, fkComponente, fkServidor)
VALUES 
    (CONCAT(CURDATE(), ' 07:45:00'), 120, 85.1, 1, 3),  -- CPU
    (CONCAT(CURDATE(), ' 09:30:00'), 120, 78.3, 2, 3),  -- RAM
    (CONCAT(CURDATE(), ' 12:00:00'), 120, 56.0, 3, 3);  -- DISCO





CREATE TABLE limiteComponente(
    idLimiteComponente INT PRIMARY KEY AUTO_INCREMENT,
    valorLimite DOUBLE,
    fkComponente INT,
    FOREIGN KEY (fkComponente) REFERENCES componente(idComponente)
);


select * from log;
select * from limitecomponente;

INSERT INTO limiteComponente (valorLimite, fkComponente) VALUES (88.0, 1); 
INSERT INTO limiteComponente (valorLimite, fkComponente) VALUES (84.0, 2); 
INSERT INTO limiteComponente (valorLimite, fkComponente) VALUES (90.0, 3); 
INSERT INTO limiteComponente (valorLimite, fkComponente) VALUES (3.0, 4);



select * from componente;
select * from limitecomponente;

-- Tabela alerta
CREATE TABLE alerta(
    idAlerta INT PRIMARY KEY AUTO_INCREMENT,
    data DATETIME,
    descricao VARCHAR(45),
    fkLog INT,
    fkLimiteComponente INT,
    fkComponente INT,
    FOREIGN KEY (fkLog) REFERENCES log(idLog),
    FOREIGN KEY (fkLimiteComponente) REFERENCES limiteComponente(idLimiteComponente),
    FOREIGN KEY (fkComponente) REFERENCES componente(idComponente)
);



 SELECT 
    c.nome AS Componente,
    '30 dias' AS Periodo,  
    COUNT(a.idAlerta) AS Alerta
FROM alerta a
JOIN log l ON a.fkLog = l.idLog
JOIN componente c ON l.fkComponente = c.idComponente
WHERE a.data >= CURDATE() - INTERVAL 30 DAY
GROUP BY c.nome
ORDER BY Alerta DESC;


select * from alerta;

SELECT * FROM alerta WHERE data IS NOT NULL;

SELECT * FROM alerta WHERE data >= CURDATE() - INTERVAL 30 DAY;





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




