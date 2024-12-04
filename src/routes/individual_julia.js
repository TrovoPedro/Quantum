var express = require("express");
var router = express.Router();
const controller_julia = require('../controllers/controller_julia');


router.get("/cadastrados",function(req,res){
    controller_julia.obtercadastrados(req,res)
})


router.get("/usoCpu",function(req,res){
    controller_julia.obterCPU(req,res)
})


router.get("/usoRam",function(req,res){
    controller_julia.obterRam(req,res)
})

router.get("/obterBytes",function(req,res){
    controller_julia.obterBytes(req,res)
})


router.get("/obterdados",function(req,res){
    controller_julia.obterdados(req,res)
})


module.exports = router;