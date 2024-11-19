var database = require("../database/config");

// Função geral de buscar quantidade de alertas

function buscarQtdAlerta(valorInput) {
    var instrucaoSql = `SELECT COUNT(*) AS quantidade_alertas FROM alerta WHERE fkComponente = ${valorInput};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql, valorInput)
        .then(function (resultado) {
            return resultado[0].quantidade_alertas;
        })
        .catch(function (error) {
            console.error("Erro ao executar a consulta: ", error);
            throw error;
        });
}


function buscarRiscoAlerta(valorInput) {
    return new Promise((resolve, reject) => {
        const instrucaoSql = `
            SELECT calcular_chance_alerta(${valorInput}) AS chance_alerta_percentual;
        `;

        database.executar(instrucaoSql)
            .then(resultado => {
                console.log("Valores das variáveis @qtdLog e @qtdAlerta: ", resultado)

                resolve(resultado);
            })
            .catch(error => {
                console.error("Erro ao testar as variáveis: ", error);
                reject(error);
            });
    });
}

function buscarConsumoCpu() {

    var instrucaoSql = `select usoComponente from log where fkComponente = 1;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMudancaContexto() {

    var instrucaoSql = `SELECT COALESCE(mudancaContexto, 0) AS mudancaContexto 
    FROM tabelaTrovo;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarCargaSistema() {

    var instrucaoSql = `SELECT COALESCE(cargaSistema, 0) AS cargaSistema 
    FROM tabelaTrovo;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarServicosAtivos(valorInput) {
    var instrucaoSql = `select qtdServicosAtivos from tabelaTrovo;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql, valorInput)
        .then(function (resultado) {
            return resultado[0].qtdServicosAtivos;
        })
        .catch(function (error) {
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