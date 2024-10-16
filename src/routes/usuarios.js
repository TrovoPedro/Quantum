var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");


router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.get("/buscarPorId", function (req, res) {
    usuarioController.buscarPorId(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.get("/listarEmpresa", function(req,res){
    usuarioController.listarEmpresa(req,res);
})

router.post("/cadastrarFuncionario", function (req, res) {
    usuarioController.cadastrarFuncionario(req, res);
})
module.exports = router;