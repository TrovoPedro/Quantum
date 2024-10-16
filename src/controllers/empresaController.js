var empresaModel = require("../models/empresaModel");

function buscarPorCnpj(req, res) {
  var cnpj = req.query.cnpj;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarPorId(req, res) {
  var idEmpresa = req.params.idEmpresa;

  empresaModel.buscarPorId(idEmpresa).then((resultado) => {
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
  } else if (idEmpresa == undefined) {
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

function excluirEmpresa(req, res) {
  
  var idEmpresa = req.params.idEmpresa;

  if (!idEmpresa) {

      return res.status(400).send("ID da empresa não fornecido.");
  }

  var situacaoEditada = 1; 

  empresaModel.excluirEmpresa(idEmpresa, situacaoEditada)
      .then(resultado => {
          res.status(200).json(resultado);
      })
      .catch(erro => {
          console.log("Erro ao excluir empresa: ", erro.sqlMessage);
          res.status(500).json(erro.sqlMessage);
      });
}

function editarEmpresa(req, res) {
  var nomeEditado = req.body.nomeEditado;  
  var idUsuario= req.params.idUsuario;
  var idEmpresa = req.params.idEmpresa;
  var nomeGerenteEditado = req.body.nomeGerenteEditado;
  var emailGerenteEditado = req.body.emailGerenteEditado;
  var senhaGerenteEditado =req.body.senhaGerenteEditado;

  if (!nomeEditado) {
      return res.status(400).send("Nome do servidor não fornecido.");
  }

  servidorModel.editarServidor(idUsuario,idEmpresa, nomeGerenteEditado, emailGerenteEditado, senhaGerenteEditado) 
      .then(function (resultado) {
          res.json(resultado);
      })
      .catch(function (erro) {
          console.log(erro);
          console.log("Houve um erro ao realizar o post: ", erro.sqlMessage);
          res.status(500).json(erro.sqlMessage);
      });
}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrar,
  cadastrarEnd,
  excluirEmpresa,
  editarEmpresa,
};
