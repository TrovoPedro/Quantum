var database = require("../database/config");


function obterCadastros(){
    var instucaoSql = ` SELECT * FROM cadastrados`

        console.log("Executando a instrução SQL: \n" + instucaoSql)
        return database.executar(instucaoSql)
}


function obterCpu(){
    var instucaoSql = ` SELECT * FROM usoCPU`

        console.log("Executando a instrução SQL: \n" + instucaoSql)
        return database.executar(instucaoSql)
}



function obterRam(){
    var instucaoSql = ` SELECT * FROM usoRam`

        console.log("Executando a instrução SQL: \n" + instucaoSql)
        return database.executar(instucaoSql)
}

function obterBytes(){
    var instucaoSql = ` SELECT * FROM usoBytes`

        console.log("Executando a instrução SQL: \n" + instucaoSql)
        return database.executar(instucaoSql)
}
module.exports ={
    obterCadastros,
    obterCpu,
    obterRam,
    obterBytes
}