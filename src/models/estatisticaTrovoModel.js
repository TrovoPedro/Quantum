var database = require("../database/config");

// Função geral de buscar quantidade de alertas

function buscarQtdAlerta(valorInput) {
    var instrucaoSql = `SELECT COUNT(*) AS quantidade_alertas FROM alerta WHERE fkComponente = ${valorInput};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql, valorInput)
        .then(function(resultado) {
            return resultado[0].quantidade_alertas;
        })
        .catch(function(error) {
            console.error("Erro ao executar a consulta: ", error);
            throw error;
        });
}


function buscarRiscoAlerta(valorInput) {
    var instrucaoSql = `SELECT 
    l.fkComponente, 
    COUNT(a.idAlerta) AS quantidade_alertas, 
    COUNT(l.idLog) AS quantidade_logs,
    ROUND(IFNULL((COUNT(a.idAlerta) / COUNT(l.idLog)) * 100, 0), 0) AS chance_alerta_percentual
FROM 
    log l
LEFT JOIN 
    alerta a ON l.fkComponente = a.fkComponente
WHERE 
    l.fkComponente = ${valorInput}
GROUP BY 
    l.fkComponente;
`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

function buscarConsumoCpu() {

    var instrucaoSql = `select usoComponente from log where fkComponente = 1;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function buscarMudancaContexto() {

    var instrucaoSql = `select usoComponente from log where fkComponente = 1;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarCargaSistema() {

    var instrucaoSql = `select usoComponente from log where fkComponente = 1;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarServicosAtivos(valorInput) {
    var instrucaoSql = `SELECT COUNT(*) AS quantidade_alertas FROM alerta WHERE fkComponente = ${valorInput};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql, valorInput)
        .then(function(resultado) {
            return resultado[0].quantidade_alertas;
        })
        .catch(function(error) {
            console.error("Erro ao executar a consulta: ", error);
            throw error;
        });
}

function buscarPerdaPacote() {

    var instrucaoSql = `select usoComponente from log where fkComponente = 4;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarUsoMemoriaRam() {

    var instrucaoSql = `select usoComponente from log where fkComponente = 2;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarQtdAlerta,
    buscarRiscoAlerta,
    buscarConsumoCpu,
    buscarMudancaContexto,
    buscarServicosAtivos,
    buscarPerdaPacote,
    buscarCargaSistema,
    buscarUsoMemoriaRam
}