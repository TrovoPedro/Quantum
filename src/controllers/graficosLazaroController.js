var graficosModel = require("../models/graficosLazaroModels");

function buscarNumeroAtividade(req, res) {
    var idServidor = req.params.idServidor;

    // Removendo a validação do idServidor
    graficosModel.buscarNumeroAtividade(idServidor)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao buscar a média de uso de CPU! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarMediaCPU(req, res) {
    var idServidor = req.params.idServidor;

    // Removendo a validação do idServidor
    graficosModel.buscarMediaCPU(idServidor)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao buscar a média de uso de CPU! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarMediaRAM(req, res) {
    var idServidor = req.params.idServidor;

    // Removendo a validação do idServidor
    graficosModel.buscarMediaRAM(idServidor)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao buscar a média de uso de RAM! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarMediaDisco(req, res) {
    var idServidor = req.params.idServidor;

    // Removendo a validação do idServidor
    graficosModel.buscarMediaDisco(idServidor)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao buscar a média de uso de RAM! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}


function buscarUptimeSemanal(req, res) {

    var idServidor = req.params.idServidor;


    if (idServidor == undefined) {
        res.status(400).send("O ID do servidor está indefinido!");
        console.log(idServidor, "id do server")
    } else {
        
        graficosModel.buscarUptimeSemanal(idServidor)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao buscar o uptime semanal! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}



module.exports = {
    buscarUptimeSemanal,
    buscarMediaCPU,
    buscarMediaRAM,
    buscarMediaDisco,
    buscarNumeroAtividade
}