// Variáveis para armazenar as instâncias dos gráficos
var graficoAumentoUsuarios = null;
var graficoPrevisaoCusto = null;
var graficoUsoCPU = null;
var graficoUsoRAM = null;
var graficoUsoArmazenamento = null;

// Função para destruir o gráfico antes de criar um novo
function destruirGraficoSeExistir(grafico) {
    if (grafico !== null) {
        grafico.destroy();
    }
}

// Função para criar o gráfico de aumento de usuários
function criarGraficoAumentoUsuarios() {
    destruirGraficoSeExistir(graficoAumentoUsuarios); // Destruir se existir

    var ctx = document.getElementById('grafico-aumento-usuarios').getContext('2d');
    graficoAumentoUsuarios = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
            datasets: [{
                label: 'Aumento de Usuários',
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
                    text: 'Aumento de Usuários Semanalmente',
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

// Função para criar o gráfico de previsão de custo
function criarGraficoPrevisaoCusto() {
    destruirGraficoSeExistir(graficoPrevisaoCusto); // Destruir se existir

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

// Função para criar o gráfico de uso de CPU com Pico Máximo e Mínimo
function criarGraficoUsoCPU() {
    destruirGraficoSeExistir(graficoUsoCPU); // Destruir se existir

    var ctx = document.getElementById('grafico-uso-cpu').getContext('2d');
    graficoUsoCPU = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico (bar)
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
            datasets: [
                {
                    label: 'Pico Máximo CPU (%)',
                    data: [80, 70, 90, 85, 95], // Dados de pico máximo de CPU
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Pico Mínimo CPU (%)',
                    data: [40, 30, 50, 45, 35], // Dados de pico mínimo de CPU
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

// Função para criar o gráfico de uso de RAM com Pico Máximo e Mínimo
function criarGraficoUsoRAM() {
    destruirGraficoSeExistir(graficoUsoRAM); // Destruir se existir

    var ctx = document.getElementById('grafico-uso-ram').getContext('2d');
    graficoUsoRAM = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
            datasets: [
                {
                    label: 'Pico Máximo RAM (%)',
                    data: [70, 60, 80, 75, 85], // Dados de pico máximo de RAM
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Pico Mínimo RAM (%)',
                    data: [30, 20, 40, 35, 25], // Dados de pico mínimo de RAM
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
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

// Função para criar o gráfico de uso de Armazenamento com Pico Máximo e Mínimo
function criarGraficoUsoArmazenamento() {
    destruirGraficoSeExistir(graficoUsoArmazenamento); // Destruir se existir

    var ctx = document.getElementById('grafico-uso-rede').getContext('2d');
    graficoUsoArmazenamento = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
            datasets: [
                {
                    label: 'Pico Máximo Rede (%)',
                    data: [85, 80, 90, 75, 80], // Dados de pico máximo de Armazenamento
                    backgroundColor: 'rgba(153, 102, 255, 0.7)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Pico Mínimo Rede (%)',
                    data: [40, 30, 50, 45, 35], // Dados de pico mínimo de Armazenamento
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Uso de Rede na EC2',
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

// Chame as funções para criar os gráficos
criarGraficoAumentoUsuarios();
criarGraficoPrevisaoCusto();
criarGraficoUsoCPU();
criarGraficoUsoRAM();
criarGraficoUsoArmazenamento();
