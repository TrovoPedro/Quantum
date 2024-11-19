var database = require("../database/config");

function buscarNumeroServidoresTotal(idServidor) {
    console.log("Acessando buscarMediaCPU no graficosModel.js para o servidor: ", idServidor);

    var instrucaoSql = `
        select count(*) from servidor;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarNumeroServidoresAtivado(idServidor) {
    console.log("Acessando buscarNumeroServidoresDesativado no graficosModel.js para o servidor: ", idServidor);

    var instrucaoSql = `
        SELECT COUNT(*) AS servidores_Ativados
    FROM servidor
    JOIN situacao ON servidor.fkSituacao = situacao.idSituacao
    WHERE fkSituacao = 2;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarNumeroServidoresDesativado(idServidor) {
    console.log("Acessando buscarNumeroServidoresDesativado no graficosModel.js para o servidor: ", idServidor);

    var instrucaoSql = `
        SELECT COUNT(*) AS servidores_desativados
    FROM servidor
    JOIN situacao ON servidor.fkSituacao = situacao.idSituacao
    WHERE fkSituacao = 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMediaCPU(idServidor) {
    console.log("Acessando buscarMediaCPU no graficosModel.js para o servidor: ", idServidor);

    var instrucaoSql = `
         SELECT 
    DATE(log.dtHora) AS dia, 
    MAX(log.usoComponente) AS maxUsoCPU, 
    MIN(log.usoComponente) AS minUsoCPU
FROM 
    log
JOIN 
    componente ON log.fkComponente = componente.idComponente
JOIN 
    tipoComponente ON componente.fkTipoComponente = tipoComponente.idTipoComponente
WHERE 
    tipoComponente.nome = 'CPU'
GROUP BY 
    DATE(log.dtHora)
ORDER BY 
    dia;

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

function buscarAlertasPorServidor(idServidor) {
    console.log("Acessando buscarMediaCPU no graficosModel.js para o servidor: ", idServidor);

    var instrucaoSql = `
      SELECT 
    c.nome AS nome_componente,
    COUNT(a.idAlerta) AS total_alertas
FROM 
    alerta a
JOIN 
    log l ON a.fkLog = l.idLog
JOIN 
    componente c ON l.fkComponente = c.idComponente
GROUP BY 
    c.nome;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarUptimeSemanal(idServidor) {
    console.log("Acessando buscarUptimeSemanal no usuarioModel.js para o servidor: ", idServidor);

    var instrucaoSql = `
        SELECT 
    servidor.nomeServidor,
    SUM(periodoAtividade.tempoAtivo) AS totalTempoAtivo,
    ROUND(SUM(periodoAtividade.tempoAtivo) / (7 * 24) * 100, 2) AS uptime_percent
FROM 
    servidor
JOIN 
    periodoAtividade ON servidor.fkTempoAtividade = periodoAtividade.idEstado
GROUP BY 
    servidor.nomeServidor;

    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarComponentePorServidor(idServidor) {
    console.log("Acessando buscarComponentePorServidor no usuarioModel.js para o servidor: ", idServidor);

    var instrucaoSql = `
        SELECT 
    servidor.nomeServidor as Servidor,
    componente.nome AS Componente,
    log.usoComponente as Uso,
    limiteComponente.valorLimite as Limite
FROM 
    componente
JOIN 
    servidor ON componente.fkServidor = servidor.idServidor
JOIN 
    log ON log.fkComponente = componente.idComponente
JOIN 
    limiteComponente ON limiteComponente.fkComponente = componente.idComponente
WHERE 
    log.usoComponente > limiteComponente.valorLimite;

    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUptimeSemanal,
    buscarMediaCPU,
    buscarMediaRAM,
    buscarMediaDisco,
    buscarNumeroServidoresTotal,
    buscarNumeroServidoresDesativado,
    buscarNumeroServidoresAtivado,
    buscarAlertasPorServidor,
    buscarComponentePorServidor
};
