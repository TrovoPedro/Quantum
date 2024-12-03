var estatisticaTrovoModel = require("../models/estatisticaTrovoModel");

// Função geral de quantidade de alertas

function buscarQtdAlerta(req, res) {
    var valorInput = req.query.parametro;
    estatisticaTrovoModel.buscarQtdAlerta(valorInput).then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

function buscarRiscoAlerta(req, res) {
    var valorInput = req.query.parametro;

    if (!valorInput || isNaN(valorInput)) {
        return res.status(400).json({ error: "O parâmetro 'parametro' é inválido." })
    }

    estatisticaTrovoModel.buscarRiscoAlerta(valorInput)
        .then(resultado => {
            res.json(resultado);  // Retorna os dados ao cliente
        })
        .catch(erro => {
            console.log(erro);  // Loga o erro no servidor
            console.log("Houve um erro ao buscar as estatísticas:", erro.sqlMessage);
            res.status(500).json({ error: erro.sqlMessage });  // Retorna o erro detalhado
        });
}

// funções para buscar os dados de CPU

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

function buscarMudancaContexto(req, res) {
    estatisticaTrovoModel.buscarMudancaContexto().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

function buscarCargaSistema(req, res) {
    estatisticaTrovoModel.buscarCargaSistema().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

function buscarServicosAtivos(req, res) {
    estatisticaTrovoModel.buscarServicosAtivos().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

// Funções para buscar dados de Rede

function buscarTaxaTransferencia(req, res) {
    estatisticaTrovoModel.buscarTaxaTransferencia().then(resultado => {
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


function buscarErroTcp(req, res) {
    estatisticaTrovoModel.buscarErroTcp().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

// Funções para buscar dados de RAM

function buscarUsoMemoriaRam(req, res) {
    estatisticaTrovoModel.buscarUsoMemoriaRam().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

function buscarUsoMemoriaSwap(req, res) {
    estatisticaTrovoModel.buscarUsoMemoriaSwap().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

function buscarTotalMemoriaRam(req, res) {
    estatisticaTrovoModel.buscarTotalMemoriaRam().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

function buscarTotalMemoriaSwap(req, res) {
    estatisticaTrovoModel.buscarTotalMemoriaSwap().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

// Funções para buscar dados de Disco

function buscarUsoDisco(req, res) {
    estatisticaTrovoModel.buscarUsoDisco().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

function buscarIoDisco(req, res) {
    estatisticaTrovoModel.buscarIoDisco().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

function buscarTotalDisco(req, res) {
    estatisticaTrovoModel.buscarTotalDisco().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

function buscarEspacoLivre(req, res) {
    estatisticaTrovoModel.buscarEspacoLivre().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

function buscarTaxaTransferencia(req, res) {
    estatisticaTrovoModel.buscarTaxaTransferencia().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

function buscarErroTcp(req, res) {
    estatisticaTrovoModel.buscarErroTcp().then(resultado => {
        res.json(resultado)
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as estatisticas", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}

function buscarGeralDisco(req, res) {
    estatisticaTrovoModel.buscarGeralDisco().then(resultado => {
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
    buscarQtdAlerta,
    buscarRiscoAlerta,
    buscarConsumoCpu,
    buscarMudancaContexto,
    buscarCargaSistema,
    buscarServicosAtivos,
    buscarTaxaTransferencia,
    buscarPerdaPacote,
    buscarErroTcp,
    buscarUsoMemoriaRam,
    buscarUsoMemoriaSwap,
    buscarTotalMemoriaRam,
    buscarTotalMemoriaSwap,
    buscarUsoDisco,
    buscarIoDisco,
    buscarTotalDisco,
    buscarEspacoLivre,
    buscarGeralDisco
}