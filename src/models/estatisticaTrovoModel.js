var database = require("../database/config");


function buscarConsumoCpu() {
    
    var instrucaoSql = `select usoComponente from log where fkComponente = 1;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPerdaPacote() {
    
    var instrucaoSql = `select usoComponente from log where fkComponente = 4;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarConsumoCpu,
    buscarPerdaPacote
}