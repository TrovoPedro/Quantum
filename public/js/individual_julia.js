// Variáveis para armazenar as instâncias dos gráficos
var graficoAumentoUsuarios = null;
var graficoPrevisaoCusto = null;
var graficoUsoCPU = null;
var graficoUsoRAM = null;
var graficoUsoArmazenamento = null;
var graficoUsoCPU = null;


b_usuario.innerHTML = sessionStorage.NOME_USUARIO;

// Função para destruir o gráfico antes de criar um novo
function destruirGraficoSeExistir(grafico) {
    if (grafico !== null) {
        grafico.destroy();
    }
}


function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

const hoje = new Date();
const dataFormatada = formatarData(hoje);

document.getElementById('data').textContent = `Dia ${dataFormatada}`;
// Função para criar o gráfico de aumento de usuários
document.addEventListener("DOMContentLoaded", function () {
    metricasCadastro(); // Chama a função para buscar dados e criar o gráfico
});

async function metricasCadastro() {
    try {
        const response = await fetch("/individual_julia/cadastrados");

        if (!response.ok) {
            throw new Error("Erro ao buscar os dados da API");
        }

        const data = await response.json();
        console.log("Dados recebidos da API:", data);

        if (data && Array.isArray(data)) {
            const labels = [];
            const valores = [];

            // Processando cada item
            data.forEach(item => {
                console.log("Processando item:", item);

                if (item.dia_da_semana && item.quantidade_usuarios !== undefined) {
                    labels.push(item.dia_da_semana);
                    valores.push(item.quantidade_usuarios);
                } else {
                    console.error("Item com dados inválidos:", item);
                }
            });

            // Verificar se labels e valores foram preenchidos corretamente
            console.log("Labels:", labels);
            console.log("Valores:", valores);

            // Se labels e valores não estiverem vazios, criar o gráfico
            if (labels.length > 0 && valores.length > 0) {
                if (typeof graficoAumentoUsuarios !== 'undefined') {
                    destruirGraficoSeExistir(graficoAumentoUsuarios)
                }
                console.log("aaaaa", { labels, valores })
                criarGraficoAumentoUsuarios({ labels, valores });
            } else {
                console.error("Dados não válidos para o gráfico: labels ou valores vazios.");
            }
        } else {
            console.error("Dados recebidos não são um array ou estão vazios:", data);
        }
    } catch (error) {
        console.error(`Erro na obtenção dos dados para o gráfico: ${error.message}`);
    }
}

function criarGraficoAumentoUsuarios(dados) {
    console.log("Dados para o gráfico:", dados); // Verificar se os dados estão corretos

    // Garantir que 'dados' e suas propriedades existem antes de tentar criar o gráfico
    if (!dados || !dados.labels || !dados.valores) {
        console.error("Dados inválidos para o gráfico:", dados);
        return;
    }

    const ctx = document.getElementById("grafico_aumento_usuarios").getContext("2d");

    graficoAumentoUsuarios = new Chart(ctx, {
        type: "line",
        data: {
            labels: dados.labels,
            datasets: [
                {
                    label: "Aumento de Usuários",
                    data: dados.valores,
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Aumento de Usuários Semanalmente",
                    font: { size: 24, weight: 'bold', family: 'Arial' }, // Tamanho da fonte do título
                    color: 'rgba(255, 255, 255, 1)',
                    padding: { top: 10, bottom: 20 }
                },
                legend: {
                    labels: {
                        font: { size: 16 }, // Tamanho da fonte da legenda
                        color: 'rgba(255, 255, 255, 1)'
                    }
                }

            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 1)' // Cor das linhas do eixo Y
                    },
                    ticks: {
                        font: { size: 14 }, // Tamanho da fonte dos rótulos no eixo X
                        color: 'rgba(255, 255, 255, 1)' // Cor do texto/rótulos no eixo X
                    },
                },
                x: {
                    title: {
                        display: true,
                       
                        font: { size: 15, weight: 'bold', family: 'Arial' }, // Tamanho da fonte do título
                        color: 'rgba(255, 255, 255, 1)',
                        padding: { top: 10, bottom: 20 }
                    },
                    ticks: {
                        font: { size: 14 }, // Tamanho da fonte dos rótulos no eixo X
                        color: 'rgba(255, 255, 255, 1)' // Cor do texto/rótulos no eixo X
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 1)' // Cor das linhas de grade do eixo X
                    }
                },

            }
        },
    });
}




// Chamar a função metricasCadastro para buscar os dados e atualizar o gráfico
metricasCadastro();






