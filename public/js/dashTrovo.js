nome_usuario.innerHTML = sessionStorage.NOME_USUARIO;
var valorInput = 2

function validarEscolha() {
    var escolher = document.getElementById('escolher');
    valorInput = Number(escolher.value);

    if (isNaN(valorInput) || valorInput < 1 || valorInput > 4) {
        console.log("Valor inválido");
        return;
    }

    document.getElementById('pai-conteudo').style.display = 'none';
    document.getElementById('pai-conteudo2').style.display = 'none';
    document.getElementById('pai-conteudo3').style.display = 'none';
    document.getElementById('pai-conteudo4').style.display = 'none';

    if (valorInput == 1) {
        document.getElementById('pai-conteudo3').style.display = 'flex';
        plotarGraficosRam()
        buscarQtdAlerta()
        buscarRiscoAlerta()
    } else if (valorInput == 2) {
        document.getElementById('pai-conteudo').style.display = 'flex';
        plotarGraficosCpu()
    } else if (valorInput == 3) {
        document.getElementById('pai-conteudo4').style.display = 'flex';
        plotarGraficosDisco()
    } else if (valorInput == 4) {
        document.getElementById('pai-conteudo2').style.display = 'flex';
        buscarPerdaPacote()
    }
}

function voltarHome() {
    window.location.href = "dashboardComponenteGeral.html";
}

function enviarFormulario() {

}

function verPerfil() {
    window.location.href = "../Tela_Perfil.html";
}

function sair() {
    sessionStorage.clear();
    window.location = "../login.html";
}

let graficoCpu;
let graficoContexto;
let graficoCarga;

