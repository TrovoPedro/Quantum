var previsaoModel = require("../models/previsaoModel");

function buscarPorId(req, res) {
  var idServidor = req.params.idServidor;

  previsaoModel.buscarPorId(idServidor).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarTendenciaUsoRam(req, res) {
    previsaoModel.buscarTendenciaUsoRamPorDiaSemana().then((resultado) => {
        res.status(200).json(resultado);
    }).catch((erro) => {
        console.log(erro);
        res.status(500).json({ erro: "Erro ao buscar tendência de uso de RAM." });
    });
}


module.exports = {
  buscarPorId,
  buscarTendenciaUsoRam
};
