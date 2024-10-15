var servidorModel = require("../models/servidorModel");

function cadastrar(req, res) {

    var nomeServidor = req.body.nomeServidor;
    var situacao = req.body.situacao;

    if (nomeServidor == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (situacao == undefined) {
        res.status(400).send("A situação do servidor está undefined!");
    }else {
        servidorModel.cadastrar(nomeServidor, situacao)
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

function buscarServidores(req, res) {
    var idServidor = req.params.idServidor;

    servidorModel.buscarServidores(idServidor)
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

function editarServidor(req, res) {
    var nomeEditado = req.body.nomeEditado; 
    var idServidor = req.params.idServidor; 

    if (!nomeEditado) {
        return res.status(400).send("Nome do servidor não fornecido.");
    }

    servidorModel.editarServidor(idServidor, nomeEditado) 
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao realizar o post: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}


function excluirServidor(req, res) {
    
    var idServidor = req.params.idServidor;

    if (!idServidor) {

        return res.status(400).send("ID do servidor não fornecido.");
    }

    var situacaoEditada = 1; 

    servidorModel.excluirServidor(idServidor, situacaoEditada)
        .then(resultado => {
            res.status(200).json(resultado);
        })
        .catch(erro => {
            console.log("Erro ao excluir servidor: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}


module.exports = {
    cadastrar,
    buscarServidores,
    editarServidor,
    excluirServidor
}