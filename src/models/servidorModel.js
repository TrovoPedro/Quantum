var database = require("../database/config")

function cadastrar(nomeServidor, situacao) {
    console.log("ACESSEI O USUARIO MODEL \n\n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nomeServidor, situacao);

    var instrucaoSql = `
        INSERT INTO servidor (nomeServidor, fkEmpresa, fkLocalizacao, fkTempoAtividade, fkSituacao) VALUES ('${nomeServidor}', '${1}', '${1}', '${1}', ${2});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

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

function editarServidor(idServidor, nomeEditado) {
    var instrucaoSql = `
        UPDATE servidor 
        SET nomeServidor = '${nomeEditado}'
        WHERE idServidor = ${idServidor};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



function excluirServidor(idServidor, situacaoEditada, descricaoAtualizada) {
    console.log("Executando exclusão lógica do servidor: ", idServidor, situacaoEditada, descricaoAtualizada);

    var instrucaoSql = `
     UPDATE servidor 
SET 
    fkSituacao = ${situacaoEditada}, 
    descricao = '${descricaoAtualizada}'
WHERE idServidor = ${idServidor};

    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



function buscarPicos() {

    var instrucaoSql = `

    SELECT 
    s.nomeServidor AS Servidor,
    c.nome AS Componente,
    MIN(l.usoComponente) AS MinimoDeUso,
    MAX(l.usoComponente) AS MaximoDeUso
FROM log l
JOIN componente c ON l.fkComponente = c.idComponente
JOIN servidor s ON l.fkServidor = s.idServidor
JOIN situacao st ON s.fkSituacao = st.idSituacao
WHERE DATE(l.dtHora) = CURDATE()
  AND st.tipo = 'Ativado'
GROUP BY s.nomeServidor, c.nome
ORDER BY s.nomeServidor, c.nome;


`;


    console.log('PICOS DE CADA SERVIDOR')

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



function listarSituacao() {

    var instrucaoSql = `

    SELECT 
    s.nomeServidor AS NomeServidor,
    e.razao_social AS Empresa,
    st.tipo AS Situacao
FROM servidor s
JOIN empresa e ON s.fkEmpresa = e.idEmpresa
JOIN situacao st ON s.fkSituacao = st.idSituacao
ORDER BY st.tipo = 'Desativado', s.nomeServidor;


`;


    console.log('SERVIDORES LISTADOS EM PRIORIDADE')

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



function listarServidorEstado() {

    var instrucaoSql = `

    SELECT 
    s.nomeServidor AS NomeServidor,
    CASE
        WHEN COUNT(c.idComponente) >= 2 THEN 'Crítico'
        ELSE st.tipo
    END AS Estado
FROM servidor s
JOIN situacao st ON s.fkSituacao = st.idSituacao
LEFT JOIN log l ON l.fkServidor = s.idServidor
LEFT JOIN componente c ON l.fkComponente = c.idComponente
LEFT JOIN limiteComponente lc ON c.idComponente = lc.fkComponente
WHERE l.dtHora >= CURDATE() - INTERVAL 1 DAY
  AND l.usoComponente > lc.valorLimite
GROUP BY s.nomeServidor, st.tipo
ORDER BY s.nomeServidor
LIMIT 0, 1000;


`;


    console.log('SERVIDORES LISTADOS EM ESTADO')

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    cadastrar,
    buscarServidores,
    editarServidor,
    excluirServidor,
    buscarPicos,
    listarSituacao,
    listarServidorEstado
};