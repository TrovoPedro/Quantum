var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");

router.post("/cadastrar", function (req, res) {
    empresaController.cadastrar(req, res);
})

router.post("/cadastrarEnd", function (req, res) {
  empresaController.cadastrarEnd(req, res);
})

router.get("/buscar", function (req, res) {
    empresaController.buscarPorCnpj(req, res);
});

router.get("/buscarPorId", function (req, res) {
  empresaController.buscarPorId(req, res);
});

router.put("/excluir/:idEmpresa", function (req, res) {
  empresaController.excluirEmpresa(req, res);
});


router.put('/editarADM/:idUsuario', function (req, res) {
  empresaController.salvarEdicao(req, res);
}); 





module.exports = router;