// Variáveis para armazenar as instâncias dos gráficos
var graficoAumentoUsuarios = null;
var graficoPrevisaoCusto = null;
var graficoUsoCPU = null;
var graficoUsoRAM = null;
var graficoUsoArmazenamento = null;
var graficoUsoCPU = null;



// Função para destruir o gráfico antes de criar um novo
function destruirGraficoSeExistir(grafico) {
    if (grafico !== null) {
        grafico.destroy();
    }
}

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
                console.log("aaaaa", {labels, valores})
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
                    font: {
                        size: 18,
                        weight: "bold",
                        family: "Arial",
                    },
                    padding: {
                        top: 10,
                        bottom: 20,
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}




// Chamar a função metricasCadastro para buscar os dados e atualizar o gráfico
metricasCadastro();




// Função para criar o gráfico de previsão de custo
function criarGraficoPrevisaoCusto() {


    var ctx = document.getElementById('grafico-previsao-custo').getContext('2d');
    graficoPrevisaoCusto = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
            datasets: [{
                label: 'Vendas por Mês',
                data: [12, 19, 3, 5, 2],
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Previsão de Custo na EC2',
                    font: {
                        size: 18,
                        weight: 'bold',
                        family: 'Arial'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

criarGraficoPrevisaoCusto()

async function usoCpu() {
    try {
        const response = await fetch('/individual_julia/usoCpu');
        const dados = await response.json();
        console.log("Dados recebidos para o gráfico de CPU:", dados);

        if (dados.length > 0) {
            const labels = dados.map(dado => dado.dia_da_semana);
            const picoMaximos = dados.map(dado => dado.pico_maximo);
            const picoMinimos = dados.map(dado => dado.pico_minimo);

            criarGraficoUsoCPU(labels, picoMaximos, picoMinimos);
        } else {
            console.error("Nenhum dado disponível para o gráfico de CPU.");
        }
    } catch (error) {
        console.error("Erro ao buscar os dados do gráfico de CPU:", error);
    }
}
usoCpu();


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
                    text: 'Uso de CPU na EC2',
                    font: { size: 18, weight: 'bold', family: 'Arial' },
                    padding: { top: 10, bottom: 20 }
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
criarGraficoUsoCPU()






// ram

async function usoRam() {
    try {
        const response = await fetch('/individual_julia/usoRam');
        const dados = await response.json();
        console.log("Dados recebidos para o gráfico de RAM:", dados);

        if (dados.length > 0) {
            const labels = dados.map(dado => dado.dia_da_semana);
            const picoMaximos = dados.map(dado => dado.memoria_max_gb);
            const picoMinimos = dados.map(dado => dado.memoria_min_gb);

            graficoUsoRAM(labels, picoMaximos, picoMinimos);
        } else {
            console.error("Nenhum dado disponível para o gráfico de CPU.");
        }
    } catch (error) {
        console.error("Erro ao buscar os dados do gráfico de CPU:", error);
    }
}
usoRam();


// // Função para criar o gráfico de uso de CPU com Pico Máximo e Mínimo
function graficoUsoRAM(labels, picoMaximos, picoMinimos) {

    var ctx = document.getElementById('grafico-uso-ram').getContext('2d');
    graficoUsoRam = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Pico Máximo RAM (%)',
                    data: picoMaximos,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Pico Mínimo RAM (%)',
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
                    font: { size: 18, weight: 'bold', family: 'Arial' },
                    padding: { top: 10, bottom: 20 }
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
graficoUsoRAM()









