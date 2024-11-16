var database = require("../database/config");

function buscarNumeroAtividade(idServidor) {
    console.log("Acessando buscarMediaCPU no graficosModel.js para o servidor: ", idServidor);

    var instrucaoSql = `
        SELECT 
    situacao.tipo AS estado_servidor,
    COUNT(*) AS total
FROM 
    servidor
JOIN 
    situacao ON servidor.fkSituacao = situacao.idSituacao
GROUP BY 
    situacao.tipo;	
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMediaCPU(idServidor) {
    console.log("Acessando buscarMediaCPU no graficosModel.js para o servidor: ", idServidor);

    var instrucaoSql = `
        SELECT 
            AVG(usoComponente) AS mediaUsoCPU
        FROM 
            log
        JOIN 
            componente ON log.fkComponente = componente.idComponente
        JOIN 
            tipoComponente ON componente.fkTipoComponente = tipoComponente.idTipoComponente
        WHERE 
            tipoComponente.nome = 'CPU';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMediaRAM(idServidor) {
    console.log("Acessando buscarMediaCPU no graficosModel.js para o servidor: ", idServidor);

    var instrucaoSql = `
        SELECT 
            AVG(usoComponente) AS mediaUsoRAM
        FROM 
            log
        JOIN 
            componente ON log.fkComponente = componente.idComponente
        JOIN 
            tipoComponente ON componente.fkTipoComponente = tipoComponente.idTipoComponente
        WHERE 
            tipoComponente.nome = 'Ram';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMediaDisco(idServidor) {
    console.log("Acessando buscarMediaCPU no graficosModel.js para o servidor: ", idServidor);

    var instrucaoSql = `
       SELECT 
            AVG(usoComponente) AS mediaUsoDisco
        FROM 
            log
        JOIN 
            componente ON log.fkComponente = componente.idComponente
        JOIN 
            tipoComponente ON componente.fkTipoComponente = tipoComponente.idTipoComponente
        WHERE 
            tipoComponente.nome = 'Disco';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function buscarUptimeSemanal(idServidor) {
    console.log("Acessando buscarUptimeSemanal no usuarioModel.js para o servidor: ", idServidor);

    var instrucaoSql = `
        SELECT 
    servidor.nomeServidor,
    DAYNAME(periodoAtividade.dtHora) AS diaSemana,
    ROUND((SUM(periodoAtividade.tempoAtivo) / 1440) * 100, 2) AS uptime_percent
FROM 
    servidor
JOIN 
    periodoAtividade ON servidor.fkTempoAtividade = periodoAtividade.idEstado
GROUP BY 
    servidor.nomeServidor, diaSemana;

    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUptimeSemanal,
    buscarMediaCPU,
    buscarMediaRAM,
    buscarMediaDisco,
    buscarNumeroAtividade
};
