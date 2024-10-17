const usuarioModel = require('../models/usuarioModel');

function autenticar(req, res) {
    var email = req.body.email;
    var senha = req.body.senha;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); 

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);
                        res.status(200).json(resultadoAutenticar);
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {

    var empresa = req.body.empresa;
    var email = req.body.email;
    var senha = req.body.senha;
    var nome = req.body.nome;

    if (empresa == undefined) {
        res.status(400).send("Sua empresa está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    }else {


        usuarioModel.cadastrar(nome, email, senha, empresa)
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

function cadastrarFuncionario(req, res) {
    var nome = req.body.nome;
    var empresa = req.body.empresa;
    var email = req.body.email;
    var senha = req.body.senha;

    console.log("Dados recebidos:", req.body);

    if (email == undefined) {
        return res.status(400).json({ error: "Seu email está undefined!" });
    } else if (senha == undefined) {
        return res.status(400).json({ error: "Sua senha está indefinida!" });
    } else if (nome == undefined) {
        return res.status(400).json({ error: "Seu nome está undefined!" });
    }

    usuarioModel.cadastrarFuncionario(nome, email, senha, empresa)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
            res.status(500).json({ error: erro.sqlMessage });
        });
}


function listarEmpresa(req, res){
    
    usuarioModel.listarEmpresa()
        .then(resultadoAutenticar => {
            console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
            console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

            if (resultadoAutenticar.length > 0) {
                res.status(200).json(resultadoAutenticar);
            } else {
                res.status(200).json([]);
            }
        })
        .catch(erro => {
            console.log(erro);
            console.log("\nHouve um Erro: ", erro.sqlMessage);
            res.status(500).json({ error: "Houve um erro", details: erro.sqlMessage });
        });
}

function buscarPorId(req, res) {
    var idUsuario= req.params.idUsuario;
  
    usuarioModel.buscarPorId(idUsuario).then((resultado) => {
      res.status(200).json(resultado);
    });
  }




  function editarFuncionario(req, res) {

    var idUsuario = req.params.idUsuario;
    var nomeGerenteEditado = req.body.nome;
    var emailGerenteEditado = req.body.email;
  
    console.log("ID do Usuário:", idUsuario);
    console.log("Nome Editado:", nomeGerenteEditado);
    console.log("Email Editado:", emailGerenteEditado);
  
  
  
    usuarioModel.editarFuncionario(idUsuario, nomeGerenteEditado, emailGerenteEditado)
  
      .then(() => {
        res.status(200).json({ message: "Funcionário editado com sucesso" });
      })
  
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: "Erro ao editar o Funcionário" });
      });
  }
  

  
function excluirFuncionario(req, res) {

    var idUsuario = req.params.idUsuario;
  
    if (!idUsuario) {
  
      return res.status(400).send("ID do funcionário não fornecido.");
    }
  
    var situacaoEditada = 1;
  
    usuarioModel.excluirFuncionario(idUsuario, situacaoEditada)

      .then(resultado => {

        res.status(200).json(resultado);
      })
      .catch(erro => {
        console.log("Erro ao excluir funcionário: ", erro.sqlMessage);

        res.status(500).json(erro.sqlMessage);

      });
  }
  

module.exports = {
    autenticar,
    cadastrar,
    listarEmpresa,
    cadastrarFuncionario,
    buscarPorId,
    editarFuncionario,
    excluirFuncionario
}