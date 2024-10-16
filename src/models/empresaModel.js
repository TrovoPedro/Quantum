var database = require("../database/config");

function buscarPorId(idEmpresa) {
  var instrucaoSql = `SELECT empresa.idEmpresa, empresa.razao_social, empresa.cnpj, situacao.tipo, endereco.cep, endereco.rua, endereco.num, usuario.nome FROM empresa JOIN situacao
            ON empresa.fkSituacao = situacao.idSituacao
            JOIN endereco ON endereco.fkEmpresa = empresa.idEmpresa 
            JOIN usuario ON usuario.fkEmpresa = empresa.idEmpresa WHERE usuario.fkTipoUsuario = 2
    ORDER BY idEmpresa;`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT * FROM empresa WHERE cnpj = '${cnpj}'`;

  return database.executar(instrucaoSql);
}

function cadastrar(razaoSocial, cnpj) {
  var instrucaoSql = `INSERT INTO empresa (razao_social, cnpj, fkSituacao) VALUES ('${razaoSocial}', '${cnpj}','${2}')`;

  return database.executar(instrucaoSql);
}

function cadastrarEnd(cep, rua, complemento, numero, idEmpresa) {
  var instrucaoSql = `INSERT INTO endereco (cep, rua, complemento, num, fkEmpresa) VALUES ('${cep}', '${rua}', '${complemento}', '${numero}', '${idEmpresa}')`;

  return database.executar(instrucaoSql);
}

function excluirEmpresa(idEmpresa, situacaoEditada) {
  console.log("Executando exclusão da empresa: ", idEmpresa, situacaoEditada);

  var instrucaoSql = `
      UPDATE empresa 
      SET fkSituacao = ${situacaoEditada} 
      WHERE idEmpresa = ${idEmpresa};
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function editarEmpresa(idUsuario,idEmpresa, nomeGerenteEditado, emailGerenteEditado, senhaGerenteEditado) {
  var instrucaoSql = `
      UPDATE usuario 
      SET nome = '${nomeGerenteEditado}',
      email = '${emailGerenteEditado}',
      senha = '${senhaGerenteEditado}'
      WHERE fkEmpresa = ${idEmpresa}; `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


module.exports = { buscarPorCnpj, buscarPorId, cadastrar, cadastrarEnd, excluirEmpresa, editarEmpresa, };
