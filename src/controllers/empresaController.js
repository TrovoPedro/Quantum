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
  var idUsuario = req.params.idUsuario;
  var idEmpresa = req.params.idEmpresa;
  var nomeGerenteEditado = req.body.nomeGerenteEditado;
  var emailGerenteEditado = req.body.emailGerenteEditado;
  var senhaGerenteEditado = req.body.senhaGerenteEditado;

  if (!nomeEditado) {
    return res.status(400).send("Nome do servidor não fornecido.");
  }

  servidorModel.editarServidor(idUsuario, idEmpresa, nomeGerenteEditado, emailGerenteEditado, senhaGerenteEditado)
    .then(function (resultado) {
      res.json(resultado);
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao realizar o post: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}


function salvarEdicao(req, res) {

  var idUsuario = req.params.idUsuario;
  var nomeGerenteEditado = req.body.nome;
  var emailGerenteEditado = req.body.email;

  console.log("ID do Usuário:", idUsuario);
  console.log("Nome Editado:", nomeGerenteEditado);
  console.log("Email Editado:", emailGerenteEditado);



  empresaModel.salvarEdicao(idUsuario, nomeGerenteEditado, emailGerenteEditado)

    .then(() => {
      res.status(200).json({ message: "Administrador editado com sucesso" });
    })

    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Erro ao editar o administrador" });
    });
}



function editarEndereco(req, res) {

  var idEndereco = req.params.idEndereco;
  var cepEditado = req.body.cep;
  var ruaEditada = req.body.rua;
  var numEditado = req.body.numero;

  console.log("ID do Endereco:", idEndereco);
  console.log("cep Editado:", cepEditado);
  console.log("rua Editado:", ruaEditada);
  console.log("numero Editado:", numEditado);



  empresaModel.editarEndereco(idEndereco, cepEditado, ruaEditada, numEditado)

    .then(() => {
      res.status(200).json({ message: "Endereço editado com sucesso" });
    })

    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Erro ao editar o Endereço" });
    });
}






module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrar,
  cadastrarEnd,
  excluirEmpresa,
  editarEmpresa,
  salvarEdicao,
  editarEndereco
};