function buscarConsumoCpu() {
    fetch(`/estatisticaTrovo/buscarConsumoCpu`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    plotarGraficosCpu(resposta);
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarGraficosCpu(resposta) {
    const ctx = document.getElementById('graficoUsoCpu').getContext('2d');

    if (!resposta || !Array.isArray(resposta)) {
        console.error("Dados inválidos recebidos para o gráfico:", resposta);
        return;
    }

    if (resposta.length === 0) {
        console.warn('Nenhum dado encontrado para o gráfico.');
        return;
    }

    const dados = resposta.map(item => item.usoComponente);
    console.log('Dados extraídos:', dados);

    if (!dados.every(d => typeof d === 'number')) {
        console.error("Os dados extraídos contêm valores não numéricos:", dados);
        return;
    }

    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

    if (graficoCpu) {
        graficoCpu.destroy();
    }

    graficoCpu = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Uso de CPU',
                data: dados,
                backgroundColor: '#e234d4',
                borderColor: '#e234d4',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#FFFF'
                    },
                    grid: {
                        color: '#6c6877af'
                    },
                    border: {
                        color: '#6c6877af'
                    }
                },
                x: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        color: '#6c6877af'
                    },
                    border: {
                        color: '#6c6877af'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: '#FFFF'
                    }
                },
                tooltip: {
                    titleColor: '#FFFF',
                    bodyColor: '#FFFF'
                },
                title: {
                    display: true,
                    text: 'Consumo de CPU',
                    color: '#FFFF',
                    font: {
                        size: 25,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}


/** fetch e plotagem do gráfico de mudança de contexto*/

function buscarMudancaContexto() {
    fetch(`/estatisticaTrovo/buscarMudancaContexto`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    plotarMudancaContexto(resposta);
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarMudancaContexto(resposta) {
    const ctx = document.getElementById('graficoContexto').getContext('2d');

    if (graficoContexto) {
        graficoContexto.destroy();
    }

    const dados = resposta.map(item => item.usoComponente);
    console.log('Dados extraídos:', dados);

    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

    if (dados.length === 0) {
        console.error('Nenhum dado encontrado para o gráfico.');
        return;
    }

    graficoContexto = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,  // Rótulos para o eixo X
            datasets: [{
                label: 'Uso de CPU',  // Rótulo da linha
                data: dados,  // Dados de uso de CPU extraídos
                backgroundColor: '#e234d4',
                borderColor: '#e234d4',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#FFFF' // Cor dos rótulos do eixo Y
                    },
                    grid: {
                        color: '#6c6877af', // Cor das linhas de grade horizontais
                    },
                    border: {
                        color: '#6c6877af', // Cor da linha do eixo Y
                    }
                },
                x: {
                    ticks: {
                        display: false,  // Esconde os rótulos do eixo X
                    },
                    grid: {
                        color: '#6c6877af', // Cor das linhas de grade verticais
                    },
                    border: {
                        color: '#6c6877af' // Cor da linha do eixo X
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: '#FFFF' // Cor da legenda
                    }
                },
                tooltip: {
                    titleColor: '#FFFF', // Cor do título do tooltip
                    bodyColor: '#FFFF',  // Cor do corpo do tooltip
                },
                title: {
                    display: true,
                    text: 'Mudança de Contexto', // Título do gráfico
                    color: '#FFFF',
                    font: {
                        size: 25,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}


/** fetch e plotagem do gráfico de Carga do sistema*/

function buscarCarga() {
    fetch(`/estatisticaTrovo/buscarCargaSistema`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    plotarCarga(resposta);
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarCarga(resposta) {
    const ctx = document.getElementById('graficoCarga').getContext('2d');

    if (graficoCarga) {
        graficoCarga.destroy();
    }

    const dados = resposta.map(item => item.usoComponente);
    console.log('Dados extraídos:', dados);

    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

    if (dados.length === 0) {
        console.error('Nenhum dado encontrado para o gráfico.');
        return;
    }

    graficoCarga = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Uso de CPU',
                data: dados,  // Dados de uso de CPU extraídos
                backgroundColor: '#e234d4',
                borderColor: '#e234d4',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#FFFF' // Cor dos rótulos do eixo Y
                    },
                    grid: {
                        color: '#6c6877af', // Cor das linhas de grade horizontais
                    },
                    border: {
                        color: '#6c6877af', // Cor da linha do eixo Y
                    }
                },
                x: {
                    ticks: {
                        display: false,  // Esconde os rótulos do eixo X
                    },
                    grid: {
                        color: '#6c6877af', // Cor das linhas de grade verticais
                    },
                    border: {
                        color: '#6c6877af' // Cor da linha do eixo X
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: '#FFFF' // Cor da legenda
                    }
                },
                tooltip: {
                    titleColor: '#FFFF', // Cor do título do tooltip
                    bodyColor: '#FFFF',  // Cor do corpo do tooltip
                },
                title: {
                    display: true,
                    text: 'Carga de sistema', // Título do gráfico
                    color: '#FFFF',
                    font: {
                        size: 25,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}

/** fetch para busca de serviços ativos*/

function buscarServicosAtivos() {
    const n_servicos = document.getElementById('n_servicos');

    fetch(`/estatisticaTrovo/buscarQtdAlerta?parametro=${valorInput}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.text().then(function (resposta) {
                    console.log(`Dados recebidos: ${resposta}`);
                    
                    // Aqui a resposta é um número direto, sem JSON
                    const count = parseInt(resposta, 10);
                    console.log(`Valor de count como inteiro: ${count}`);

                    // Atualiza o conteúdo HTML com o número de alertas
                    n_servicos.innerHTML = count;
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados: ${error.message}`);
        });
}

/** fetch e plotagem do gráfico de taxa de transferencia*/

/** fetch e plotagem do gráfico de erros de TCP*/

/** fetch e plotagem do gráfico de perda de pacote*/

function buscarPerdaPacote() {

    fetch(`/estatisticaTrovo/buscarPerdaPacote`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                plotarGraficosPerdaPacote(resposta);
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarGraficosPerdaPacote(resposta) {
    const ctx = document.getElementById('graficoPerda').getContext('2d');

    // Destruir o gráfico anterior, se existir
    if (window.meuGrafico) {
        window.meuGrafico.destroy();
    }

    // Verificar se 'resposta' é um array válido
    if (!Array.isArray(resposta)) {
        console.error('Resposta não é um array válido', resposta);
        return; // Evita continuar se a resposta não for válida
    }

    // Verificar se a resposta contém dados
    const dados = resposta.map(item => item.usoComponente);
    console.log('Dados extraídos:', dados);

    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

    if (dados.length === 0) {
        console.error('Nenhum dado encontrado para o gráfico.');
        return; // Evita criar o gráfico se os dados estiverem vazios
    }

    // Criar o gráfico
    window.meuGrafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Perda de pacotes',
                data: dados,
                backgroundColor: '#e234d4',
                borderColor: '#e234d4',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#FFFF'
                    },
                    grid: {
                        color: '#6c6877af',
                    },
                    border: {
                        color: '#6c6877af',
                    }
                },
                x: {
                    ticks: {
                        display: false,
                    },
                    grid: {
                        color: '#6c6877af',
                    },
                    border: {
                        color: '#6c6877af'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: '#FFFF'
                    }
                },
                tooltip: {
                    titleColor: '#FFFF',
                    bodyColor: '#FFFF',
                },
                title: {
                    display: true,
                    text: 'Porcentagem de perda de pacotes',
                    color: '#FFFF',
                    font: {
                        size: 25,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}

/** fetch e plotagem do gráfico de uso de memoria RAM*/

function plotarGraficosRam() {
    const ctx2 = document.getElementById('graficoUsoSwap').getContext('2d');


}

/** fetch e plotagem do gráfico de uso de memoria SWAP*/

/** fetch e plotagem do gráfico de uso total de disco*/

function plotarGraficosDisco() {
    const ctx = document.getElementById('graficoDisco').getContext('2d');

}

/** fetch e plotagem do gráfico de I/O de disco*/

// Fetch do numero de alertas

function buscarQtdAlerta() {
    const n_alertas = document.getElementById('n_alertas');

    fetch(`/estatisticaTrovo/buscarQtdAlerta?parametro=${valorInput}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.text().then(function (resposta) {
                    console.log(`Dados recebidos: ${resposta}`);
                    
                    // Aqui a resposta é um número direto, sem JSON
                    const count = parseInt(resposta, 10);
                    console.log(`Valor de count como inteiro: ${count}`);

                    // Atualiza o conteúdo HTML com o número de alertas
                    n_alertas.innerHTML = count;
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados: ${error.message}`);
        });
}

// Fetch da probabilidade de alerta

function buscarRiscoAlerta() {
    const porcent_alerta = document.getElementById('porcent_alerta');

    fetch(`/estatisticaTrovo/buscarRiscoAlerta?parametro=${valorInput}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    if (!resposta || resposta.length === 0) {
                        console.warn("Nenhum dado encontrado na resposta.");
                        porcent_alerta.innerHTML = "0%";
                        return;
                    }

                    const chancePercentual = parseFloat(resposta[0].chance_alerta_percentual);

                    if (isNaN(chancePercentual)) {
                        console.error("Valor de chance_alerta_percentual inválido.");
                        porcent_alerta.innerHTML = "Erro nos dados.";
                        return;
                    }

                    porcent_alerta.innerHTML = `${chancePercentual.toFixed(0)}%`;
                });
            } else {
                console.error("Erro na API:", response.status);
                porcent_alerta.innerHTML = "";
            }
        })
        .catch(function (error) {
            console.error("Erro na comunicação com a API:", error.message);
            porcent_alerta.innerHTML = "Erro na conexão.";
        });
}




