var alertaModel = require("../models/alertaModel");

function buscarServidores(req, res) {

    var idServidor = req.params.idServidor;

    alertaModel.buscarServidores(idServidor)

        .then(resultadoAutenticar => {
            console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
            console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

            if (resultadoAutenticar.length > 0) {
                res.status(200).json(resultadoAutenticar);
            } else {
                res.status(200).json([]);
            }

        })

        .catch(erro => {
            console.log(erro);
            console.log("\nHouve um Erro: ", erro.sqlMessage);
            res.status(500).json({ error: "Houve um erro", details: erro.sqlMessage });
        });
}



function listarAlertas(req, res) {

    var idAlerta = req.params.idAlerta;

    alertaModel.listarAlertas(idAlerta)

        .then(resultadoAutenticar => {
            console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
            console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

            if (resultadoAutenticar.length > 0) {
                res.status(200).json(resultadoAutenticar);
            } else {
                res.status(200).json([]);
            }

        })

        .catch(erro => {
            console.log(erro);
            console.log("\nHouve um Erro: ", erro.sqlMessage);
            res.status(500).json({ error: "Houve um erro", details: erro.sqlMessage });
        });
}


function listarComponentes(req, res) {

    var idComponente = req.params.idComponente;
    var componente_lt = req.params.componente;
    var tempo_lt = req.params.tempo;

    alertaModel.listarComponentes(idComponente, componente_lt, tempo_lt)

        .then(resultadoAutenticar => {
            console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
            console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

            if (resultadoAutenticar.length > 0) {
                res.status(200).json(resultadoAutenticar);
            } else {
                res.status(200).json([]);
            }

        })

        .catch(erro => {
            console.log(erro);
            console.log("\nHouve um Erro: ", erro.sqlMessage);
            res.status(500).json({ error: "Houve um erro", details: erro.sqlMessage });
        });
}

function buscarAlertas(req, res) {

    var componente_DLT = req.params.selecao;

    alertaModel.buscarAlertas(componente_DLT)

        .then(resultadoAutenticar => {
            console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
            console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

            if (resultadoAutenticar.length > 0) {
                res.status(200).json(resultadoAutenticar);
            } else {
                res.status(200).json([]);
            }

        })

        .catch(erro => {
            console.log(erro);
            console.log("\nHouve um Erro: ", erro.sqlMessage);
            res.status(500).json({ error: "Houve um erro", details: erro.sqlMessage });
        });

}


function buscarAlertasModal(req, res) {


    var componente_DLT = req.params.selecao;

    alertaModel.buscarAlertasModal(componente_DLT)

        .then(resultadoAutenticar => {
            console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
            console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

            if (resultadoAutenticar.length > 0) {
                res.status(200).json(resultadoAutenticar);
            } else {
                res.status(200).json([]);
            }

        })

        .catch(erro => {
            console.log(erro);
            console.log("\nHouve um Erro: ", erro.sqlMessage);
            res.status(500).json({ error: "Houve um erro", details: erro.sqlMessage });
        });

}


async function tendenciaUsoPrev(req, res) {

    try {
        const dados = await alertaModel.tendenciaUsoPrev();

        const resultado = dados.reduce((acc, { ano, mes, quantidade_alertas }) => {
            if (!acc[ano]) {
                acc[ano] = Array(12).fill(0);
            }
            acc[ano][mes - 1] = quantidade_alertas;
            return acc;
        }, {});

        const resultadoComPrevisao = Object.entries(resultado).map(([ano, dados]) => {
            const x = [];
            const y = [];

            dados.forEach((quantidade, index) => {
                if (quantidade > 0) {
                    x.push(index + 1);
                    y.push(quantidade);
                }
            });

            const n = x.length;
            if (n > 1) {
                const xSum = x.reduce((a, b) => a + b, 0);
                const ySum = y.reduce((a, b) => a + b, 0);
                const xySum = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
                const xSquaredSum = x.reduce((sum, xi) => sum + xi ** 2, 0);

                const m = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum ** 2);
                const b = (ySum - m * xSum) / n;

                const previsao = dados.map((quantidade, index) => {
                    if (quantidade === 0) {
                        return Math.max(0, Math.round(m * (index + 1) + b));
                    }
                    return quantidade;
                });

                return {
                    name: ano,
                    data: previsao.map((alertas, index) => ({
                        x: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][index],
                        y: alertas,
                    })),
                };
            }

            return {
                name: ano,
                data: dados.map((alertas, index) => ({
                    x: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][index],
                    y: alertas,
                })),
            };
        });

        res.status(200).json({ resultadoComPrevisao });
    } catch (erro) {
        console.error('Erro ao buscar tendência de alertas:', erro);
        res.status(500).json({ erro: 'Erro ao buscar dados para a tendência de alertas' });
    }
}

