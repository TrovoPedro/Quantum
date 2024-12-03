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


router.put("/excluir/:idServidor/:descricaoAtualizada", function (req, res) {
    console.log("ID do servidor recebido na rota: ", req.params.idServidor); 
    servidorController.excluirServidor(req, res);
});



router.get("/buscaGrafico", function (req, res) {
    
    servidorController.buscarPicos(req, res);

}); 

router.get("/listarSituacao", function (req, res) {
    
    servidorController.listarSituacao(req, res);

});


router.get("/listarServidorEstado", function (req, res) {
    
    servidorController.listarServidorEstado(req, res);

});




module.exports = router;