var valorInput = 1
var consumoCpuAlerta = 90
var consumoRamAlerta = 90
var consumoSwapAlerta = 5
var perdaPacoteAlerta = 3

function chamarCadastrarAlerta() {
    document.getElementById('pai-conteudo').style.display = 'none';
    document.getElementById('pai-conteudo2').style.display = 'none';
    document.getElementById('pai-conteudo3').style.display = 'none';
    document.getElementById('pai-conteudo4').style.display = 'none';
    document.getElementById('escolherAlerta').style.display = 'none';
    document.getElementById('escolherBotaoAlerta').style.display = 'none';
    document.getElementById('alerta-pai').style.display = 'flex';
}

function cadastrarAlerta() {
    consumoCpuAlerta = Number(limiteCpu.value)
    consumoRamAlerta = Number(limiteRam.value)
    consumoSwapAlerta = Number(limiteSwap.value)
    perdaPacoteAlerta = Number(limitePerdaPacote.value)
    console.log(consumoCpuAlerta, consumoRamAlerta, consumoSwapAlerta, perdaPacoteAlerta);
    window.location.href = "dashboardComponenteGeral.html";
}

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
        buscarConsumoRam()
        buscarConsumoSwap()
        buscarTotalMemoriaRam()
        buscarTotalMemoriaSwap()
        buscarQtdAlerta()
        buscarRiscoAlerta()
    } else if (valorInput == 2) {
        document.getElementById('pai-conteudo').style.display = 'flex';
        buscarConsumoCpu()
        buscarMudancaContexto()
        buscarCarga()
        buscarQtdAlerta()
        buscarRiscoAlerta()
        buscarServicosAtivos()
    } else if (valorInput == 3) {
        document.getElementById('pai-conteudo4').style.display = 'flex';
        buscarConsumoIoDisco()
        buscarGeralDisco()
        buscarQtdAlerta()
        buscarRiscoAlerta()
    } else if (valorInput == 4) {
        document.getElementById('pai-conteudo2').style.display = 'flex';
        buscarPerdaPacote()
        buscarTaxaTransferencia()
        buscarErroTcp()
        buscarQtdAlerta()
        buscarRiscoAlerta()
    }
}

function voltarHome() {
    window.location.href = "dashboardComponenteGeral.html";
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
let graficoRam;
let graficoSwap;
let graficoDisco
let graficoIo
let graficoTaxaTransferencia
let graficoErroTcp
let graficoPerdaPacote

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

    // Extração e conversão dos dados
    const dados = resposta.map(item => parseFloat(item.usoComponente));
    console.log('Dados extraídos e convertidos:', dados);

    // Verifica se todos os valores são numéricos
    if (!dados.every(d => !isNaN(d))) {
        console.error("Os dados extraídos contêm valores não numéricos:", dados);
        return;
    }

    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

    let it = 0;  // Variável de controle para percorrer os dados

    for (var i = 0; i <= dados.length; i++) {

        if (consumoCpuAlerta < dados[i]) {

            Swal.fire({
                position: "top-center",
                icon: "warning",
                title: "Limite ultrapassado de cpu",
                showConfirmButton: false,
            });
        } else {
            // Se o gráfico já existir, apenas atualiza os dados
            if (graficoCpu) {
                graficoCpu.data.datasets[0].data = [];  // Limpa os dados anteriores
                graficoCpu.data.labels = [];            // Limpa as labels anteriores
                graficoCpu.update();  // Atualiza o gráfico sem recriar
            } else {
                // Se o gráfico não existir, cria o gráfico
                graficoCpu = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: 'Uso de CPU',
                            data: [],
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
                                    stepSize: 10,
                                    max: 100,
                                    min: 0,
                                    callback: function (value) {
                                        return value + '%';
                                    },
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
                                text: 'Uso de CPU',
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
        }
    }

    // Função para atualizar o gráfico com os dados
    const atualizarGrafico = () => {
        if (it >= dados.length) {
            clearInterval(intervalo);  // Quando terminar, limpa o intervalo
            return;
        }

        graficoCpu.data.datasets[0].data.push(dados[it]);
        graficoCpu.data.labels.push(labels[it % labels.length]);
        graficoCpu.update();  // Atualiza o gráfico com os novos dados
        it++;  // Incrementa o índice para o próximo dado
    };

    // Inicia a atualização a cada 1 segundo (1000 ms)
    const intervalo = setInterval(atualizarGrafico, 1000);
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

let it = 0;

function plotarMudancaContexto(resposta) {
    const ctx = document.getElementById('graficoContexto').getContext('2d');

    if (graficoContexto) {
        graficoContexto.destroy();
    }

    // Extração dos dados
    const dados = resposta.map(item => item.mudancaContexto);
    console.log('Dados extraídos:', dados);

    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

    if (dados.length === 0) {
        console.error('Nenhum dado encontrado para o gráfico.');
        return;
    }

    const atualizarGrafico = () => {
        if (it >= dados.length) {
            clearInterval(intervalo);
            return;
        }

        graficoContexto.data.datasets[0].data.push(dados[it]);
        graficoContexto.data.labels.push(labels[it % labels.length]);
        graficoContexto.update();
        it++;
    };

    graficoContexto = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Uso de CPU',
                data: [],  // Começa com dados vazios
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
                    titleColor: '#FFFF',
                    bodyColor: '#FFFF',
                },
                title: {
                    display: true,
                    text: 'Uso de Threads',
                    color: '#FFFF',
                    font: {
                        size: 25,
                        weight: 'bold'
                    }
                }
            }
        }
    });

    const intervalo = setInterval(atualizarGrafico, 1000);
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