async function usoCpu() {
    try {
        const response = await fetch('/individual_julia/usoCpu');
        const dados = await response.json();
        console.log("Dados recebidos para o gráfico de CPU:", dados);

        if (dados.length > 0) {
            const labels = dados.map(dado => dado.dia_da_semana);
            const picoMaximos = dados.map(dado => dado.pico_maximo);
            const picoMinimos = dados.map(dado => dado.pico_minimo);

            // Destruir o gráfico de CPU existente antes de criar um novo
            destruirGraficoSeExistir(graficoUsoCPU);

            criarGraficoUsoCPU(labels, picoMaximos, picoMinimos);
        } else {
            console.error("Nenhum dado disponível para o gráfico de CPU.");
        }
    } catch (error) {
        console.error("Erro ao buscar os dados do gráfico de CPU:", error);
    }
}

usoCpu()

// // Função para criar o gráfico de uso de CPU com Pico Máximo e Mínimo
function criarGraficoUsoCPU(labels, picoMaximos, picoMinimos) {

    var ctx = document.getElementById('grafico-uso-cpu').getContext('2d');
    graficoUsoCPU = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Pico Máximo CPU (%)',
                    data: picoMaximos,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Pico Mínimo CPU (%)',
                    data: picoMinimos,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Uso de RAM na EC2',
                    font: { size: 24, weight: 'bold', family: 'Arial' }, // Tamanho da fonte do título
                    color: 'rgba(255, 255, 255, 1)',
                    padding: { top: 10, bottom: 20 }
                },
                legend: {
                    labels: {
                        font: { size: 16 }, // Tamanho da fonte da legenda
                        color: 'rgba(255, 255, 255, 1)',
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 1)' // Cor das linhas do eixo Y
                    },
                    ticks: {
                        font: { size: 14 }, // Tamanho da fonte dos rótulos no eixo X
                        color: 'rgba(255, 255, 255, 1)' // Cor do texto/rótulos no eixo X
                    }
                },

                x: {
                    title: {
                        display: true,
                       
                        font: { size: 15, weight: 'bold', family: 'Arial' }, // Tamanho da fonte do título
                        color: 'rgba(255, 255, 255, 1)',
                        padding: { top: 10, bottom: 20 }
                    },
                    ticks: {
                        font: { size: 14 }, // Tamanho da fonte dos rótulos no eixo X
                        color: 'rgba(255, 255, 255, 1)' // Cor do texto/rótulos no eixo X
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 1)' // Cor das linhas de grade do eixo X
                    }
                },


            }
        }
    });
}
criarGraficoUsoCPU()


async function usoRam() {
    try {
        const response = await fetch('/individual_julia/usoRam');
        const dados = await response.json();
        console.log("Dados recebidos para o gráfico de RAM:", dados);

        if (dados.length > 0) {
            const labels = dados.map(dado => dado.dia_da_semana);
            const picoMaximos = dados.map(dado => dado.memoria_max_mb);
            const picoMinimos = dados.map(dado => dado.memoria_min_mb);

            // Destruir o gráfico de RAM existente antes de criar um novo
            destruirGraficoSeExistir(graficoUsoRAM);

            criarGraficoUsoRAM(labels, picoMaximos, picoMinimos);
        } else {
            console.error("Nenhum dado disponível para o gráfico de RAM.");
        }
    } catch (error) {
        console.error("Erro ao buscar os dados do gráfico de RAM:", error);
    }
}

usoRam()


// // Função para criar o gráfico de uso de CPU com Pico Máximo e Mínimo
// Função para criar o gráfico de uso de RAM com Pico Máximo e Mínimo
function criarGraficoUsoRAM(labels, picoMaximos, picoMinimos) {

    var ctx = document.getElementById('grafico-uso-ram').getContext('2d');
    graficoUsoRAM = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Pico Máximo RAM',

                    data: picoMaximos,
                    backgroundColor: 'rgba(255, 105, 180, 0.9)',
                    borderColor: 'rgba(255, 105, 180, 0.9)',
                    borderWidth: 1
                },
                {
                    label: 'Pico Mínimo RAM',
                    data: picoMinimos,
                    backgroundColor: 'rgba(147, 112, 219, 0.9)',
                    borderColor: 'rgba(147, 112, 219, 0.9)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Uso de RAM na EC2',
                    font: { size: 24, weight: 'bold', family: 'Arial' }, // Tamanho da fonte do título
                    color: 'rgba(255, 255, 255, 1)',
                    padding: { top: 10, bottom: 20 }
                },
                legend: {
                    labels: {
                        font: { size: 16 }, // Tamanho da fonte da legenda
                        color: 'rgba(255, 255, 255, 1)',
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 1)' // Cor das linhas do eixo Y
                    },
                    ticks: {
                        font: { size: 14 }, // Tamanho da fonte dos rótulos no eixo X
                        color: 'rgba(255, 255, 255, 1)' // Cor do texto/rótulos no eixo X
                    }
                },

                x: {
                    title: {
                        display: true,
                       
                        font: { size: 15, weight: 'bold', family: 'Arial' }, // Tamanho da fonte do título
                        color: 'rgba(255, 255, 255, 1)',
                        padding: { top: 10, bottom: 20 }
                    },
                    ticks: {
                        font: { size: 14 }, // Tamanho da fonte dos rótulos no eixo X
                        color: 'rgba(255, 255, 255, 1)' // Cor do texto/rótulos no eixo X
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 1)' // Cor das linhas de grade do eixo X
                    }
                },


            }
        }
    });
}

