var express = require("express");
var router = express.Router();


router.post("/registrarTentativa", function (req, res) {
    DashJulia.registrarTentativa(req, res);
});

router.get("selecionarIps", function(req,res){
    DashJulia.selecionarIp(req, res);
})

module.exports = router;