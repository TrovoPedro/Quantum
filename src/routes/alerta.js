var express = require("express");
var router = express.Router();

var alertaController = require("../controllers/alertaController");



router.get("/buscar", function (req, res) {
    
    alertaController.buscarServidores(req, res);

});


router.get("/mostrar", function (req, res) {
    
    alertaController.listarAlertas(req, res);

});


module.exports = router;