criarGraficoUsoRAM()




async function usoRede() {
    try {
        const response = await fetch('/individual_julia/obterBytes');
        const dados = await response.json();
        console.log("Dados recebidos para o gráfico de Bytes:", dados);

        if (dados.length > 0) {
            const labels = dados.map(dado => dado.dia_da_semana);
            const picoMaximos = dados.map(dado => dado.pico_max_recebidos_mb);
            const picoMinimos = dados.map(dado => dado.pico_min_recebidos_mb);

            // Destruir o gráfico de RAM existente antes de criar um novo
            destruirGraficoSeExistir(graficoUsoRede);

            criarGraficoUsoRede(labels, picoMaximos, picoMinimos);
        } else {
            console.error("Nenhum dado disponível para o gráfico de RAM.");
        }
    } catch (error) {
        console.error("Erro ao buscar os dados do gráfico de RAM:", error);
    }
}

usoRede()



// // Função para criar o gráfico de uso de CPU com Pico Máximo e Mínimo
// Função para criar o gráfico de uso de RAM com Pico Máximo e Mínimo
function criarGraficoUsoRede(labels, picoMaximos, picoMinimos) {

    var ctx = document.getElementById('grafico-uso-rede').getContext('2d');
    graficoUsoRede = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Bytes Enviados',

                    data: picoMaximos,
                    backgroundColor: 'rgba(255, 140, 0, 0.9)',
                    borderColor: 'rgba(255, 140, 0, 0.9)',
                    borderWidth: 1
                },
                {
                    label: 'Bytes Recebidos',
                    data: picoMinimos,
                    backgroundColor: 'rgba(144, 238, 144, 0.8)',
                    borderColor: 'rgba(144, 238, 144, 0.8)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Uso de RAM na EC2',
                    font: { size: 24, weight: 'bold', family: 'Arial' }, // Tamanho da fonte do título
                    color: 'rgba(255, 255, 255, 1)',
                    padding: { top: 10, bottom: 20 }
                },
                legend: {
                    labels: {
                        font: { size: 16 }, // Tamanho da fonte da legenda
                        color: 'rgba(255, 255, 255, 1)',
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 1)' // Cor das linhas do eixo Y
                    },
                    ticks: {
                        font: { size: 14 }, // Tamanho da fonte dos rótulos no eixo X
                        color: 'rgba(255, 255, 255, 1)' // Cor do texto/rótulos no eixo X
                    }
                },

                x: {
                    title: {
                        display: true,
                       
                        font: { size: 15, weight: 'bold', family: 'Arial' }, // Tamanho da fonte do título
                        color: 'rgba(255, 255, 255, 1)',
                        padding: { top: 10, bottom: 20 }
                    },
                    ticks: {
                        font: { size: 14 }, // Tamanho da fonte dos rótulos no eixo X
                        color: 'rgba(255, 255, 255, 1)' // Cor do texto/rótulos no eixo X
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 1)' // Cor das linhas de grade do eixo X
                    }
                },


            }

        }
    });
}

criarGraficoUsoRede()