let index = 0; // Índice para percorrer a lista de dados

function plotarCarga(resposta) {
    const ctx = document.getElementById('graficoCarga').getContext('2d');

    if (graficoCarga) {
        graficoCarga.destroy();
    }

    // Extração dos dados
    const dados = resposta.map(item => item.cargaSistema);
    console.log('Dados extraídos:', dados);

    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

    if (dados.length === 0) {
        console.error('Nenhum dado encontrado para o gráfico.');
        return;
    }

    // Função para atualizar o gráfico
    const atualizarGrafico = () => {
        // Percorre os dados e atualiza o gráfico a cada passo
        if (index >= dados.length) {
            clearInterval(intervalo); // Para o intervalo quando todos os dados forem percorridos
            return;
        }

        // Atualiza os dados do gráfico
        graficoCarga.data.datasets[0].data.push(dados[index]); // Adiciona o novo valor
        graficoCarga.data.labels.push(labels[index % labels.length]); // Rótulo (usando índice para evitar erro de tamanho)

        // Atualiza o gráfico
        graficoCarga.update();
        index++;
    };

    // Inicializa o gráfico com os dados
    graficoCarga = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],  // Começa sem rótulos
            datasets: [{
                label: 'Uso de CPU',
                data: [],  // Começa com dados vazios
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

    // Atualiza o gráfico a cada 1 segundo, por exemplo
    const intervalo = setInterval(atualizarGrafico, 1000);
}

/** fetch para busca de serviços ativos*/

function buscarServicosAtivos() {
    const n_servicos = document.getElementById('n_servicos');

    fetch(`/estatisticaTrovo/buscarServicosAtivos`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.text().then(function (resposta) {
                    console.log(`Dados recebidos: ${resposta}`);

                    const count = parseInt(resposta, 10);
                    console.log(`Valor inteiro: ${count}`);

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

/** fetch e plotagem do gráfico de uso de memoria RAM*/

function buscarConsumoRam() {
    fetch(`/estatisticaTrovo/buscarUsoMemoriaRam`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    plotarGraficosRam(resposta);
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarGraficosRam(resposta) {
    const ctx2 = document.getElementById('graficoUsoRam').getContext('2d');

    let index = 0;

    if (graficoRam) {
        graficoRam.destroy();  // Se já existir, destrói o gráfico anterior
    }

    // Extração dos dados
    const dados = resposta.map(item => item.usoComponente);
    console.log('Dados extraídos:', dados);

    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

    if (dados.length === 0) {
        console.error('Nenhum dado encontrado para o gráfico.');
        return;
    }

    // Função para atualizar o gráfico
    const atualizarGrafico = () => {
        if (index >= dados.length) {
            clearInterval(intervalo);
            return;
        }

        // Atualiza os dados do gráfico
        graficoRam.data.datasets[0].data.push(dados[index]);
        graficoRam.data.labels.push(labels[index % labels.length]);

        // Atualiza o gráfico
        graficoRam.update();
        index++;
    };

    for (var i = 0; i <= dados.length; i++) {

        if (consumoRamAlerta < dados[i]) {
            Swal.fire({
                position: "top-center",
                icon: "warning",
                title: "Limite ultrapassado de memória ram",
                showConfirmButton: false,
            });
        } else {

            // Inicializa o gráfico com os dados
            graficoRam = new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: [],  // Começa sem rótulos
                    datasets: [{
                        label: 'Uso de RAM',
                        data: [],  // Começa com dados vazios
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
                                stepSize: 10, // Garantir que o intervalo seja de 10 em 10
                                max: 100,     // Forçar o valor máximo para 100
                                min: 0,       // Forçar o valor mínimo para 0
                                callback: function (value) {
                                    return value + '%'; // Adiciona o símbolo de porcentagem
                                },
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
                            text: 'Consumo de memória RAM', // Título do gráfico
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

    }
    // Atualiza o gráfico a cada 1 segundo, por exemplo
    const intervalo = setInterval(atualizarGrafico, 1000);
}

/*fetch e plotagem do gráfico de uso de memoria SWAP*/

function buscarConsumoSwap() {
    fetch(`/estatisticaTrovo/buscarUsoMemoriaSwap`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    plotarGraficoSwap(resposta);
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarGraficoSwap(resposta) {
    const ctx3 = document.getElementById('graficoUsoSwap').getContext('2d');

// Variável global para armazenar o gráfico
let graficoSwap;

// Variável para o índice dos dados
let index = 0;

if (Array.isArray(resposta)) {
    const dados = resposta.map(item => item.consumoMemoriaSwap);

    console.log('Dados extraídos:', dados);

    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

    if (dados.length === 0) {
        console.error('Nenhum dado encontrado para o gráfico.');
        return;
    }

    // Destruir o gráfico existente, se houver
    if (graficoSwap) {
        graficoSwap.destroy();
    }

    // Criação do gráfico (apenas uma vez)
    graficoSwap = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Uso de Memória SWAP',
                data: [],
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
                        stepSize: 10,
                        max: 100,
                        min: 0,
                        callback: function (value) {
                            return value + 'MB';
                        },
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
                    text: 'Consumo de memória SWAP',
                    color: '#FFFF',
                    font: {
                        size: 25,
                        weight: 'bold'
                    }
                }
            }
        }
    });

    // Atualização contínua do gráfico
    const atualizarGrafico = () => {
        if (index >= dados.length) {
            clearInterval(intervalo);
            return;
        }

        // Adiciona os dados ao gráfico
        graficoSwap.data.datasets[0].data.push(dados[index]);
        graficoSwap.data.labels.push(labels[index % labels.length]);

        graficoSwap.update(); // Atualiza o gráfico
        index++;

        // Alerta caso ultrapasse o limite
        if (consumoSwapAlerta < dados[index]) {
            Swal.fire({
                position: "top-center",
                icon: "warning",
                title: "Limite ultrapassado de memória swap",
                showConfirmButton: false,
            });
        }
    };

    // Atualiza o gráfico a cada 5 segundos
    const intervalo = setInterval(atualizarGrafico, 5000);
}

}


/* fetch para buscar total de memoria RAM */

function buscarTotalMemoriaRam() {
    const totalRam = document.getElementById('totalRam');

    fetch(`/estatisticaTrovo/buscarTotalMemoriaRam`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.text().then(function (resposta) {
                    console.log(`Dados recebidos: ${resposta}`);

                    const count = parseInt(resposta, 10);
                    console.log(`Valor inteiro: ${count}`);

                    totalRam.innerHTML = `${count}GB`;
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados: ${error.message}`);
        });
}

/* fetch para buscar total de memoria SWAP */

function buscarTotalMemoriaSwap() {
    const totalSwap = document.getElementById('totalSwap');

    fetch(`/estatisticaTrovo/buscarTotalMemoriaSwap`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.text().then(function (resposta) {
                    console.log(`Dados recebidos: ${resposta}`);

                    const count = parseInt(resposta, 10);
                    console.log(`Valor inteiro: ${count}`);

                    totalSwap.innerHTML = `${count}GB`;
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados: ${error.message}`);
        });
}

/** fetch e plotagem do gráfico de disco geral*/

function buscarGeralDisco() {
    fetch(`/estatisticaTrovo/buscarGeralDisco`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    if (Array.isArray(resposta)) {
                        console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                        plotarGeralDisco(resposta);
                    } else {
                        console.error('Resposta da API não é um array');
                    }
                });
            } else {
                console.error(`Erro na resposta da API: ${response.status} ${response.statusText}`);
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarGeralDisco(resposta) {
    var percentUso = Number(resposta[0].usoComponente);

    const percentualUsado = Math.round(
        (percentUso / resposta[0].espacoTotalDisco) * 100
    );

    const percentualLivre = 100 - percentualUsado;

    const dadosMocados = [
        { faixa: "Usado", quantidade: percentualUsado },
        { faixa: "Livre", quantidade: percentualLivre },
    ];

    // Extraindo dados para o gráfico
    const series = dadosMocados.map((dado) => dado.quantidade);
    const labels = dadosMocados.map((dado) => dado.faixa);

    // Definindo cores personalizadas para cada faixa
    const coresPersonalizadas = ["#6D4BC7", "#a6a6a7"]; // Exemplo de cores para "Usado" e "Livre"

    // Configuração do gráfico
    var options = {
        series: series,
        chart: {
            width: 380,
            type: "donut",
        },
        labels: labels,
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 270,
            },
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            type: "gradient",
        },
        legend: {
            formatter: function (val, opts) {
                return val + " - " + opts.w.globals.series[opts.seriesIndex] + "%";
            },
            labels: {
                colors: "#d9d9d9", // Define a cor da legenda
                useSeriesColors: false, // Evita usar as cores da série como legenda
            },
        },
        title: {
            text: "Percentual de Armazenamento Usado vs Livre",
            style: {
                color: "#d9d9d9", // Define a cor do título
                fontSize: "16px", // (Opcional) Define o tamanho da fonte
                fontWeight: "bold", // (Opcional) Define o peso da fonte
            },
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + "%"; // Adiciona o símbolo de porcentagem ao tooltip
                },
            },
        },
        colors: coresPersonalizadas, // Definindo as cores
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 150,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    };

    // Renderizando o gráfico
    var chart = new ApexCharts(
        document.querySelector("#myDoughnutChart"),
        options
    );
    chart.render();
}


/** fetch e plotagem do gráfico de I/O de disco*/

function buscarConsumoIoDisco() {
    fetch(`/estatisticaTrovo/buscarIoDisco`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    plotarIoDisco(resposta);
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarIoDisco(resposta) {
    const ctx5 = document.getElementById('graficoIo').getContext('2d');

    let index = 0;

    if (graficoIo) {
        graficoIo.data.datasets[0].data = [];
        graficoIo.data.labels = [];
        graficoIo.update();
    }

    if (Array.isArray(resposta)) {
        const dados = resposta.map(item => item.ioDisco);

        console.log('Dados extraídos:', dados);

        const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

        if (dados.length === 0) {
            console.error('Nenhum dado encontrado para o gráfico.');
            return;
        }

        const atualizarGrafico = () => {
            if (index >= dados.length) {
                clearInterval(intervalo);
                return;
            }

            // Adiciona os dados no gráfico
            graficoIo.data.datasets[0].data.push(dados[index]);
            graficoIo.data.labels.push(labels[index % labels.length]);

            graficoIo.update();
            index++;
        };

        // Criação do gráfico
        graficoIo = new Chart(ctx5, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Escrita no Disco',
                    data: [],
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
                        min: 0,
                        max: 100,
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
                        text: 'Número de escritas no Disco',
                        color: '#FFFF',
                        font: {
                            size: 25,
                            weight: 'bold'
                        }
                    }
                }
            }
        });

        const intervalo = setInterval(atualizarGrafico, 3600000);

    } else {
        console.error('A resposta da API não é um array.', resposta);
    }

}

/** fetch e plotagem do gráfico de perda de pacotes*/

function buscarPerdaPacote() {
    fetch(`/estatisticaTrovo/buscarPerdaPacote`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    plotarPerdaDePacote(resposta);
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarPerdaDePacote(resposta) {
    const ctx5 = document.getElementById('graficoPerda').getContext('2d');

    let index = 0;

    if (graficoPerdaPacote) {
        graficoPerdaPacote.data.datasets[0].data = [];
        graficoPerdaPacote.data.labels = [];
        graficoPerdaPacote.update();
    }

    if (Array.isArray(resposta)) {
        const dados = resposta.map(item => item.usoComponente);

        console.log('Dados extraídos:', dados);

        const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

        if (dados.length === 0) {
            console.error('Nenhum dado encontrado para o gráfico.');
            return;
        }

        const atualizarGrafico = () => {
            if (index >= dados.length) {
                clearInterval(intervalo);
                return;
            }

            // Adiciona os dados no gráfico
            graficoPerdaPacote.data.datasets[0].data.push(dados[index]);
            graficoPerdaPacote.data.labels.push(labels[index % labels.length]);

            graficoPerdaPacote.update();
            index++;
        };

        for (var i = 0; i <= dados.length; i++) {

            if (consumoSwapAlerta < dados[i]) {
                Swal.fire({
                    position: "top-center",
                    icon: "warning",
                    title: "Limite ultrapassado de perda de pacote",
                    showConfirmButton: false,
                });
            } else {
                // Criação do gráfico
                graficoPerdaPacote = new Chart(ctx5, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: 'Perda de pacotes',
                            data: [],
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
                                    stepSize: 10,
                                    max: 100,
                                    min: 0,
                                    callback: function (value) {
                                        return value + '%';
                                    },
                                    color: '#FFFF'
                                },
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
                                text: 'Perda de pacotes',
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
        }
        const intervalo = setInterval(atualizarGrafico, 5000);
    } else {
        console.error('A resposta da API não é um array.', resposta);
    }

}

/** fetch e plotagem do gráfico de taxa de transferencia*/

function buscarTaxaTransferencia() {
    fetch(`/estatisticaTrovo/buscarTaxaTransferencia`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    plotarTaxaTransferencia(resposta);
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarTaxaTransferencia(resposta) {
    const ctx6 = document.getElementById('graficoTransferencia').getContext('2d');

    let index = 0;

    if (graficoTaxaTransferencia) {
        graficoTaxaTransferencia.data.datasets[0].data = [];
        graficoTaxaTransferencia.data.labels = [];
        graficoTaxaTransferencia.update();
    }

    if (Array.isArray(resposta)) {
        const dados = resposta.map(item => item.taxaTransfarencia);

        console.log('Dados extraídos:', dados);

        const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

        if (dados.length === 0) {
            console.error('Nenhum dado encontrado para o gráfico.');
            return;
        }

        const atualizarGrafico = () => {
            if (index >= dados.length) {
                clearInterval(intervalo);
                return;
            }

            // Adiciona os dados no gráfico
            graficoTaxaTransferencia.data.datasets[0].data.push(dados[index]);
            graficoTaxaTransferencia.data.labels.push(labels[index % labels.length]);

            graficoTaxaTransferencia.update();
            index++;
        };

        // Criação do gráfico
        graficoTaxaTransferencia = new Chart(ctx6, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Perda de pacotes',
                    data: [],
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
                            stepSize: 10,
                            max: 100,
                            min: 0,
                            callback: function (value) {
                                return value + 'GB';
                            },
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
                        bodyColor: '#FFFF',
                    },
                    title: {
                        display: true,
                        text: 'Taxa de transferência',
                        color: '#FFFF',
                        font: {
                            size: 25,
                            weight: 'bold'
                        }
                    }
                }
            }
        });

        const intervalo = setInterval(atualizarGrafico, 5000);

    } else {
        console.error('A resposta da API não é um array.', resposta);
    }

}

/** fetch e plotagem do gráfico de taxa de erroTCP*/

function buscarErroTcp() {
    fetch(`/estatisticaTrovo/buscarErroTcp`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    plotarErroTcp(resposta);
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarErroTcp(resposta) {
    const ctx7 = document.getElementById('graficoErro').getContext('2d');

    let index = 0;

    if (graficoErroTcp) {
        graficoErroTcp.data.datasets[0].data = [];
        graficoErroTcp.data.labels = [];
        graficoErroTcp.update();
    }

    if (Array.isArray(resposta)) {
        const dados = resposta.map(item => item.errosTcp);

        console.log('Dados extraídos:', dados);

        const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

        if (dados.length === 0) {
            console.error('Nenhum dado encontrado para o gráfico.');
            return;
        }

        const atualizarGrafico = () => {
            if (index >= dados.length) {
                clearInterval(intervalo);
                return;
            }

            // Adiciona os dados no gráfico
            graficoErroTcp.data.datasets[0].data.push(dados[index]);
            graficoErroTcp.data.labels.push(labels[index % labels.length]);

            graficoErroTcp.update();
            index++;
        };

        // Criação do gráfico
        graficoErroTcp = new Chart(ctx7, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Perda de pacotes',
                    data: [],
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
                        min: 0,
                        max: 100,
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
                        text: 'Erros TCP',
                        color: '#FFFF',
                        font: {
                            size: 25,
                            weight: 'bold'
                        }
                    }
                }
            }
        });

        const intervalo = setInterval(atualizarGrafico, 5000);

    } else {
        console.error('A resposta da API não é um array.', resposta);
    }

}

