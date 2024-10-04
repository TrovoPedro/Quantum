CREATE DATABASE Quantum;

USE Quantum;

CREATE TABLE endereco (
    idEndereco INT PRIMARY KEY AUTO_INCREMENT,
    cep CHAR(8),
    rua VARCHAR(45),
    complemento VARCHAR(255),
    num INT
);


CREATE TABLE empresa (
    idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(45),
    CNPJ CHAR(14),
    fkEndereco INT,
    FOREIGN KEY (fkEndereco) REFERENCES endereco(idEndereco)
);


CREATE TABLE estado (
    idEstado INT PRIMARY KEY AUTO_INCREMENT,
    dtHora DATETIME,
    operacao TINYINT,
    descricao VARCHAR(255),
    tipo VARCHAR(45)
);


CREATE TABLE servidor (
    idServidor INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    fkEmpresa INT,
    fkLocalizacao INT, -- Este campo pode referenciar uma tabela "localizacao" que não foi incluída no DER
    fkEstado INT,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa),
    FOREIGN KEY (fkEstado) REFERENCES estado(idEstado)
);


CREATE TABLE componente (
    idComponente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    fabricante VARCHAR(45),
    fkServidor INT,
    limite VARCHAR(45),
    unidade VARCHAR(45),
    FOREIGN KEY (fkServidor) REFERENCES servidor(idServidor)
);

CREATE TABLE log (
    idLog INT PRIMARY KEY AUTO_INCREMENT,
    dtHora DATETIME,
    tempoAtividade DATETIME,
    porcentagemUso DOUBLE,
    fkComponente INT,
    FOREIGN KEY (fkComponente) REFERENCES componente(idComponente)
);


CREATE TABLE alerta (
    idAlerta INT PRIMARY KEY AUTO_INCREMENT,
    data DATETIME,
    descricao VARCHAR(45),
    fkLog INT,
    FOREIGN KEY (fkLog) REFERENCES log(idLog)
);


CREATE TABLE servico (
    idServico INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    fkEmpresa INT,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);


CREATE TABLE tipo (
    idTipo INT PRIMARY KEY AUTO_INCREMENT,
    cargo VARCHAR(45)
);


CREATE TABLE usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255),
    email VARCHAR(255),
    senha VARCHAR(255),
    fkEmpresa INT,
    fkTipo INT,
    createdAt DATETIME,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa),
    FOREIGN KEY (fkTipo) REFERENCES tipo(idTipo)
);


