var servidorModel = require("../models/servidorModel");

function cadastrar() {

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
    var novoNome = req.body.nome;
    var idServidor = req.params.idServidor;

    servidorModel.editarServidor(novoNome, idServidor)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao realizar o post: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function excluirServidor(req, res) {

    var idServidor = req.params.idServidor;

    servidorModel.excluirServidor(idServidor)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao deletar o Servidor: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
    buscarServidores,
    editarServidor,
    excluirServidor
}