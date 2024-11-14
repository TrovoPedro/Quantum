var express = require("express");
var router = express.Router();

var estatisticaTrovoController = require("../controllers/estatisticaTrovoController");

router.get("/buscarConsumoCpu", function (req, res) {
  estatisticaTrovoController.buscarConsumoCpu(req, res);
})

router.get("/buscarPerdaPacote", function (req, res) {
  estatisticaTrovoController.buscarPerdaPacote(req, res);
})

router.get("/historico", function (req, res) {
  estatisticaTrovoController.buscarUltimasEstatisticas(req, res);
});

module.exports = router;