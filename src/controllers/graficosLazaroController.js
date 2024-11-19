var graficosModel = require("../models/graficosLazaroModels");

function buscarNumeroServidoresTotal(req, res) {
    var idServidor = req.params.idServidor;

    graficosModel.buscarNumeroServidoresTotal(idServidor)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao buscar a média de uso de CPU! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarNumeroServidoresDesativado(req, res) {
    var idServidor = req.params.idServidor;

    graficosModel.buscarNumeroServidoresDesativado(idServidor)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao buscar a média de uso de CPU! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarNumeroServidoresAtivado(req, res) {
    var idServidor = req.params.idServidor;

    graficosModel.buscarNumeroServidoresAtivado(idServidor)
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

function buscarAlertasPorServidor(req, res) {
    var idServidor = req.params.idServidor;

    graficosModel.buscarAlertasPorServidor(idServidor)
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

function buscarComponentePorServidor(req, res) {

    var idServidor = req.params.idServidor;


    if (idServidor == undefined) {
        res.status(400).send("O ID do servidor está indefinido!");
        console.log(idServidor, "id do server")
    } else {
        
        graficosModel.buscarComponentePorServidor(idServidor)
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
    buscarNumeroServidoresTotal,
    buscarNumeroServidoresDesativado,
    buscarNumeroServidoresAtivado,
    buscarAlertasPorServidor,
    buscarComponentePorServidor
}