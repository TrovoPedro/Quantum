
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
                        downtimeFormatado = `${horas}h ${minutos}min`;
                    } else {
                        downtimeFormatado = `${downtimeMinutos}min`;
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

    // Normalizando os dados
    const servidores = Array.from(new Set(series.map(item => item.name))); // Nomes únicos dos servidores
    const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']; // Dias da semana

    // Inicializando os dados do heatmap
    const heatmapData = servidores.map(servidor => ({
        name: servidor,
        data: diasDaSemana.map(dia => ({
            x: dia,
            y: 0 // Preenchendo com 0 inicialmente
        }))
    }));

    // Inserindo os valores do backend na estrutura
    series.forEach(item => {
        const servidorIndex = servidores.indexOf(item.name);
        item.data.forEach(d => {
            const diaIndex = diasDaSemana.indexOf(d.x);
            if (diaIndex !== -1) {
                const downtimeValue = parseFloat(d.y);

                // Validando o valor do downtime
                heatmapData[servidorIndex].data[diaIndex].y =
                    downtimeValue > 0 && downtimeValue <= 1440
                        ? downtimeValue
                        : 0; // Substituir valores inválidos por 0
            }
        });
    });

    console.log('Dados normalizados para o Heatmap:', heatmapData);

    // Configuração do gráfico
    const options = {
        series: heatmapData,
        chart: {
            height: 350,
            type: 'heatmap'
        },
        dataLabels: {
            enabled: false
        },
        colors: ["#F3E5F5", "#E1BEE7", "#CE93D8", "#BA68C8", "#9C27B0", "#7B1FA2", "#4A148C"], // Escala de cores (de roxo claro a escuro)
        title: {
            text: '',
            style: {
                color: '#fff'
            }
        },
        xaxis: {
            categories: diasDaSemana,
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
        plotOptions: {
            heatmap: {
                colorScale: {
                    ranges: [
                        { from: 0, to: 30, color: "#F3E5F5", name: "0-30 min" }, // Roxo muito claro
                        { from: 31, to: 60, color: "#E1BEE7", name: "31-60 min" },
                        { from: 61, to: 120, color: "#CE93D8", name: "61-120 min" },
                        { from: 121, to: 240, color: "#BA68C8", name: "121-240 min" },
                        { from: 241, to: 480, color: "#9C27B0", name: "241-480 min" },
                        { from: 481, to: 720, color: "#7B1FA2", name: "481-720 min" },
                        { from: 721, to: 1440, color: "#4A148C", name: "721-1440 min" } // Roxo escuro
                    ]
                }
            }
        },
        tooltip: {
            shared: true,
            y: {
                formatter: function (value) {
                    if (value <= 0) {
                        return "Sem downtime registrado";
                    }

                    const horas = Math.floor(value / 60);
                    const minutos = value % 60;

                    return horas > 0
                        ? `${horas}h ${minutos}min de downtime`
                        : `${minutos}min de downtime`;
                }
            }
        }
    };

    // Renderizando o gráfico
    const chart = new ApexCharts(document.getElementById("chart"), options);
    chart.render();
}

 gerarHeatmap()

//  LISTAGEM SELECT DE SERVIDOR

function listarSelect() {
    fetch(`/previsao/buscarSelect`, {
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
            console.log(data);

            // Obtém a div onde o select será inserido
            const tendenciaDiv = document.getElementById('select-server');
            tendenciaDiv.innerHTML = ''; // Limpa o conteúdo anterior da div

            if (data.length === 0) {
                // Se não houver servidores, exibe uma mensagem
                const noDataMessage = document.createElement('p');
                noDataMessage.textContent = 'Nenhum servidor encontrado.';
                noDataMessage.style.color = '#fff';
                noDataMessage.style.textAlign = 'center';
                tendenciaDiv.appendChild(noDataMessage);
            } else {
                // Cria o elemento select
                const selectElement = document.createElement('select');
                selectElement.classList.add('custom-select'); // Adiciona uma classe para o CSS

                // Adiciona as opções ao select
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Selecione um servidor';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                selectElement.appendChild(defaultOption);

                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.idServidor; // Valor da opção (ID do servidor)
                    option.textContent = item.nomeServidor; // Texto da opção (nome do servidor)
                    selectElement.appendChild(option);
                });

                // Insere o select na div
                tendenciaDiv.appendChild(selectElement);

                // Adiciona um evento de mudança ao select (opcional)
                selectElement.addEventListener('change', event => {
                    const selectedValue = event.target.value;
                    console.log(`Servidor selecionado: ${selectedValue}`);
                    // Aqui você pode adicionar lógica para atualizar o gráfico ou outros elementos com base no servidor selecionado
                });
            }
        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados:', error);

            // Exibe uma mensagem de erro
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Erro ao carregar os servidores.';
            errorMessage.style.color = '#ff0000';
            errorMessage.style.textAlign = 'center';
            document.getElementById('select-server').appendChild(errorMessage);
        });
}

// Chama a função para listar os servidores ao carregar a página
listarSelect();

// LISTAGEM DE COMPONENTE
function listarComponente() {
    fetch(`/previsao/buscarComponente`, {
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
            console.log(data);

            // Obtém a div onde o select será inserido
            const tendenciaDiv = document.getElementById('select-componente');
            tendenciaDiv.innerHTML += ''; // Limpa o conteúdo anterior da div

            if (data.length === 0) {
                // Se não houver servidores, exibe uma mensagem
                const noDataMessage = document.createElement('p');
                noDataMessage.textContent = 'Nenhum componente encontrado.';
                noDataMessage.style.color = '#fff';
                noDataMessage.style.textAlign = 'center';
                tendenciaDiv.appendChild(noDataMessage);
            } else {
                // Cria o elemento select
                const selectElement = document.createElement('select');
                selectElement.classList.add('custom-select'); // Adiciona uma classe para o CSS

                // Adiciona as opções ao select
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Selecione um componente';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                selectElement.appendChild(defaultOption);

                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.idComponente; // Valor da opção (ID do servidor)
                    option.textContent = item.nome; // Texto da opção (nome do servidor)
                    selectElement.appendChild(option);
                });

                // Insere o select na div
                tendenciaDiv.appendChild(selectElement);

                // Adiciona um evento de mudança ao select (opcional)
                selectElement.addEventListener('change', event => {
                    const selectedValue = event.target.value;
                    console.log(`Servidor selecionado: ${selectedValue}`);
                    // Aqui você pode adicionar lógica para atualizar o gráfico ou outros elementos com base no servidor selecionado
                });
            }
        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados:', error);

            // Exibe uma mensagem de erro
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Erro ao carregar os servidores.';
            errorMessage.style.color = '#ff0000';
            errorMessage.style.textAlign = 'center';
            document.getElementById('select-componente').appendChild(errorMessage);
        });
}

// Chama a função para listar os servidores ao carregar a página
listarComponente();