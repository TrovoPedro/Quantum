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

    var instrucaoSql = `select usoComponente from log where fkComponente = 2;`;

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
    var instrucaoSql = `SELECT COALESCE(qtdServicosAtivos, 0) AS qtdServicosAtivos FROM tabelaTrovo;`;
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

    var instrucaoSql = `select usoComponente from log where fkComponente = 1;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarUsoMemoriaSwap() {

    var instrucaoSql = `SELECT COALESCE(consumoMemoriaSwap, 0) AS consumoMemoriaSwap FROM tabelaTrovo;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function buscarTotalMemoriaRam(valorInput) {
    var instrucaoSql = `select totalMemoriaRam from tabelaTrovo;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql, valorInput)
        .then(function (resultado) {
            return resultado[0].totalMemoriaRam;
        })
        .catch(function (error) {
            console.error("Erro ao executar a consulta: ", error);
            throw error;
        });
}

function buscarTotalMemoriaSwap(valorInput) {
    var instrucaoSql = `SELECT COALESCE(totalMemoriaSwap, 0) AS totalMemoriaSwap FROM tabelaTrovo;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql, valorInput)
        .then(function (resultado) {
            return resultado[0].totalMemoriaSwap;
        })
        .catch(function (error) {
            console.error("Erro ao executar a consulta: ", error);
            throw error;
        });
}

function buscarUsoDisco() {
    var instrucaoSql = `SELECT LEFT(usoComponente, 2) AS dois_primeiros_digitos FROM log WHERE fkComponente = 3;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarIoDisco() {
    var instrucaoSql = `SELECT COALESCE(ioDisco, 0) AS ioDisco FROM tabelaTrovo;`;

    console.log("Executando a instrução SQL: cc\n" + instrucaoSql);
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
    buscarUsoMemoriaRam,
    buscarUsoMemoriaSwap,
    buscarTotalMemoriaRam,
    buscarTotalMemoriaSwap,
    buscarUsoDisco,
    buscarIoDisco
}