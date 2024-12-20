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
                    let statusImage = ''
                    let statusText = ''

                    // Formatar para horas e minutos se o downtime for maior que 59 minutos
                    if (downtimeMinutos > 59) {
                        const horas = Math.floor(downtimeMinutos / 60);
                        const minutos = downtimeMinutos % 60;
                        downtimeFormatado = `${horas}h ${minutos}min`;
                    } else {
                        downtimeFormatado = `${downtimeMinutos}min`;
                    }

                    if (downtimeMinutos <= 60) {
                        statusImage = './img/icons8-emoji-de-círculo-verde-48.png';
                        statusText = 'Estável 🟢'
                    } else if (downtimeMinutos > 120 && downtimeMinutos <= 240) {
                        statusImage = './img/icons8-emoji-de-círculo-verde-48.png';
                        statusText = 'Atenção 🟡'
                        //amarelo
                    } else {
                        statusImage = './assets/icons8-emoji-de-círculo-vermelho-48.png';
                        statusText = 'Crítico 🔴'
                    }

                    const row = document.createElement('tr');
                    row.innerHTML = `
                   <td>${item.nomeServidor}</td>
                    <td>${downtimeFormatado}</td>
                     <td style="text-align:center; display:flex; justify-content: center;">${statusText}</td>`

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
                    const minutos = Math.round((value % 1) * 60);

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

/* Card dos servidores */

function aparecerMediaRam() {
    // Seleciona o modal pelo ID ou classe (ajuste de acordo com seu HTML)
    const modalMediaRam = document.getElementById('mediaRam');
    const pai = document.getElementById('div_pai');

    // Altera o estilo do modal para torná-lo visível
    modalMediaRam.style.display = 'block';
    pai.style.filter = "blur(2px)";
}

function esconderMediaRam() {
    const modalMediaRam = document.getElementById('mediaRam');
    const pai = document.getElementById('div_pai');

    modalMediaRam.style.display = 'none';
    pai.style.filter = "blur(0)";
}

function aparecerPicoRam() {
    // Seleciona o modal pelo ID ou classe (ajuste de acordo com seu HTML)
    const modalPicoRam = document.getElementById('picoRam');
    const pai = document.getElementById('div_pai');


    // Altera o estilo do modal para torná-lo visível
    modalPicoRam.style.display = 'block';
    pai.style.filter = "blur(2px)";
}

function esconderPicoRam() {
    const modalPicoRam = document.getElementById('picoRam');
    const pai = document.getElementById('div_pai');

    modalPicoRam.style.display = 'none';
    pai.style.filter = "blur(0)";
}


function aparecerMediaCpu() {
    // Seleciona o modal pelo ID ou classe (ajuste de acordo com seu HTML)
    const modalMediaCpu = document.getElementById('mediaCpu');
    const pai = document.getElementById('div_pai');

    // Altera o estilo do modal para torná-lo visível
    modalMediaCpu.style.display = 'block';
    pai.style.filter = "blur(2px)";
}

function esconderMediaCpu() {
    const modalMediaCpu = document.getElementById('mediaCpu');
    const pai = document.getElementById('div_pai');

    modalMediaCpu.style.display = 'none';
    pai.style.filter = "blur(0)";
}


function aparecerPicoCpu() {
    // Seleciona o modal pelo ID ou classe (ajuste de acordo com seu HTML)
    const modalPicoCpu = document.getElementById('picoCpu');
    const pai = document.getElementById('div_pai');

    // Altera o estilo do modal para torná-lo visível
    modalPicoCpu.style.display = 'block';
    pai.style.filter = "blur(2px)";
}

function esconderPicoCpu() {
    const modalPicoCpu = document.getElementById('picoCpu');
    const pai = document.getElementById('div_pai');

    modalPicoCpu.style.display = 'none';
    pai.style.filter = "blur(0)";
}

// Obter a data atual
const hoje = new Date();

function listarmediaRam() {
    fetch(`/previsao/buscarmediaRam`, {
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

            const tbody = document.querySelector('.listamediaRam tbody');
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

                    const row = document.createElement('tr');
                    row.innerHTML = `
                   <td>${item.nomeServidor}</td>
                    <td>${item.media_ram} %</td>`

                        ;
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados', error);
        });
}


function listarmediaCpu() {
    fetch(`/previsao/buscarmediaCpu`, {
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

            const tbody = document.querySelector('.listamediaCpu tbody');
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

                    const row = document.createElement('tr');
                    row.innerHTML = `
                   <td>${item.nomeServidor}</td>
                    <td>${item.media_cpu} %</td>`

                        ;
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados', error);
        });
}


function listarpicoCpu() {
    fetch(`/previsao/buscarpicoCpu`, {
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

            const tbody = document.querySelector('.listapicoCpu tbody');
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

                    const row = document.createElement('tr');
                    row.innerHTML = `
                   <td>${item.nomeServidor}</td>
                    <td>${item.maximo_usoCpu} %</td>
                     <td>${item.minimo_usoCpu} %</td>`

                        ;
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados', error);
        });
}


function listarpicoRam() {
    fetch(`/previsao/buscarpicoRam`, {
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

            const tbody = document.querySelector('.listapicoRam tbody');
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

                    const row = document.createElement('tr');
                    row.innerHTML = `
                   <td>${item.nomeServidor}</td>
                    <td>${item.maximo_usoRam} %</td>
                     <td>${item.minimo_usoRam} %</td>`

                        ;
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados', error);
        });
}

