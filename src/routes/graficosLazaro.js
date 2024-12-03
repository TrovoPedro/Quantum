var express = require("express");
var router = express.Router();

var graficosLazaroController = require("../controllers/graficosLazaroController");

router.get("/numeroTotal:idServidor", function (req, res) {
    graficosLazaroController.buscarNumeroServidoresTotal(req, res);
});

router.get("/numeroDesativados:idServidor", function (req, res) {
    graficosLazaroController.buscarNumeroServidoresDesativado(req, res);
});

router.get("/numeroAtivados:idServidor", function (req, res) {
    graficosLazaroController.buscarNumeroServidoresAtivado(req, res);
});

router.get("/buscarDescricaoDesativados:idServidor", function (req, res) {
    graficosLazaroController.buscarDescricaoDesativados(req, res);
});

router.get("/alertasPorComponente:idServidor", function (req, res) {
    graficosLazaroController.buscarAlertasPorServidor(req, res);
});

router.get("/ComponentePorServidor:idServidor", function (req, res) {
    graficosLazaroController.buscarComponentePorServidor(req, res);
});

router.get("/uptime:idServidor", function (req, res) {
    graficosLazaroController.buscarUptimeSemanal(req, res);
});

router.get("/MediaCPU:idServidor", function (req, res) {
    graficosLazaroController.buscarMediaCPU(req, res);  
});

router.get("/MediaRAM:idServidor", function (req, res) {
    graficosLazaroController.buscarMediaRAM(req, res); 
});

router.get("/MediaDisco:idServidor", function (req, res) {
    graficosLazaroController.buscarMediaDisco(req, res);  
});

module.exports = router;
