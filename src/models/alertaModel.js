// const { mostrarAlertas, tendenciaGeralPrev } = require("../controllers/alertaController");
var database = require("../database/config")


function buscarServidores(idServidor) {

    console.log("ACESSEI O MEDIDA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n")
    var instrucaoSql = `

    SELECT servidor.nomeServidor, servidor.idServidor, empresa.razao_social, situacao.tipo
FROM servidor
    JOIN empresa
        ON servidor.fkEmpresa = empresa.idEmpresa
    JOIN situacao
        ON servidor.fkSituacao = situacao.idSituacao
WHERE situacao.tipo = 'Ativado'  
ORDER BY idServidor;
 `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function listarComponentes(idComponente, componente_lt, tempo_lt) {

    console.log("Componente selecionado:", componente_lt);
    console.log("Período selecionado:", tempo_lt);

    console.log("ACESSEI O MEDIDA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n")
    var instrucaoSql = `

    
SELECT 
    a.descricao AS DescricaoAlerta
FROM alerta a
JOIN log l ON a.fkLog = l.idLog
JOIN componente c ON l.fkComponente = c.idComponente
WHERE c.nome = '${componente_lt}'
  AND a.data >= CURDATE() - INTERVAL ${tempo_lt} DAY;  

 `
 ;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



function listarAlertas(idAlertas) {

    console.log("ACESSEI O MEDIDA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n")
    var instrucaoSql = `

   SELECT 
    c.nome AS Componente,
    '30 dias' AS Periodo,  
    COUNT(a.idAlerta) AS Alertas
FROM alerta a
JOIN log l ON a.fkLog = l.idLog
JOIN componente c ON l.fkComponente = c.idComponente
WHERE a.data >= CURDATE() - INTERVAL 30 DAY
GROUP BY c.idComponente
ORDER BY Alertas DESC;

 `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function buscarAlertas(componente_DLT) {

    var instrucaoSql = `SELECT 
    MONTH(a.data) AS mes,
    COUNT(*) AS quantidade_alertas
FROM 
    alerta a
JOIN 
    log l ON a.fkLog = l.idLog 
WHERE 
    l.fkComponente = ${componente_DLT} 
GROUP BY 
    MONTH(a.data)
ORDER BY 
    MONTH(a.data);

`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



function buscarAlertasModal(componente_DLT) {

    var instrucaoSql = `SELECT 
    MONTH(a.data) AS mes,
    COUNT(*) AS quantidade_alertas
FROM 
    alerta a
JOIN 
    log l ON a.fkLog = l.idLog 
WHERE 
    l.fkComponente = ${componente_DLT} 
GROUP BY 
    MONTH(a.data)
ORDER BY 
    MONTH(a.data);

`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function tendenciaUsoPrev() {


 const instrucaoSql = `
        
SELECT 
    YEAR(a.data) AS ano,
    MONTH(a.data) AS mes,
    COUNT(*) AS quantidade_alertas
FROM 
    alerta a
JOIN 
    log l ON a.fkLog = l.idLog  
WHERE 
    l.fkComponente = 1
GROUP BY 
    YEAR(a.data), MONTH(a.data)
ORDER BY 
    ano, mes
LIMIT 0, 1000;

    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function tendenciaGeralComp(componente_prev) {


    const instrucaoSql = `
           
   SELECT 
       YEAR(a.data) AS ano,
       MONTH(a.data) AS mes,
       COUNT(*) AS quantidade_alertas
   FROM 
       alerta a
   JOIN 
       log l ON a.fkLog = l.idLog  
   WHERE 
       l.fkComponente = ${componente_prev}
   GROUP BY 
       YEAR(a.data), MONTH(a.data)
   ORDER BY 
       ano, mes
   LIMIT 0, 1000;
   
       `;
   
       console.log("Executando a instrução SQL: \n" + instrucaoSql);
       return database.executar(instrucaoSql);
   }



function ResumoVariacao(variante) {


    console.log("ACESSEI O MEDIDA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n")
    var instrucaoSql = `
    
    

SELECT 
    a.mes,
    a.quantidade_alertas,
    a.quantidade_alertas - IFNULL(b.quantidade_alertas, 0) AS variacao_alertas
FROM (
    SELECT 
        MONTH(a.data) AS mes,
        COUNT(*) AS quantidade_alertas
    FROM 
        alerta a
    JOIN 
        log l ON a.fkLog = l.idLog
    JOIN
        componente c ON l.fkComponente = c.idComponente
    WHERE 
        c.idComponente = ${variante}
    GROUP BY 
        MONTH(a.data)
) AS a
LEFT JOIN (
    SELECT 
        MONTH(a.data) AS mes,
        COUNT(*) AS quantidade_alertas
    FROM 
        alerta a
    JOIN 
        log l ON a.fkLog = l.idLog
    JOIN
        componente c ON l.fkComponente = c.idComponente
    WHERE 
        c.idComponente = ${variante}
    GROUP BY 
        MONTH(a.data)
) AS b ON a.mes = b.mes + 1
ORDER BY 
    a.mes;
 `;
    console.log("Seleção variação alertas dentro do modal")
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



function ProbabilidadeAlerta() {
    var instrucaoSql = `

    SELECT 
    ROUND(IFNULL((COUNT(a.idAlerta) / COUNT(l.idLog)) * 100, 0), 0) AS chance_alerta_percentual
FROM 
    log l
LEFT JOIN 
    alerta a ON l.idLog = a.fkLog
LEFT JOIN 
    componente c ON l.fkComponente = c.idComponente
WHERE 
    l.fkComponente = 2
GROUP BY 
    l.fkComponente
LIMIT 0, 1000;



`;

    console.log("PROBABILIDADE DE ALERTA \n" + instrucaoSql + "ESSA É A PROBABILIDADE");

    return database.executar(instrucaoSql);
}




function buscarOee(servidorSelect) {
    
    var instrucaoSql = `
   SELECT 
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
       AND servidor.fkSituacao = 2
       AND idServidor = ${servidorSelect}
ORDER BY 
    total_downtime DESC;`;

    return database.executar(instrucaoSql);
}


module.exports = {

    buscarServidores,
    listarAlertas,
    listarComponentes,
    buscarAlertas,
    buscarAlertasModal,
    tendenciaUsoPrev,
    tendenciaGeralComp,
    ResumoVariacao,
    ProbabilidadeAlerta


};