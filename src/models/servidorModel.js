var database = require("../database/config")

function cadastrar(){

}

function buscarServidores(idUsuario) {
    console.log("ACESSEI O MEDIDA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n")
    var instrucaoSql = `
    select nome, fkEmpresa, fkLocalizacao from servidor;
 `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editarServidor(){

}

function excluirServidor(){

}

module.exports = {
    buscarServidores,
    editarServidor,
    excluirServidor
};