create database QuantumDB;

use QuantumDB;

create table tipoUsuario(
	idTipoUsuario int primary key auto_increment,
    nome char(7)
);

create table situacao(
	idSituacao int primary key auto_increment,
    tipo char(10)
);

create table tipoComponente(
	idTipoComponente int primary key auto_increment,
    nome varchar(45)
);

create table periodoAtividade(
	idEstado int primary key auto_increment,
    dtHora datetime,
    tempoAtivo int
);

create table empresa(
	idEmpresa int primary key auto_increment,
    razao_social varchar(100),
    cnpj char(14),
    fkSituacao int,
	foreign key (fkSituacao) references situacao(idSituacao)
);

create table endereco(
	idEndereco int primary key auto_increment,
    cep char(8),
    rua varchar(45),
    complemento varchar(45),
    num int,
    fkEmpresa int,
	foreign key (fkEmpresa) references empresa(idEmpresa)
);

create table usuario(
	idUsuario int primary key auto_increment,
    nome varchar(255),
    email varchar(255),
    senha varchar(255),
    data_cadastro datetime,
    fotoPerfil varchar(600),
    fkEmpresa int,
    fkTipoUsuario int,
    fkSituacao int,
	foreign key (fkEmpresa) references empresa(idEmpresa),
	foreign key (fkTipoUsuario) references tipoUsuario(idTipoUsuario),
	foreign key (fkSituacao) references situacao(idSituacao)
);

create table servidor(
	idServidor int primary key auto_increment,
    nomeServidor varchar(45),
    fkEmpresa int,
    fkLocalizacao int,
    fkTempoAtividade int,
    fkSituacao int,
    foreign key (fkEmpresa) references empresa(idEmpresa),
	foreign key (fkLocalizacao) references endereco(idEndereco),
	foreign key (fkSituacao) references situacao(idSituacao),
	foreign key (fkTempoAtividade) references periodoAtividade(idEstado)
);

create table componente(
	idComponente int primary key auto_increment,
    nome varchar(45),
    fabricante varchar(45),
	fkServidor int,
    fkTipoComponente int,
	foreign key (fkServidor) references servidor(idServidor),
	foreign key (fkTipoComponente) references tipoComponente(idTipoComponente)
);

create table log(
	idLog int primary key auto_increment,
    dtHora datetime,
    tempoAtividade datetime,
    usoComponente double,
    fkComponente int,
	foreign key (fkComponente) references componente(idComponente)
);

create table limiteComponente(
	idLimiteComponente int primary key auto_increment,
    valorLimite double,
    fkComponente int,
	foreign key (fkComponente) references componente(idComponente)
);

create table alerta(
	idAlerta int primary key auto_increment,
    data datetime,
    descricao varchar(45),
    fkLog int,
    fkLimiteComponente int,
    foreign key (fkLog) references log(idLog),
	foreign key (fkLimiteComponente) references limiteComponente(idLimiteComponente)
);

SELECT servidor.nomeServidor, empresa.razao_social, situacao.tipo
FROM servidor
JOIN empresa
    ON servidor.fkEmpresa = empresa.idEmpresa
JOIN situacao
    ON servidor.fkSituacao = situacao.idSituacao;
    
INSERT INTO tipoUsuario (nome) 
VALUES
    ('Gerente'),
    ('Tecnico');

INSERT INTO situacao (tipo) 
VALUES
    ('Desativado'),
    ('Ativado');
    
INSERT INTO tipoComponente(nome) 
VALUES
    ('Ram'),
    ('CPU'),
    ('Disco'),
    ('Rede');
    
INSERT INTO periodoAtividade(dtHora, tempoAtivo) 
VALUES
    (now(), 5),
    (now(), 10);
    
INSERT INTO empresa(razao_social, cnpj, fkSituacao) 
VALUES
    ('Santa Marcelina', '90847581904876', 2),
    ('Doutor consulta', '90847581904221', 2),
    ('A.C Camargo', '10289465718298', 2);
    
INSERT INTO endereco(cep, rua, complemento, num, fkEmpresa) 
VALUES
    (08485430, 'Rua arroio triunfo', 'Hospital', 42, 1),
    (08485540, 'Rua ladeira porto geral', 'Hospital', 1991, 2),
    (09283727, 'Rua liberdade', 'Hospital', 3955, 3);
    
INSERT INTO servidor( nomeServidor, fkEmpresa, fkLocalizacao, fkTempoAtividade, fkSituacao) 
VALUES
    ('Servidor 1', 1, 1, 1, 2),
    ('Servidor 2', 2, 2, 2, 1),
    ('Servidor 3', 3, 3, 1, 2);
    
select * from servidor;