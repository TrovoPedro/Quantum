var database = require("../database/config")

function cadastrar(nomeServidor, situacao) {
    console.log("ACESSEI O USUARIO MODEL \n\n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nomeServidor, situacao);
    
    var instrucaoSql = `
        INSERT INTO servidor (nomeServidor, fkEmpresa, fkLocalizacao, fkTempoAtividade, fkSituacao) VALUES ('${nomeServidor}', '${1}', '${1}', '${1}', ${1});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarServidores(idServidor) {
    console.log("ACESSEI O MEDIDA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n")
    var instrucaoSql = `
    SELECT servidor.nomeServidor, servidor.idServidor, empresa.razao_social, situacao.tipo
    FROM servidor
        JOIN empresa
            ON servidor.fkEmpresa = empresa.idEmpresa
        JOIN situacao
            ON servidor.fkSituacao = situacao.idSituacao
    ORDER BY idServidor;
 `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editarServidor(idServidor, nomeEditado) {
    var instrucaoSql = `
        UPDATE servidor 
        SET nomeServidor = '${nomeEditado}'
        WHERE idServidor = ${idServidor};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



function excluirServidor(idServidor, situacaoEditada) {
    console.log("Executando exclusão lógica do servidor: ", idServidor, situacaoEditada);

    var instrucaoSql = `
        UPDATE servidor 
        SET fkSituacao = ${situacaoEditada} 
        WHERE idServidor = ${idServidor};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



module.exports = {
    cadastrar,
    buscarServidores,
    editarServidor,
    excluirServidor
};