var express = require("express");
var router = express.Router();

var estatisticaTrovoController = require("../controllers/estatisticaTrovoController");

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
  estatisticaTrovoController.buscarCargaSistema(req, res);
})

router.get("/buscarRiscoAlertaCpu", function (req, res) {
  estatisticaTrovoController.buscarRiscoAlertaCpu(req, res);
})

router.get("/buscarQtdAlertaCpu", function (req, res) {
  estatisticaTrovoController.buscarQtdAlertaCpu(req, res);
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


router.get("/buscarRiscoAlertaRede", function (req, res) {
  estatisticaTrovoController.buscarRiscoAlertaRede(req, res);
})

router.get("/buscarQtdAlertaRede", function (req, res) {
  estatisticaTrovoController.buscarQtdAlertaRede(req, res);
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

router.get("/buscarRiscoAlertaRam", function (req, res) {
  estatisticaTrovoController.buscarQtdAlertaRam(req, res);
})

router.get("/buscarQtdAlertaRam", function (req, res) {
  estatisticaTrovoController.buscarQtdAlertaRam(req, res);
})

// Rotas para dados de disco

router.get("/buscarUsoDisco", function (req, res) {
  estatisticaTrovoController.buscarPerdaPacote(req, res);
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

router.get("/buscarRiscoAlertaDisco", function (req, res) {
  estatisticaTrovoController.buscarQtdAlertaDisco(req, res);
})

router.get("/buscarQtdAlertaDisco", function (req, res) {
  estatisticaTrovoController.buscarQtdAlertaDisco(req, res);
})

module.exports = router;