// Função para buscar os dados para o gráfico de Previsão de Custo
async function dados() {
    try {
        const response = await fetch('/individual_julia/obterdados');
        const dados = await response.json();
        console.log("Dados recebidos para o gráfico de Previsão:", dados);

        // Verifique o conteúdo dos dados antes de qualquer outra coisa
        console.log("Estrutura dos dados:", dados);

        if (dados.length > 0) {
            // Convertendo a data para um formato amigável (DD/MM/YYYY)
            const labels = dados.map(dado => {
                const date = new Date(dado.dia); // Supondo que 'dado.dia' seja o campo da data
                return date.toLocaleDateString(); // Formato 'DD/MM/YYYY'
            });

            // Convertendo para números os dados recebidos
            const cpuUsada = dados.map(dado => parseFloat(dado.cpu_usado));
            const memoriaUsada = dados.map(dado => parseFloat(dado.memoria_usada));
            const bytesEnviados = dados.map(dado => parseFloat(dado.bytes_enviados));
            const bytesRecebidos = dados.map(dado => parseFloat(dado.bytes_recebidos));

            // Verifique se os arrays têm dados
            console.log("Arrays de dados", { cpuUsada, memoriaUsada, bytesEnviados, bytesRecebidos });

            // Verificação para garantir que todos os arrays têm dados
            if (!cpuUsada.length || !memoriaUsada.length || !bytesEnviados.length || !bytesRecebidos.length) {
                console.error("Arrays de dados estão vazios.");
                return;
            }

            destruirGraficoSeExistir(graficoPrevisaoCusto);

            // Calcular os custos totais com base nos dados recebidos
            const custosTotais = calcularCustos(cpuUsada, memoriaUsada, bytesEnviados, bytesRecebidos);

            // Criar o gráfico com os dados calculados
            criarGraficoPrevisaoCusto(labels, custosTotais);
        } else {
            console.error("Nenhum dado disponível para o gráfico de Previsão.");
        }
    } catch (error) {
        console.error("Erro ao buscar os dados do gráfico de Previsão:", error);
    }
}

dados();

// Função para calcular o custo total com base nos dados
function calcularCustos(cpuUsada, memoriaUsada, bytesEnviados, bytesRecebidos) {
    const horasUso = Array.from({ length: 31 }, (_, i) => i * 24); // Horas de uso de 0 a 720 (30 dias)
    const custoInstanciaPorHora = 0.0128; // Custo por hora de uma t2.micro
    const custoMemoriaPorGB = 0.08; // Custo por GB de memória (ajustar conforme sua necessidade)
    const custoTráfegoPorMB = 0.09; // Custo por MB de tráfego de rede

    // Verificando se todos os arrays têm dados e a mesma quantidade de elementos
    if (cpuUsada.length !== memoriaUsada.length ||
        cpuUsada.length !== bytesEnviados.length ||
        cpuUsada.length !== bytesRecebidos.length) {
        console.error("Arrays de dados não têm o mesmo tamanho ou estão vazios.");
        return [];
    }

    return horasUso.map((horas, i) => {
        // Verificando se os dados existem no índice i
        if (cpuUsada[i] === undefined || memoriaUsada[i] === undefined ||
            bytesEnviados[i] === undefined || bytesRecebidos[i] === undefined) {
            console.error(`Dados ausentes no índice ${i}`);
            return 0; // Retorna 0 para esse índice em caso de erro
        }

        const custoInstancia = custoInstanciaPorHora * horas; // Custo da instância
        const custoArmazenamento = memoriaUsada[i] * custoMemoriaPorGB; // Custo de memória
        const custoTrafego = (bytesEnviados[i] + bytesRecebidos[i]) * custoTráfegoPorMB; // Custo de tráfego

        // Retorna o custo total para essa hora
        return custoInstancia + custoArmazenamento + custoTrafego;
    });
}

// Função para criar o gráfico de previsão de custo
function criarGraficoPrevisaoCusto(labels, custosTotais) {
    var ctx = document.getElementById('grafico-previsao-custo').getContext('2d');
    graficoPrevisaoCusto = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Horas ou dias no eixo X
            datasets: [{
                label: 'Custo Total ($)',
                data: custosTotais, // Dados calculados
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Previsão de Custo EC2 com Base no Uso de CPU, RAM e Tráfego',
                    font: { size: 24, weight: 'bold', family: 'Arial' }, // Tamanho da fonte do título
                    color: 'rgba(255, 255, 255, 1)',
                    padding: { top: 10, bottom: 20 }

                },
                legend: {
                    labels: {
                        font: { size: 16 }, // Tamanho da fonte da legenda
                        color: 'rgba(255, 255, 255, 1)'
                    }
                }

            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Dia de Uso no Mês',
                        font: { size: 15, weight: 'bold', family: 'Arial' }, // Tamanho da fonte do título
                        color: 'rgba(255, 255, 255, 1)',
                        padding: { top: 10, bottom: 20 }
                    },
                    ticks: {
                        font: { size: 14 }, // Tamanho da fonte dos rótulos no eixo X
                        color: 'rgba(255, 255, 255, 1)' // Cor do texto/rótulos no eixo X
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 1)' // Cor das linhas de grade do eixo X
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Custo Total ($)',
                        ticks: {
                            font: { size: 14 }, // Tamanho da fonte dos números no eixo Y
                            color: 'rgba(255, 255, 255, 1)' // Cor do texto/números no eixo Y
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 1)' // Cor das linhas do eixo Y
                        }
                    }
                },
            }


        }
    });
}

criarGraficoPrevisaoCusto();
