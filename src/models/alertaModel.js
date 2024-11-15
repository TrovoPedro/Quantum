const { mostrarAlertas } = require("../controllers/alertaController");
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
WHERE c.nomeComponente = '${componente_lt}'
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
    c.nomeComponente AS Componente,
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

function buscarAlertas() {

    var instrucaoSql = `SELECT 
    MONTH(a.data) AS mes,
    COUNT(*) AS quantidade_alertas
FROM 
    alerta a
JOIN 
    log l ON a.fkLog = l.idLog 
WHERE 
    l.fkComponente = 1
GROUP BY 
    MONTH(a.data)
ORDER BY 
    MONTH(a.data);

`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}








module.exports = {

    buscarServidores,
    listarAlertas,
    listarComponentes,
    buscarAlertas

};