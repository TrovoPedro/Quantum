var express = require("express");
var router = express.Router();

var previsaoController = require("../controllers/previsaoController");

router.get("/buscarPorId", function (req, res) {
    previsaoController.buscarPorId(req, res);
});

router.get("/buscarTendenciaUsoRam/:componenteId/:servidorId", function (req, res) {
    previsaoController.buscarTendenciaUsoRam(req, res);
});

router.get("/buscarHeatmap", function (req, res) {
    previsaoController.buscarHeatmap(req, res);
});

router.get("/buscarComponente", function (req, res) {
    previsaoController.buscarComponente(req, res);
});

router.get("/buscarmediaRam", function (req, res) {
    previsaoController.buscarmediaRam(req, res);
});

router.get("/buscarmediaCpu", function (req, res) {
    previsaoController.buscarmediaCpu(req,res);
});


router.get("/buscarpicoCpu", function (req, res) {
    previsaoController.buscarpicoCpu(req,res);
});

router.get("/buscarpicoRam", function (req, res) {
    previsaoController.buscarpicoRam(req,res);
});

module.exports = router;