// Função para calcular o primeiro e último dia da semana
function calcularSemana(data) {
    const primeiroDia = new Date(data); // Clonar a data
    const ultimoDia = new Date(data);

    // Ajustar para o início da semana (segunda-feira)
    primeiroDia.setDate(data.getDate() - data.getDay());

    // Ajustar para o final da semana (domingo)
    // ultimoDia.setDate(data.getDate() - data.getDay() + 6);

    return { primeiroDia, ultimoDia };
}

// Formatar uma data no formato DD/MM/YY
function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Calcular os limites da semana
const { primeiroDia, ultimoDia } = calcularSemana(hoje);

// Atualizar o conteúdo do parágrafo na div "previsao"
const previsaoTexto = document.querySelector('.previsao p');
previsaoTexto.innerHTML = `Monitoramento da semana <br> ${formatarData(primeiroDia)} - ${formatarData(ultimoDia)}`;


function listarSelectOee() {
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

            const selectDiv = document.getElementById('select-oee');
            selectDiv.innerHTML = ''; // Limpar conteúdo anterior da div

            if (!data || data.length === 0) {  // Verificar se data é nulo ou um array vazio
                const noDataMessage = document.createElement('p');
                noDataMessage.textContent = 'Nenhum Registro encontrado.';
                noDataMessage.style.color = '#fff';
                noDataMessage.style.textAlign = 'center';
                selectDiv.appendChild(noDataMessage);
            } else {
                // Cria o elemento select
                const selectElement = document.createElement('select');
                selectElement.classList.add('custom-select'); // Adiciona uma classe CSS, se necessário

                // Adiciona a opção padrão
                selectElement.innerHTML = `<option value="" disabled selected>Selecione um servidor</option>`;

                // Percorrer os dados e adicionar as opções
                data.forEach(item => {
                    // Adicionar uma opção ao select
                    selectElement.innerHTML += `
                    <option value="${item.idServidor}">
                        ${item.nomeServidor}
                    </option>
                `;
                });

                // Adiciona o select na div
                selectDiv.appendChild(selectElement);
                selectElement.addEventListener('change', () => {
                    // Obtém os valores selecionados dinamicamente
                    const servidorSelecionado = selectElement.value; // Valor do servidor selecionado

                    console.log('Servidor Selecionado:', servidorSelecionado);
                    calculoOee();
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
            document.getElementById('select-oee').appendChild(errorMessage);
        });
}
listarSelectOee();

 // CALCULO OEE

 async function obterDadosOee(servidorId) {
    console.log('servidor:', servidorId)

    try {
        let response = await fetch(`/previsao/buscarOee/${servidorId}`);
        let data = await response.json();  // Convertendo a resposta em JSON
        console.log(data)
        return data;  // Retorna os dados para uso posterior
    } catch (error) {
        console.error('Erro ao obter dados:', error);
        return [];  // Retorna um array vazio em caso de erro
    }
}
async function calculoOee(servidorId) {
    const servidorSelecionado = document.querySelector('#select-oee select')?.value; // Pega o value do select de servidor
    const minutosTotais = 10080; // Total de minutos em uma semana
    const minutosPlanejados = 9840; // Minutos planejados (tempo operacional previsto)

    console.log('Servidor Selecionado para cálculo do OEE:', servidorSelecionado);

    if (!servidorSelecionado) {
        console.error("Nenhum servidor selecionado.");
        return; // Não realiza o cálculo se um servidor não for selecionado
    }

    // Obtém dados de downtime
    const valorDowntime = await obterDadosOee(servidorSelecionado);

    if (!valorDowntime || valorDowntime.length === 0) {
        console.error('Dados inválidos para cálculo do OEE.');
        return;
    }

    // Variáveis acumuladoras
    let totalDowntime = 0;

    // Soma todos os downtimes no array
    valorDowntime.forEach(item => {
        totalDowntime += item.total_downtime || 0;
    });

    // Minutos efetivamente disponíveis para operação
    const minutosDisponiveis = minutosPlanejados - totalDowntime;

    // **Cálculo dos Fatores do OEE**
    const disponibilidade = (minutosDisponiveis / minutosPlanejados) * 100; // Disponibilidade em %
    const desempenho = (minutosDisponiveis / minutosTotais) * 100; // Desempenho em %

    // **Cálculo do OEE**
    const oeeFinal = (disponibilidade / 100) * (desempenho / 100) * 100; // Combina disponibilidade e desempenho

    // **Exibição no Console**
    console.log(`Disponibilidade: ${disponibilidade.toFixed(2)}%`);
    console.log(`Desempenho: ${desempenho.toFixed(2)}%`);
    console.log(`OEE Final: ${oeeFinal.toFixed(2)}%`);

    // **Exibição no HTML**
    // document.getElementById('availability').innerText = `${disponibilidade.toFixed(2)}%`;
    // document.getElementById('performance').innerText = `${desempenho.toFixed(2)}%`;
    document.getElementById('oks').innerText = `${oeeFinal.toFixed(2)}%`;

    if (oeeFinal > 85) {
        document.getElementById('oks').style.color = "lightgreen";
    } else if (oeeFinal <= 85 && oeeFinal >= 60 ) {
        document.getElementById('oks').style.color = "yellow";
    } else if (oeeFinal < 60) {
        document.getElementById('oks').style.color = "red";
    }
}
