const { buscarComponente } = require("../controllers/previsaoController");
var database = require("../database/config");

function buscarPorId(idServidor) {
    var instrucaoSql = `
   SELECT 
    servidor.idServidor,
    servidor.nomeServidor,
    SUM(downtime.downtime_minutos) AS total_downtime
FROM 
    servidor
JOIN 
    (SELECT 
        log.fkServidor,
        TIMESTAMPDIFF(MINUTE, log.dtHora, 
            (SELECT MIN(dtHora) 
             FROM log AS next_log 
             WHERE next_log.fkServidor = log.fkServidor 
               AND next_log.dtHora > log.dtHora 
             LIMIT 1)
        ) AS downtime_minutos
     FROM 
        log
     WHERE 
        (log.usoComponente <= 0 OR log.usoComponente >= 85)
        AND log.dtHora >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) -- Apenas os últimos 7 dias
     ) AS downtime ON servidor.idServidor = downtime.fkServidor
GROUP BY 
    servidor.idServidor, servidor.nomeServidor
ORDER BY 
    total_downtime DESC;`;

    return database.executar(instrucaoSql);
}

function buscarSelectComponente() {
    var instrucaoSql = `
    SELECT 
    componente.idComponente,
    componente.nome
   FROM 
    componente 
    WHERE idComponente = 1 OR idComponente = 2;`;

    return database.executar(instrucaoSql);
}

function buscarTendenciaUsoRamPorDiaSemana(componenteSelect, servidorSelect) {

    const instrucaoSql = `
        SELECT 
            DAYNAME(log.dtHora) AS dia_semana,
            AVG(log.usoComponente) AS media_uso_ram
        FROM 
            log
        JOIN 
            componente ON log.fkComponente = componente.idComponente
        JOIN 
            tipoComponente ON componente.fkTipoComponente = tipoComponente.idTipoComponente
        WHERE 
            tipoComponente.idTipoComponente = ${componenteSelect} AND log.fkServidor = ${servidorSelect}
        GROUP BY 
            dia_semana
        ORDER BY 
            FIELD(dia_semana, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');`;

    return database.executar(instrucaoSql, [componenteSelect, servidorSelect]);
}

async function calcularPrevisaoDowntime() {
    const instrucaoSql = `
         SELECT 
    servidor.nomeServidor,
    DAYOFWEEK(log.dtHora) AS dia_semana, -- Número do dia da semana (1=Domingo, 7=Sábado)
    SUM(TIMESTAMPDIFF(MINUTE, log.dtHora, 
        (SELECT MIN(next_log.dtHora) 
         FROM log AS next_log 
         WHERE next_log.fkServidor = log.fkServidor 
           AND next_log.dtHora > log.dtHora 
         LIMIT 1)
    )) AS total_downtime_minutos -- Soma do downtime em minutos por dia da semana
FROM 
    log
JOIN 
    servidor ON log.fkServidor = servidor.idServidor
WHERE 
    (log.usoComponente <= 0 OR log.usoComponente >= 85)
    AND log.dtHora >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) -- Filtro para os últimos 7 dias
GROUP BY 
    servidor.nomeServidor, dia_semana
ORDER BY 
    servidor.nomeServidor, dia_semana;

    `;
    return database.executar(instrucaoSql);
}

function buscarmediaRam() {

    const instrucaoSql = `select 
servidor.nomeServidor,
avg(log.usoComponente) AS media_ram
from log 
 JOIN 
    componente ON log.fkComponente = componente.idComponente
    JOIN 
 tipoComponente ON componente.fkTipoComponente = tipoComponente.idTipoComponente
    JOIN 
    servidor ON log.fkServidor = servidor.idServidor
    WHERE 
    log.fkComponente = 2
    group by 
    servidor.idServidor 
    order by media_ram desc;`;
    return database.executar(instrucaoSql);
}

function buscarmediaCpu() {

    const instrucaoSql = `select 
    servidor.nomeServidor,
    avg(log.usoComponente) AS media_cpu
    from log 
 JOIN 
    componente ON log.fkComponente = componente.idComponente
    JOIN 
 tipoComponente ON componente.fkTipoComponente = tipoComponente.idTipoComponente
    JOIN 
    servidor ON log.fkServidor = servidor.idServidor
    WHERE 
    log.fkComponente = 1
    group by 
    servidor.idServidor 
    order by media_cpu desc;`;
    return database.executar(instrucaoSql);
}

function buscarpicoCpu() {
    const instrucaoSql = `    select 
    max(log.usoComponente) AS maximo_usoCpu,
    min(log.usoComponente) AS minimo_usoCpu,
    servidor.nomeServidor
    from log
    JOIN 
    componente ON log.fkComponente = componente.idComponente
    JOIN 
 tipoComponente ON componente.fkTipoComponente = tipoComponente.idTipoComponente
    JOIN 
    servidor ON log.fkServidor = servidor.idServidor
    WHERE 
    log.fkComponente = 1
    group by 
    servidor.idServidor 
    order by nomeServidor;`;
    return database.executar(instrucaoSql)
}

function buscarpicoRam() {
    const instrucaoSql = `    select 
    max(log.usoComponente) AS maximo_usoRam,
    min(log.usoComponente) AS minimo_usoRam,
    servidor.nomeServidor
    from log
    JOIN 
    componente ON log.fkComponente = componente.idComponente
    JOIN 
 tipoComponente ON componente.fkTipoComponente = tipoComponente.idTipoComponente
    JOIN 
    servidor ON log.fkServidor = servidor.idServidor
    WHERE 
    log.fkComponente = 2
    group by 
    servidor.idServidor 
    order by nomeServidor;`;
    return database.executar(instrucaoSql)
}
module.exports = {
    buscarPorId,
    buscarSelectComponente,
    buscarTendenciaUsoRamPorDiaSemana,
    calcularPrevisaoDowntime,
    buscarmediaRam,
    buscarmediaCpu,
    buscarpicoCpu,
    buscarpicoRam
};
