var database = require("../database/config");

function buscarPorId(id) {
  var instrucaoSql = `SELECT * FROM empresa WHERE id = '${id}'`;

  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `SELECT id, razao_social, cnpj FROM empresa`;

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

module.exports = { buscarPorCnpj, buscarPorId, cadastrar, listar, cadastrarEnd };