async function tendenciaGeralComp(req, res) {

    const componentePrev = req.params.previsto;

    try {
        const dados = await alertaModel.tendenciaGeralComp(componentePrev);

        const limiteErro = 10;

        let totalMeses = 0;
        let acertos = 0;

        const resultado = dados.reduce((acc, { ano, mes, quantidade_alertas }) => {
            if (!acc[ano]) {
                acc[ano] = Array(12).fill(0);
            }
            acc[ano][mes - 1] = quantidade_alertas;
            return acc;
        }, {});


        const resultadoComPrevisao = Object.entries(resultado).map(([ano, dados]) => {
            const x = [];
            const y = [];
            const previsao = [];

            dados.forEach((quantidade, index) => {
                if (quantidade > 0) {
                    x.push(index + 1);
                    y.push(quantidade);
                }
            });

            const n = x.length;
            if (n > 1) {
                const xSum = x.reduce((a, b) => a + b, 0);
                const ySum = y.reduce((a, b) => a + b, 0);
                const xySum = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
                const xSquaredSum = x.reduce((sum, xi) => sum + xi ** 2, 0);

                const m = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum ** 2);
                const b = (ySum - m * xSum) / n;

                dados.forEach((quantidade, index) => {
                    let previsaoValor = quantidade;
                    if (quantidade === 0) {
                        previsaoValor = Math.max(0, Math.round(m * (index + 1) + b));
                    }
                    previsao.push(previsaoValor);

                    const erro = Math.abs((quantidade - previsaoValor) / (quantidade || 1)) * 100;
                    if (erro <= limiteErro) {
                        acertos++;
                    }
                    totalMeses++;
                });

                return {
                    name: ano,
                    data: previsao.map((alertas, index) => ({
                        x: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][index],
                        y: alertas,
                    })),
                };
            }

            return {
                name: ano,
                data: dados.map((alertas, index) => ({
                    x: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][index],
                    y: alertas,
                })),
            };
        });


        const previsaoFinal = resultadoComPrevisao[resultadoComPrevisao.length - 1]?.data?.slice(-1)[0]?.y || 0;


        const ranges = [
            { min: 0, max: previsaoFinal * 0.25, prob: 100 },
            { min: previsaoFinal * 0.25, max: previsaoFinal * 0.5, prob: 95 },
            { min: previsaoFinal * 0.5, max: previsaoFinal * 0.75, prob: 90 },
            { min: previsaoFinal * 0.75, max: previsaoFinal, prob: 85 },
            { min: previsaoFinal, max: Infinity, prob: 80 },
        ];


        const faixa = ranges.find(range => previsaoFinal >= range.min && previsaoFinal < range.max);

        res.status(200).json({
            resultadoComPrevisao,
            previsaoFinal,
            faixa,
            ranges,
        });
    } catch (erro) {
        console.error('Erro ao buscar tendência geral de alertas:', erro);
        res.status(500).json({ erro: 'Erro ao buscar dados para a tendência geral de alertas' });
    }
}



function ResumoVariacao(req, res) {


    var variante = req.params.Cp_modal;

    alertaModel.ResumoVariacao(variante)

        .then(resultadoAutenticar => {
            console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
            console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

            if (resultadoAutenticar.length > 0) {
                res.status(200).json(resultadoAutenticar);
            } else {
                res.status(200).json([]);
            }

        })

        .catch(erro => {
            console.log(erro);
            console.log("\nHouve um Erro: ", erro.sqlMessage);
            res.status(500).json({ error: "Houve um erro", details: erro.sqlMessage });
        });
}


function ProbabilidadeAlerta(req, res) {


    alertaModel.ProbabilidadeAlerta()

        .then(resultadoAutenticar => {
            console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
            console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

            if (resultadoAutenticar.length > 0) {
                res.status(200).json(resultadoAutenticar);
            } else {
                res.status(200).json([]);
            }

        })

        .catch(erro => {
            console.log(erro);
            console.log("\nHouve um Erro: ", erro.sqlMessage);
            res.status(500).json({ error: "Houve um erro", details: erro.sqlMessage });
        });
}



function buscarOee(req, res) {
    
    var servidorSelect = req.params.idServidor;

    console.log("Servidor Selecionado:", servidorSelect);

    alertaModel.buscarOee(servidorSelect).then((resultado) => {
        res.status(200).json(resultado);
    }).catch((erro) => {
        console.log(erro);
        res.status(500).json({ erro: "Erro ao buscar tendência de uso." });
    });
}



module.exports = {

    buscarServidores,
    listarAlertas,
    listarComponentes,
    buscarAlertas,
    buscarAlertasModal,
    tendenciaUsoPrev,
    tendenciaGeralComp,
    ResumoVariacao,
    ProbabilidadeAlerta,
    buscarOee


}