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
            SELECT calcular_probabilidade_alerta(${valorInput}) AS calcular_probabilidade_alerta
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
    var instrucaoSql = `SELECT COALESCE(qtdServicosAtivos, 0) AS qtdServicosAtivos 
        FROM tabelaTrovo
        WHERE qtdServicosAtivos > 0;
`;
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
    var instrucaoSql = `SELECT totalMemoriaSwap
    FROM tabelaTrovo
    WHERE totalMemoriaSwap IS NOT NULL;
`;
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

function buscarTotalDisco(valorInput) {
    var instrucaoSql = `SELECT espacoTotalDisco 
        FROM tabelaTrovo
        WHERE espacoTotalDisco IS NOT NULL;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql, valorInput)
        .then(function (resultado) {
            return resultado[0].espacoTotalDisco;
        })
        .catch(function (error) {
            console.error("Erro ao executar a consulta: ", error);
            throw error;
        });
}

function buscarEspacoLivre(valorInput) {
    var instrucaoSql = `
        SELECT 
            l.usoComponente, 
            t.espacoTotalDisco,
            FLOOR(GREATEST(t.espacoTotalDisco - (t.espacoTotalDisco * (LEAST(l.usoComponente, 100) / 100)), 0)) AS espacoLivre
        FROM log l
        LEFT JOIN tabelaTrovo t ON l.fkComponente = t.fkComponente
        WHERE t.espacoTotalDisco IS NOT NULL
        AND (t.espacoTotalDisco - (t.espacoTotalDisco * (LEAST(l.usoComponente, 100) / 100))) IS NOT NULL
        ORDER BY l.dtHora DESC
        LIMIT 1;  -- Retorna apenas o último resultado
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql)  // Sem valorInput se não for necessário
        .then(function (resultado) {
            if (resultado.length > 0) {
                return resultado[0].espacoLivre;  // Retorna o espaço livre
            } else {
                throw new Error("Nenhum dado encontrado.");
            }
        })
        .catch(function (error) {
            console.error("Erro ao executar a consulta: ", error);
            throw error;
        });
}

function buscarTaxaTransferencia() {
    var instrucaoSql = `SELECT taxaTransfarencia 
        FROM tabelaTrovo 
        WHERE taxaTransfarencia IS NOT NULL;
`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarErroTcp() {
    var instrucaoSql = `SELECT errosTcp 
        FROM tabelaTrovo 
        WHERE errosTcp IS NOT NULL;
`;

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
    buscarUsoMemoriaRam,
    buscarUsoMemoriaSwap,
    buscarTotalMemoriaRam,
    buscarTotalMemoriaSwap,
    buscarUsoDisco,
    buscarIoDisco,
    buscarTotalDisco,
    buscarEspacoLivre,
    buscarTaxaTransferencia,
    buscarErroTcp
}