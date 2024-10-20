var express = require("express");
var router = express.Router();

var servidorController = require("../controllers/servidorController");


router.post("/cadastrar", function (req, res) {
    servidorController.cadastrar(req, res);
})

router.get("/buscar", function (req, res) {
    servidorController.buscarServidores(req, res);
});

router.put("/editar/:idServidor", function (req, res) {
    servidorController.editarServidor(req, res);
});


router.put("/excluir/:idServidor", function (req, res) {
    servidorController.excluirServidor(req, res);
});

module.exports = router;