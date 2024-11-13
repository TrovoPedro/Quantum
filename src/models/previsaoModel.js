var database = require("../database/config");

function buscarPorId(idServidor) {


  var instrucaoSql = `
   SELECT 
    empresa.razao_social AS nomeEmpresa,
    servidor.nomeServidor,
    MIN(log.dtHora) AS inicio_downtime,  
    MAX(log.dtHora) AS fim_downtime,  
    TIMESTAMPDIFF(MINUTE, MIN(log.dtHora), MAX(log.dtHora)) AS downtime_minutos
FROM 
    log
JOIN 
    componente ON log.fkComponente = componente.idComponente
JOIN 
    servidor ON componente.fkServidor = servidor.idServidor
JOIN 
    empresa ON servidor.fkEmpresa = empresa.idEmpresa
WHERE 
    log.usoComponente <= 0 OR log.usoComponente >= 85 
GROUP BY 
    servidor.idServidor, DATE(log.dtHora) 
HAVING 
    downtime_minutos > 0  
ORDER BY 
    downtime_minutos DESC;`;

  return database.executar(instrucaoSql);
  

}

function buscarTendenciaUsoRamPorDiaSemana() {
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
            tipoComponente.nome = 'Ram'
        GROUP BY 
            dia_semana
        ORDER BY 
            FIELD(dia_semana, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
    `;

    return database.executar(instrucaoSql);
}


module.exports = {

  buscarPorId, 
  buscarTendenciaUsoRamPorDiaSemana,

};
