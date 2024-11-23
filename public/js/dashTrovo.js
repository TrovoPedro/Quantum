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
        buscarConsumoDisco()
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
let graficoRam;
let graficoSwap;
let graficoDisco
let graficoIo

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

    let index = 0;

    if (graficoSwap) {
        graficoSwap.data.datasets[0].data = [];
        graficoSwap.data.labels = [];
        graficoSwap.update();
    }

    if (Array.isArray(resposta)) {
        const dados = resposta.map(item => item.consumoMemoriaSwap);

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

            // Adiciona os dados no gráfico
            graficoSwap.data.datasets[0].data.push(dados[index]);
            graficoSwap.data.labels.push(labels[index % labels.length]);

            graficoSwap.update();  // Atualiza o gráfico
            index++;
        };

        // Criação do gráfico
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
                            stepSize: 10, // Garantir que o intervalo seja de 10 em 10
                            max: 100,     // Forçar o valor máximo para 100
                            min: 0,       // Forçar o valor mínimo para 0
                            callback: function (value) {
                                return value + 'MB'; // Adiciona o símbolo de porcentagem
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
                        text: 'Consumo de memória SWAP', // Título do gráfico
                        color: '#FFFF',
                        font: {
                            size: 25,
                            weight: 'bold'
                        }
                    }
                }
            }
        });

        // Atualiza o gráfico a cada 1 segundo
        const intervalo = setInterval(atualizarGrafico, 1000);
    } else {
        console.error('A resposta da API não é um array.', resposta);
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

/** fetch e plotagem do gráfico de uso total de disco*/

function buscarConsumoDisco() {
    fetch(`/estatisticaTrovo/buscarUsoDisco`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    plotarGraficosDisco(resposta);
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarGraficosDisco(resposta) {
    const ctx4 = document.getElementById('graficoDisco').getContext('2d');

    let index = 0;

    if (graficoDisco) {
        graficoDisco.data.datasets[0].data = [];
        graficoDisco.data.labels = [];
        graficoDisco.update();
    }

    if (Array.isArray(resposta)) {
        const dados = resposta.map(item => item.dois_primeiros_digitos);

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
            graficoDisco.data.datasets[0].data.push(dados[index]);
            graficoDisco.data.labels.push(labels[index % labels.length]);

            graficoDisco.update();
            index++;
        };

        // Criação do gráfico
        graficoDisco = new Chart(ctx4, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Uso de Disco',
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
                        ticks: {
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
                        text: 'Consumo de Disco',
                        color: '#FFFF',
                        font: {
                            size: 25,
                            weight: 'bold'
                        }
                    }
                }
            }
        });

        // Atualiza o gráfico a cada 1 segundo
        const intervalo = setInterval(atualizarGrafico, 1000);
    } else {
        console.error('A resposta da API não é um array.', resposta);
    }

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
                        text: 'Consumo de Disco',
                        color: '#FFFF',
                        font: {
                            size: 25,
                            weight: 'bold'
                        }
                    }
                }
            }
        });

        // Atualiza o gráfico a cada 1 segundo
        const intervalo = setInterval(atualizarGrafico, 1000);
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
                        n_alertas.innerHTML = count;
                    } else {
                        n_alertas.innerHTML = count;
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

            if (data.length > 0 && data[0].chance_alerta_percentua) {
                h1.textContent = `${data[0].chance_alerta_percentua}%`
            } else {
                h1.textContent = "0%"
            }

        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados:', error);
        });
}