// Fetch do numero de alertas

function buscarQtdAlerta() {
    const n_alertas = document.getElementById('n_alertas');

    fetch(`/estatisticaTrovo/buscarQtdAlerta?parametro=${valorInput}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.text().then(function (resposta) {
                    console.log(`Dados recebidos: ${resposta}`);

                    const count = parseInt(resposta, 10);
                    console.log(`Valor de count como inteiro: ${count}`);

                    if (valorInput == 1) {
                        n_alertasRam.innerHTML = count;
                    } else if (valorInput == 2) {
                        n_alertas.innerHTML = count;
                    } else if (valorInput == 3) {
                        n_alertasDisco.innerHTML = count;
                    } else {
                        alertaRede.innerHTML = count;
                    }

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
    fetch(`/estatisticaTrovo/buscarRiscoAlerta?parametro=${valorInput}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Dados recebidos de PROBABILIDADE:", data);
            const h1 = document.getElementById('porcent_alerta');

            const mensagem = document.getElementById('mensagem_alerta'); // Novo elemento para exibir mensagens.

            if (data && data.length > 0 && data[0].calcular_probabilidade_alerta !== undefined) {
                const probabilidade = (data[0].calcular_probabilidade_alerta * 100).toFixed(2);

                if (valorInput == 1) {
                    porcent_alertaRam.innerHTML = `${probabilidade}%`;
                } else if (valorInput == 2) {
                    porcent_alerta.innerHTML = `${probabilidade}%`;
                } else if (valorInput == 3) {
                    porcent_alertaDisco.innerHTML = `${probabilidade}%`;
                } else if (valorInput == 4) {
                    porcent_alertaRede.innerHTML = `${probabilidade}%`;
                }
            } else {
                h1.textContent = "0%";
                mensagem.textContent = "Sem dados disponíveis para análise.";
            }
        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados:', error);
            const mensagem = document.getElementById('mensagem_alerta');
            mensagem.textContent = "Erro ao buscar os dados. Tente novamente mais tarde.";
        });
}






