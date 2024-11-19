
function listarServidor() {
    fetch(`/previsao/buscarPorId`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Transformando a resposta em JSON
    })
    .then(data => {
        console.log(data); // Verifique no console se a resposta está conforme esperado

        const tbody = document.querySelector('.listaRanking tbody');
        tbody.innerHTML = ''; // Limpar a tabela antes de adicionar novas linhas

        if (!data || data.length === 0) {  // Verificar se data é nulo ou um array vazio
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 2;  // Ajuste conforme o número de colunas da sua tabela
            cell.textContent = 'Nenhum Registro encontrado.';
            row.appendChild(cell);
            tbody.appendChild(row);
        } else {
            // Percorrer os dados e adicionar as linhas à tabela
            data.forEach(item => {
                const downtimeMinutos = item.total_downtime;
                let downtimeFormatado;

                // Formatar para horas e minutos se o downtime for maior que 59 minutos
                if (downtimeMinutos > 59) {
                    const horas = Math.floor(downtimeMinutos / 60);
                    const minutos = downtimeMinutos % 60;
                    downtimeFormatado = `${horas}h ${minutos}min` ;
                } else {
                    downtimeFormatado =`${downtimeMinutos}min` ;
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                 <td>${item.nomeServidor}</td>
                    <td>${downtimeFormatado}</td>` 
                   
                ;
                tbody.appendChild(row);
            });
        }
    })
    .catch(error => {
        console.error('Houve um erro ao capturar os dados', error);
    });
}

// HEAT MAP

// Função para obter os dados de previsão de downtime
async function buscarDadosHeatmap() {
    try {
        const response = await fetch('/previsao/buscarHeatmap'); // Altere para a URL da sua API
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do heatmap');
        }
        const series = await response.json();
        console.log('Dados do Heatmap:', series);
        return series;
    } catch (erro) {
        console.error('Erro ao buscar dados do heatmap:', erro);
        return [];
    }
}


// Função para gerar o gráfico de heatmap
async function gerarHeatmap() {
    const series = await buscarDadosHeatmap(); // Busca os dados do backend

    const options = {
        series: series,
        chart: {
            height: 350,
            type: 'heatmap'
        },
        dataLabels: {
            enabled: false
        },
        title: {
            text: 'Previsão de Downtime por Servidor e Dia da Semana',
            style: {
                color: '#fff'
            }
        },
        xaxis: {
            labels: {
                style: {
                    colors: '#fff'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#fff'
                }
            }
        },
        colors: [
            "#E0BBE4", // Roxo muito claro
            "#C89BE3", 
            "#AF7BDC", 
            "#965BD5", 
            "#7D3BCD", // Roxo médio
            "#6424C5", 
            "#4B0DBE", // Roxo escuro
        ],
        tooltip: {
            shared: true,
            y: {
                formatter: function (value) {
                    return value + " horas   de downtime";
                }
            }
        }
    
    };
    
    const chart = new ApexCharts(document.getElementById("chart"), options);
    chart.render();
}


// Chama a função para gerar o gráfico
gerarHeatmap();