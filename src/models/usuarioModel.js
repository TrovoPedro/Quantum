var database = require("../database/config");

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n\n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha);

    var instrucaoSql = `
        SELECT idUsuario, email, nome, senha, fkTipoUsuario, fkEmpresa FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



function cadastrar(nome, email, senha, empresa) {
    console.log("ACESSEI O USUARIO MODEL \n\n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, empresa);

    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, data_cadastro, fkEmpresa, fkTipoUsuario, fkSituacao) 
        VALUES ('${nome}', '${email}', '${senha}', NOW(), '${empresa}', '${2}', '${2}');
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function listarEmpresa() {
    console.log("ACESSEI O MEDIDA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n")
    var instrucaoSql = `
        SELECT idEmpresa, razao_social from empresa;
 `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function cadastrarFuncionario(nome, email, senha, empresa) {
    console.log("ACESSEI O USUARIO MODEL \n\n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, empresa);

    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, data_cadastro, fkEmpresa, fkTipoUsuario, fkSituacao) 
        VALUES ('${nome}', '${email}', '${senha}', NOW(), '${empresa}', '${3}', '${2}');
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPorId(idUsuario) {
    var instrucaoSql = `SELECT usuario.idUsuario, tipoUsuario.nome AS tipoNome, usuario.email, usuario.nome, empresa.razao_social, situacao.tipo
FROM usuario
JOIN situacao ON usuario.fkSituacao = situacao.idSituacao
JOIN empresa ON usuario.fkEmpresa = empresa.idEmpresa
JOIN tipoUsuario ON usuario.fkTipoUsuario = tipoUsuario.idTipoUsuario
WHERE usuario.fkTipoUsuario = 3  
ORDER BY usuario.idUsuario;`;

    return database.executar(instrucaoSql);
}


module.exports = {
    autenticar,
    cadastrar,
    listarEmpresa,
    cadastrarFuncionario,
    buscarPorId
};
