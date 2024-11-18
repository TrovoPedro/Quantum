const metricas = require('../models/dashJulia');


function registrarTentativa(req, res) {
    const { email } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Captura o IP do cliente
    const status = req.body.status; // 'sucesso' ou 'falha'

    alertaModel
        .registrarTentativa(email, ip, status)
        .then(() => {
            res.status(200).send("Tentativa de login registrada com sucesso.");
        })
        .catch((erro) => {
            console.log("Erro ao registrar tentativa:", erro.sqlMessage);
            res.status(500).json({ erro: "Erro ao registrar tentativa.", detalhes: erro.sqlMessage });
        });
}

module.exports ={
    registrarTentativa
}