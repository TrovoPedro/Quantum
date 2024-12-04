CREATE DATABASE QuantumDB;

-- drop database QuantumDB;

USE QuantumDB;


SELECT * FROM usuario;



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
    descricao varchar(100),
    fkEmpresa INT,
    fkLocalizacao INT,
    fkTempoAtividade INT,
    fkSituacao INT,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa),
    FOREIGN KEY (fkLocalizacao) REFERENCES endereco(idEndereco),
    FOREIGN KEY (fkSituacao) REFERENCES situacao(idSituacao),
    FOREIGN KEY (fkTempoAtividade) REFERENCES periodoAtividade(idEstado)
);

INSERT INTO servidor(nomeServidor, descricao, fkEmpresa, fkLocalizacao, fkTempoAtividade, fkSituacao) 
VALUES 
    ('Servidor 1', 'Servidor principal responsável por aplicações críticas', 1, 1, 1, 2),
    ('Servidor 2', 'Servidor de backup para sistemas internos - Desativado devido a manutenção programada', 1, 2, 2, 1),
    ('Servidor 3', 'Servidor dedicado à rede de testes', 1, 3, 1, 2);



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



select * from servidor;



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
		('DISCO', 'Seagate', 1, 3),
		('REDE', 'Corsair', 1, 4);
       

      

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
    (CONCAT(CURDATE(), ' 14:00:00'), 120, 67.9, 3, 1),-- DISCO
	(CONCAT(CURDATE(), ' 09:00:00'), 120, 88.1, 1, 1),  -- CPU
    (CONCAT(CURDATE(), ' 11:00:00'), 120, 67.2, 2, 1),  -- RAM
    (CONCAT(CURDATE(), ' 14:00:00'), 120, 81.0, 3, 1);-- DISCO
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
    (CONCAT(CURDATE(), ' 12:00:00'), 120, 56.0, 3, 3),  -- DISCO
	(CONCAT(CURDATE(), ' 07:45:00'), 120, 82.8, 1, 3),  -- CPU
    (CONCAT(CURDATE(), ' 09:30:00'), 120, 84.9, 2, 3),  -- RAM
    (CONCAT(CURDATE(), ' 12:00:00'), 120, 72.2, 3, 3);  





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
select * from limiteComponente;

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


-- show tables;


INSERT INTO usuario(nome,email,senha,fktipoUsuario) VALUES ("Davison Ferreira", "davidsonmendes@gmail.com","12345",1);


CREATE TABLE tabelaTrovo(
    idTrovo INT PRIMARY KEY AUTO_INCREMENT,
    qtdServicosAtivos INT,
    mudancaContexto INT,
    cargaSistema INT,
    taxaTransfarencia INT,
    errosTcp INT,
    consumoMemoriaSwap INT,
    totalMemoriaRam BIGINT,
    totalMemoriaSwap BIGINT,
    ioDisco INT,
    espacoLivreDisco INT,
    espacoTotalDisco INT,
    fkComponente INT,
    FOREIGN KEY (fkComponente) REFERENCES componente(idComponente)
);



DELIMITER //

CREATE FUNCTION calcular_probabilidade_alerta(pFkComponente INT)
RETURNS FLOAT
DETERMINISTIC
BEGIN
    DECLARE total_logs INT DEFAULT 0;
    DECLARE total_alertas INT DEFAULT 0;
    DECLARE probabilidade FLOAT DEFAULT 0;

    -- Total de registros no log para o componente
    SELECT COUNT(*)
    INTO total_logs
    FROM log
    WHERE fkComponente = pFkComponente;

    -- Total de alertas emitidos para o componente
    SELECT COUNT(*)
    INTO total_alertas
    FROM alerta
    WHERE fkComponente = pFkComponente;

    -- Calcula a probabilidade
    IF total_logs > 0 THEN
        SET probabilidade = total_alertas / total_logs;
    ELSE
        SET probabilidade = 0; -- Evita divisão por zero
    END IF;

    RETURN probabilidade;
END;
//

DELIMITER ;



 

SELECT 
    a.mes,
    a.quantidade_alertas,
    a.quantidade_alertas - IFNULL(b.quantidade_alertas, 0) AS variacao_alertas
FROM (
    SELECT 
        MONTH(a.data) AS mes,
        COUNT(*) AS quantidade_alertas
    FROM 
        alerta a
    JOIN 
        log l ON a.fkLog = l.idLog
    JOIN
        componente c ON l.fkComponente = c.idComponente
    WHERE 
        c.idComponente = 1
    GROUP BY 
        MONTH(a.data)
) AS a
LEFT JOIN (
    SELECT 
        MONTH(a.data) AS mes,
        COUNT(*) AS quantidade_alertas
    FROM 
        alerta a
    JOIN 
        log l ON a.fkLog = l.idLog
    JOIN
        componente c ON l.fkComponente = c.idComponente
    WHERE 
        c.idComponente = 1
    GROUP BY 
        MONTH(a.data)
) AS b ON a.mes = b.mes + 1
ORDER BY 
    a.mes;



--


SELECT 
    servidor.idServidor,
    servidor.nomeServidor,
    SUM(downtime.downtime_minutos) AS total_downtime
FROM 
    servidor
JOIN 
    (SELECT 
        log.fkServidor,
        TIMESTAMPDIFF(MINUTE, log.dtHora, 
            (SELECT MIN(dtHora) 
             FROM log AS next_log 
             WHERE next_log.fkServidor = log.fkServidor 
               AND next_log.dtHora > log.dtHora 
             LIMIT 1)
        ) AS downtime_minutos
     FROM 
        log
     WHERE 
        (log.usoComponente <= 0 OR log.usoComponente >= 85)
        AND log.dtHora >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) -- Apenas os últimos 7 dias
     ) AS downtime ON servidor.idServidor = downtime.fkServidor
       AND servidor.fkSituacao = 2
GROUP BY 
    servidor.idServidor, servidor.nomeServidor
ORDER BY 
    total_downtime DESC;
    
    
    
 select * from usuario;   