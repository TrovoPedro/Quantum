var express = require("express");
var router = express.Router();

var previsaoController = require("../controllers/previsaoController");


router.get("/buscarPorId", function (req, res) {
    previsaoController.buscarPorId(req, res);
});



router.get("/tendenciaUsoRam", function (req, res) {
    previsaoController.buscarTendenciaUsoRam(req, res);
});



router.get("/buscarHeatmap", function (req, res) {
    previsaoController.buscarHeatmap(req, res);
});

module.exports = router;