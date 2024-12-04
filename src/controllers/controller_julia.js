const metricas = require('../models/dashJulia');


function obtercadastrados(req,res){
    console.log(`Aparecendi dados para o grafico`)
    metricas.obterCadastros().then(function(resultado){
        if(resultado.length >0){
            res.status(200).json(resultado)
        }else{
            res.status(204).json(resultado)
        }
    }).catch(function(erro){
        console.log(erro);
        console.log("Houve um erro ao obter os dados do gráfico",erro.sqlMessage)
        res.status(500).json(erro.sqlMessage)
    })
}



function obterCPU(req,res){
    console.log(`Aparecendi dados para o grafico`)
    metricas.obterCpu().then(function(resultado){
        if(resultado.length >0){
            res.status(200).json(resultado)
        }else{
            res.status(204).json(resultado)
        }
    }).catch(function(erro){
        console.log(erro);
        console.log("Houve um erro ao obter os dados do gráfico",erro.sqlMessage)
        res.status(500).json(erro.sqlMessage)
    })
}


function obterRam(req,res){
    console.log(`Aparecendi dados para o grafico`)
    metricas.obterRam().then(function(resultado){
        if(resultado.length >0){
            res.status(200).json(resultado)
        }else{
            res.status(204).json(resultado)
        }
    }).catch(function(erro){
        console.log(erro);
        console.log("Houve um erro ao obter os dados do gráfico",erro.sqlMessage)
        res.status(500).json(erro.sqlMessage)
    })
}

function obterBytes(req,res){
    console.log(`Aparecendi dados para o grafico`)
    metricas.obterBytes().then(function(resultado){
        if(resultado.length >0){
            res.status(200).json(resultado)
        }else{
            res.status(204).json(resultado)
        }
    }).catch(function(erro){
        console.log(erro);
        console.log("Houve um erro ao obter os dados do gráfico",erro.sqlMessage)
        res.status(500).json(erro.sqlMessage)
    })
}



function obterdados(req,res){
    console.log(`Aparecendi dados para o grafico`)
    metricas.obterdados().then(function(resultado){
        if(resultado.length >0){
            res.status(200).json(resultado)
        }else{
            res.status(204).json(resultado)
        }
    }).catch(function(erro){
        console.log(erro);
        console.log("Houve um erro ao obter os dados do gráfico",erro.sqlMessage)
        res.status(500).json(erro.sqlMessage)
    })
}


module.exports ={
    obtercadastrados,
    obterCPU,
    obterRam,
    obterBytes,
    obterdados
}