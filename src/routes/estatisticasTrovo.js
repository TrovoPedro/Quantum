var express = require("express");
var router = express.Router();

var estatisticaTrovoController = require("../controllers/estatisticaTrovoController");

// Rota alerta geral

router.get("/buscarQtdAlerta", function (req, res) {
  estatisticaTrovoController.buscarQtdAlerta(req, res);
})

router.get("/buscarRiscoAlerta", function (req, res) {
  estatisticaTrovoController.buscarRiscoAlerta(req, res);
})

// Rotas para dados de CPU

router.get("/buscarConsumoCpu", function (req, res) {
  estatisticaTrovoController.buscarConsumoCpu(req, res);
})

router.get("/buscarMudancaContexto", function (req, res) {
  estatisticaTrovoController.buscarMudancaContexto(req, res);
})

router.get("/buscarCargaSistema", function (req, res) {
  estatisticaTrovoController.buscarCargaSistema(req, res);
})

router.get("/buscarServicosAtivos", function (req, res) {
  estatisticaTrovoController.buscarServicosAtivos(req, res);
})

// Rotas para dados de Rede

router.get("/buscarPerdaPacote", function (req, res) {
  estatisticaTrovoController.buscarPerdaPacote(req, res);
})

router.get("/buscarTaxaTransferencia", function (req, res) {
  estatisticaTrovoController.buscarTaxaTransferencia(req, res);
})

router.get("/buscarErroTcp", function (req, res) {
  estatisticaTrovoController.buscarErroTcp(req, res);
})

// Rotas para dados de RAM

router.get("/buscarUsoMemoriaRam", function (req, res) {
  estatisticaTrovoController.buscarUsoMemoriaRam(req, res);
})

router.get("/buscarUsoMemoriaSwap", function (req, res) {
  estatisticaTrovoController.buscarUsoMemoriaSwap(req, res);
})

router.get("/buscarTotalMemoriaRam", function (req, res) {
  estatisticaTrovoController.buscarTotalMemoriaRam(req, res);
})

router.get("/buscarTotalMemoriaSwap", function (req, res) {
  estatisticaTrovoController.buscarTotalMemoriaSwap(req, res);
})

// Rotas para dados de disco

router.get("/buscarUsoDisco", function (req, res) {
  estatisticaTrovoController.buscarUsoDisco(req, res);
})

router.get("/buscarIODisco", function (req, res) {
  estatisticaTrovoController.buscarPerdaPacote(req, res);
})

router.get("/buscarTotalDisco", function (req, res) {
  estatisticaTrovoController.buscarTotalDisco(req, res);
})

router.get("/buscarEspacoLivre", function (req, res) {
  estatisticaTrovoController.buscarEspacoLivre(req, res);
})

module.exports = router;