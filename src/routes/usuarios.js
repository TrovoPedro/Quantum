var express = require("express");
var router = express.Router();
var multer = require("multer");
var usuarioController = require("../controllers/usuarioController");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); 
    }
});

const upload = multer({ storage: storage }); 


router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});


router.post("/cadastrarFoto", upload.single("foto"), function (req, res) {
    usuarioController.cadastrarfoto(req, res);
});


router.get("/buscarPorId", function (req, res) {
    usuarioController.buscarPorId(req, res);
});

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.get("/listarEmpresa", function (req, res) {
    usuarioController.listarEmpresa(req, res);
});

router.post("/cadastrarFuncionario", function (req, res) {
    usuarioController.cadastrarFuncionario(req, res);
});

router.put("/editarFunc/:idUsuario", function (req, res) {
    usuarioController.editarFuncionario(req, res);
});

router.put("/excluir/:idUsuario", function (req, res) {
    usuarioController.excluirFuncionario(req, res);
});

router.get("/selecionar/:idUsuario", function (req, res) {
    usuarioController.selecionar(req, res);
});

module.exports = router;
