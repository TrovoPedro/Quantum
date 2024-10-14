var empresaModel = require("../models/empresaModel");

function buscarPorCnpj(req, res) {
  var cnpj = req.query.cnpj;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function listar(req, res) {
  empresaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarPorId(req, res) {
  var id = req.params.id;

  empresaModel.buscarPorId(id).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function cadastrar(req, res) {
  var cnpj = req.body.cnpjEmpresa;
  var razaoSocial = req.body.nomeEmpresa;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    if (resultado.length > 0) {
      res
        .status(409)
        .json({ mensagem: `a empresa com o cnpj ${cnpj} já existe` });
    } else {
      empresaModel.cadastrar(razaoSocial, cnpj).then((resultado) => {
        res.status(201).json(resultado);
      });
    }
  });
}

function cadastrarEnd(req, res) {
  var cep = req.body.cep;
  var rua = req.body.rua;
  var complemento = req.body.complemento;
  var numero = req.body.numero;
  var idEmpresa = req.body.idEmpresa;

  if (cep == undefined) {
    res.status(400).send("Seu cep está undefined!");
} else if (rua == undefined) {
    res.status(400).send("Seu rua está undefined!");
} else if (complemento == undefined) {
    res.status(400).send("Sua complemento está undefined!");
} else if (numero == undefined) {
    res.status(400).send("Seu numero está undefined!");
}else if (idEmpresa == undefined) {
  res.status(400).send("Seu idEmpresa está undefined!");
} else {

    // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
    empresaModel.cadastrarEnd(cep, rua, complemento, numero, idEmpresa)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao realizar o cadastro! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}
}
module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrar,
  listar,
  cadastrarEnd,
};
