var express = require("express");
var router = express.Router();

var graficosController = require("../controllers/graficosLazaroController");

router.get("/uptime:idServidor", function (req, res) {
    graficosController.buscarUptimeSemanal(req, res);
});

router.get("/MediaCPU:idServidor", function (req, res) {
    graficosController.buscarMediaCPU(req, res);  // Chama a função do controlador sem validação
});

router.get("/MediaRAM:idServidor", function (req, res) {
    graficosController.buscarMediaRAM(req, res);  // Chama a função do controlador sem validação
});

router.get("/MediaDisco:idServidor", function (req, res) {
    graficosController.buscarMediaDisco(req, res);  // Chama a função do controlador sem validação
});

router.get("/NumeroAtividade:idServidor", function (req, res) {
    graficosController.buscarNumeroAtividade(req, res);  // Chama a função do controlador sem validação
});

module.exports = router;
