var express = require("express");
var router = express.Router();

var alertaController = require("../controllers/alertaController");



router.get("/buscar", function (req, res) {
    
    alertaController.buscarServidores(req, res);

});


module.exports = router;