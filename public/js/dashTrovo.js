nome_usuario.innerHTML = sessionStorage.NOME_USUARIO;

function validarEscolha() {
    var escolher = document.getElementById('escolher');
    var valorInput = Number(escolher.value);

    if (isNaN(valorInput) || valorInput < 1 || valorInput > 4) {
        console.log("Valor inválido");
        return;
    }

    document.getElementById('pai-conteudo').style.display = 'none';
    document.getElementById('pai-conteudo2').style.display = 'none';
    document.getElementById('pai-conteudo3').style.display = 'none';
    document.getElementById('pai-conteudo4').style.display = 'none';

    if (valorInput == 1) {
        document.getElementById('pai-conteudo').style.display = 'flex';
        plotarGraficos()
    } else if (valorInput == 2) {
        document.getElementById('pai-conteudo2').style.display = 'flex';
        buscarPerdaPacote()
    } else if (valorInput == 3) {
        document.getElementById('pai-conteudo3').style.display = 'flex';
        plotarGraficosRam()
    } else if (valorInput == 4) {
        document.getElementById('pai-conteudo4').style.display = 'flex';
        plotarGraficosDisco()
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



function buscarConsumoCpu() {

    fetch(`/estatisticaTrovo/buscarConsumoCpu`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                plotarGraficos(resposta);
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });



}

function plotarGraficos(resposta) {

    const ctx = document.getElementById('graficoUsoCpu').getContext('2d');

    if (window.meuGrafico) {
        window.meuGrafico.destroy();
    }

    const dados = resposta.map(item => item.usoComponente)
    console.log('Dados extraídos:', dados);

    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

    if (dados.length === 0) {
        console.error('Nenhum dado encontrado para o gráfico.');
        return
    }

    window.meuGrafico = new Chart(ctx, {
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
                    text: 'Consumo de CPU', // Título do gráfico
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

/** fetch e plotagem do gráfico de Carga do sistema*/

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



