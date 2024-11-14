var estatisticaTrovoModel = require("../models/estatisticaTrovoModel");


function buscarConsumoCpu(req, res) {
    estatisticaTrovoModel.buscarConsumoCpu().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

function buscarPerdaPacote(req, res) {
    estatisticaTrovoModel.buscarPerdaPacote().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

module.exports = {
    buscarConsumoCpu,
    buscarPerdaPacote
}