var database = require("../database/config");


function obterCadastros() {
    var instucaoSql = ` SELECT * FROM cadastrados`

    console.log("Executando a instrução SQL: \n" + instucaoSql)
    return database.executar(instucaoSql)
}


function obterCpu() {
    var instucaoSql = ` SELECT * FROM usoCPU`

    console.log("Executando a instrução SQL: \n" + instucaoSql)
    return database.executar(instucaoSql)
}



function obterRam() {
    var instucaoSql = ` SELECT * FROM usoRam`

    console.log("Executando a instrução SQL: \n" + instucaoSql)
    return database.executar(instucaoSql)
}

function obterBytes() {
    var instucaoSql = ` SELECT * FROM usoBytes`

    console.log("Executando a instrução SQL: \n" + instucaoSql)
    return database.executar(instucaoSql)
}


function obterdados() {
    var instucaoSql = `SELECT
    DATE(timestamp) AS dia, AVG(cpu_USO) AS cpu_usado, AVG(memoria_usada) AS memoria_usada,
    AVG(bytes_enviados) AS bytes_enviados, AVG(bytes_recebidos) AS bytes_recebidos
    FROM metricasIndivudual
    WHERE timestamp >= CURDATE() - INTERVAL 30 DAY
    GROUP BY dia
    ORDER BY dia DESC;`

    console.log("Executando a instrução SQL: \n" + instucaoSql)
    return database.executar(instucaoSql)
}

module.exports = {
    obterCadastros,
    obterCpu,
    obterRam,
    obterBytes,
    obterdados
}