var servidorModel = require("../models/servidorModel");

function cadastrar(){
    
}

function buscarServidores(req, res) {
    var idUsuario = req.params.idUsuario;

    servidorModel.buscarServidores(idUsuario)
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

function editarServidor(){

}

function excluirServidor(){

}

module.exports = {
    buscarServidores,
    editarServidor,
    excluirServidor
}