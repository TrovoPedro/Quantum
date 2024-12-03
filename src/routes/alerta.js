var express = require("express");
var router = express.Router();

var alertaController = require("../controllers/alertaController");



router.get("/buscar", function (req, res) {
    
    alertaController.buscarServidores(req, res);

});



router.get("/mostrar", function (req, res) {
    
    alertaController.listarAlertas(req, res);

});

router.get("/buscaGrafico/:selecao", function (req, res) {
    
    alertaController.buscarAlertas(req, res);

}); 

router.get("/buscaModal/:selecao", function (req, res) {
    
    alertaController.buscarAlertas(req, res);

}); 


router.get("/componentes/:componente/:tempo", function (req, res) {
    
    alertaController.listarComponentes(req, res);

});


router.get("/variacao/:Cp_modal", function (req, res) {
    
    alertaController.ResumoVariacao(req, res);

});


router.get("/buscarProbabilidade", function (req, res) {
    
    alertaController.ProbabilidadeAlerta(req, res);

});


router.get("/buscarProbabilidade", function (req, res) {
    alertaController.buscarProbabilidade(req, res);
});



router.get("/tendenciaUso", (req, res) => {
    alertaController.tendenciaUsoPrev(req, res);
});

router.get("/tendenciaGeral/:previsto", (req, res) => {
    alertaController.tendenciaGeralComp(req, res);
});



router.get("/buscarOee/:servidorId", function (req, res) {
    alertaController.buscarOee(req, res);
});



module.exports = router;