let nomeServer = "";


function validarInformacoes() {
    const nomeServidor = document.getElementById("inputNomeServidor").value;
    const situacao = document.getElementById("situacaoServidor").value;

    if (nomeServidor === "" || situacao === "") {
        alert("Por favor, preencha todos os campos.");
    } else {
        cadastrarServidor(nomeServidor, situacao);
    }
}

function mostrarServidor() {
    const mostrar = document.getElementById("aparecerBoxServidor");

    if (getComputedStyle(mostrar).display === "none") {
        mostrar.style.display = "flex";
    } else {
        mostrar.style.display = "none";
    }
}

function listarServidor() {

    fetch(`/alerta/buscar`, {
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

            const listaServidores = document.getElementById('tabela-servidores');
            listaServidores.innerHTML = '';

            if (data.length === 0) {
                const div = document.createElement('div');
                div.classList.add('div_Server');
                div.innerHTML = '<p>Nenhum Registro encontrado.</p>';
                listaServidores.appendChild(div);
            } else {
                data.forEach(item => {
                    const div = document.createElement('div');
                    div.classList.add('div_Server');

                    div.onclick = () => {

                        let nomeServidor = item.nomeServidor;

                        window.location.href = `/listaAlertas.html?nome=${encodeURIComponent(nomeServidor)}`;
                    };



                    div.innerHTML = `
                    <div class="serverContent">
                        <img src="assets/servidor.svg" alt="Servidor" class="serverImage">
                        <div class="serverDetails">
                            <div class="detailRow"><strong>Nome:</strong> ${item.nomeServidor}</div>
                            <div class="detailRow"><strong>Empresa:</strong> ${item.razao_social}</div>
                            <div class="detailRow"><strong>Situação:</strong> ${item.tipo}</div>
                        </div>
                    </div>
                `;

                

                    listaServidores.appendChild(div);
                });
            }
        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados:', error);
        });
}




function listarAlertas() {

    const urlParams = new URLSearchParams(window.location.search);
    const nomeServidor = urlParams.get("nome");

    if (nomeServidor) {

        document.getElementById("nome_server").textContent = nomeServidor;
        console.log("Nome do servidor:", nomeServidor);

    } else {
        console.warn("Nome do servidor não encontrado na URL.");
    }

    fetch(`/alerta/mostrar`, {
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
            console.log("Dados recebidos da API:", data);

            const section2 = document.getElementById('section2');
            section2.innerHTML = `

            <h3>Alertas por componente:</h3>

            <div class="ranking">
                <div class="linha_ranking header">
                    <span>COMPONENTE</span>
                    <span>PERÍODO</span>
                    <span>ALERTAS</span>
                </div>
            </div>
        `;

            if (data.length === 0) {
                const noAlertsDiv = document.createElement('div');
                noAlertsDiv.classList.add('noAlertsMessage');
                noAlertsDiv.innerHTML = "<p>Nenhum alerta encontrado.</p>";
                section2.appendChild(noAlertsDiv);
            } else {
                data.forEach(item => {
                    const componente = item.Componente || "Desconhecido";
                    const quantidade = item.Alertas || "0";
                    const periodo = item.Periodo || "Desconhecido";

                    const alertaDiv = document.createElement('div');
                    alertaDiv.classList.add('linha_ranking');

                    alertaDiv.innerHTML = `
                    <span>${componente}</span>
                    <span>${periodo}</span> 
                    <span>${quantidade}</span>
                `;

                    section2.querySelector('.ranking').appendChild(alertaDiv);
                });
            }
        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados:', error);
        });

}

function listarComponentes() {

    let componente_SLC = document.getElementById("componenteSelect").value;
    let tempo_SLC = document.getElementById("periodoSelect").value;

    let componente = componente_SLC
    let tempo = tempo_SLC


    if (componente_SLC == 0) {
        componente = 'a'
    } else if (componente_SLC == 1) {
        componente = 'CPU'
    } else if (componente_SLC == 2) {
        componente = 'RAM'
    } else if (componente_SLC == 3) {
        componente = 'DISCO'
    } else if (componente_SLC == 4) {
        componente = 'REDE'
    }


    if (tempo_SLC == 0) {
        tempo = '0'
    } else if (tempo_SLC == 7) {
        tempo = '7'
    } else if (tempo_SLC == 15) {
        tempo = '15'
    } else if (tempo_SLC == 30) {
        tempo = '30'
    }




    fetch(`/alerta/componentes/${componente}/${tempo}`, {
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
            console.log("Dados recebidos da API:", data);


            const section4 = document.getElementById('section4');
            const alertDescriptionDiv = section4.querySelector('.alertDescription');


            alertDescriptionDiv.innerHTML = "<span>Descrição:</span>";

            if (data.length === 0) {
                const noAlertsDiv = document.createElement('div');
                noAlertsDiv.classList.add('noAlertsMessage');
                noAlertsDiv.innerHTML = "<p>Nenhuma descrição encontrada.</p>";
                alertDescriptionDiv.appendChild(noAlertsDiv);
            } else {

                data.forEach(item => {
                    const descricao = item.DescricaoAlerta || "Desconhecido";

                    const alertaDiv = document.createElement('div');
                    alertaDiv.classList.add('alertDescriptionText');
                    alertaDiv.innerHTML = `<span>⚠️ ${descricao}</span>`;

                    alertDescriptionDiv.appendChild(alertaDiv);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar os dados:', error);

        });
}




function graficoComponente() {

    let componente_SLC = document.getElementById("componenteSelect").value;
    let tempo_SLC = document.getElementById("periodoSelect").value;

    let componente = componente_SLC
    let tempo = tempo_SLC


    if (componente_SLC == 0) {
        componente = '%'
    } else if (componente_SLC == 1) {
        componente = 'CPU'
    } else if (componente_SLC == 2) {
        componente = 'RAM'
    } else if (componente_SLC == 3) {
        componente = 'DISCO'
    } else if (componente_SLC == 4) {
        componente = 'REDE'
    }


    if (tempo_SLC == 0) {
        tempo = '0'
    } else if (tempo_SLC == 7) {
        tempo = '7'
    } else if (tempo_SLC == 15) {
        tempo = '15'
    } else if (tempo_SLC == 30) {
        tempo = '30'
    }




    fetch(`/alerta/grafico`, {
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
            console.log("Dados recebidos da API:", data);


            const section4 = document.getElementById('section4');
            const alertDescriptionDiv = section4.querySelector('.alertDescription');


            alertDescriptionDiv.innerHTML = "<span>Descrição:</span>";

            if (data.length === 0) {
                const noAlertsDiv = document.createElement('div');
                noAlertsDiv.classList.add('noAlertsMessage');
                noAlertsDiv.innerHTML = "<p>Nenhuma descrição encontrada.</p>";
                alertDescriptionDiv.appendChild(noAlertsDiv);
            } else {

                data.forEach(item => {
                    const descricao = item.DescricaoAlerta || "Desconhecido";

                    const alertaDiv = document.createElement('div');
                    alertaDiv.classList.add('alertDescriptionText');
                    alertaDiv.innerHTML = `<span>⚠️ ${descricao}</span>`;

                    alertDescriptionDiv.appendChild(alertaDiv);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar os dados:', error);

        });
}

window.addEventListener('load', function () {
    obterDadosGrafico();
    obterDadosGraficoModal();
});




let myChart;
let myChartModal;

let mychartPrev;
let mychartPrev_Modal;


function obterDadosGrafico() {

    let componente_DLT = document.getElementById("modal_componente").value;
    let selecao = componente_DLT;

    if (componente_DLT == 1) {
        selecao = '1';
    } else if (componente_DLT == 2) {
        selecao = '2';
    } else if (componente_DLT == 3) {
        selecao = '3';
    } else if (componente_DLT == 4) {
        selecao = '4';
    }


    fetch(`/alerta/buscaGrafico/${selecao}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                plotarGrafico(resposta);
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    }).catch(function (error) {
        console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
    });
}

let Cp_modal;

function obterDadosGraficoModal() {
    let componente_DLT = document.getElementById("modal_componente").value;
    let selecao = componente_DLT;

    if (componente_DLT == 1) {
        selecao = '1';
    } else if (componente_DLT == 2) {
        selecao = '2';
    } else if (componente_DLT == 3) {
        selecao = '3';
    } else if (componente_DLT == 4) {
        selecao = '4';
    }

    Cp_modal = selecao;


    fetch(`/alerta/buscaModal/${selecao}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                plotarGraficoModal(resposta);
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    }).catch(function (error) {
        console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
    });
}

function plotarGrafico(resposta) {

    let labels = [];
    const nomesMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    let dados = {
        labels: labels,
        datasets: [
            {
                label: 'CPU',
                data: [],
                fill: true,
                borderColor: 'white',
                backgroundColor: '#290135',
                tension: 0.4,
                borderWidth: 2,
                hoverBorderColor: 'white',
                hoverBackgroundColor: '#710991',
                pointBackgroundColor: '#070ca7',
                pointBorderColor: 'white',
            }
        ]
    };

    for (let i = 0; i < resposta.length; i++) {
        const registro = resposta[i];
        const mesNome = nomesMeses[registro.mes - 1];
        labels.push(mesNome);
        dados.datasets[0].data.push(registro.quantidade_alertas);
    }

    const config = {
        type: 'bar',
        data: dados,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: 'white' }
                },
                tooltip: {
                    backgroundColor: '#130228',
                    titleColor: 'white',
                    bodyColor: 'white',
                }
            },
            scales: {
                x: { ticks: { color: 'white' } },
                y: { ticks: { color: 'white' } }
            }
        }
    };

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(document.getElementById('myChartCanvas'), config);
}


function plotarGraficoModal(resposta) {

    let labels = [];

    const nomesMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    let dados = {
        labels: labels,
        datasets: [
            {
                label: 'Alertas',
                data: [],
                fill: true,
                borderColor: 'black',
                backgroundColor: '#290135',
                tension: 0.4,
                borderWidth: 2,
                hoverBorderColor: 'white',
                hoverBackgroundColor: '#710991',
                pointBackgroundColor: '#070ca7',
                pointBorderColor: 'black',
            }
        ]
    };

    for (let i = 0; i < resposta.length; i++) {
        const registro = resposta[i];
        const mesNome = nomesMeses[registro.mes - 1];
        labels.push(mesNome);
        dados.datasets[0].data.push(registro.quantidade_alertas);
    }

    const config = {
        type: 'bar',
        data: dados,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: 'black' }
                },
                tooltip: {
                    backgroundColor: '#130228',
                    titleColor: 'white',
                    bodyColor: 'white',
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'black', 
                        font: {
                            size: 14 
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: 'black', 
                        font: {
                            size: 14 
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)' 
                    }
                }
            }
        }
    };
    

    if (myChartModal) {
        myChartModal.destroy();
    }

    myChartModal = new Chart(document.getElementById('modalChartCanvas'), config);
}



function listarVariacao() {

    console.log(`Variavel cp_modal chamada ${Cp_modal}`);

    document.getElementById('loading').style.display = 'block';

    fetch(`/alerta/variacao/${Cp_modal}`, {
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

            console.log("Dados recebidos da API:", data);

            const tabelaBody = document.getElementById('Variacao_Lista').getElementsByTagName('tbody')[0];

            tabelaBody.innerHTML = "";
            if (data.length === 0) {

                const noAlertsMessage = document.createElement('tr');
                noAlertsMessage.innerHTML = "<td colspan='3'>Nenhum alerta encontrado.</td>";
                tabelaBody.appendChild(noAlertsMessage);
            } else {
                data.forEach(item => {
                    const mes = item.mes || "Desconhecido";
                    const quantidade = item.quantidade_alertas || "0";
                    let variacao = item.variacao_alertas || "0";


                    variacao = parseFloat(variacao);

                    let corMudada = 'green';
                    if (variacao < 0) {
                        corMudada = 'red';
                    }


                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td style="color: black;">${mes}</td>
                    <td style="color: black;">${quantidade}</td>
                    <td style="color: ${corMudada};">${variacao}</td>
                `;
                    tabelaBody.appendChild(row);
                });
            }

            document.getElementById('loading').style.display = 'none';
        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados:', error);
            document.getElementById('loading').style.display = 'none';
        });
}






window.onload = function () {

    listarServidor();
    listarAlertas();
    listarComponentes();
    plotarGrafico();
    plotarGraficoModal();
    obterDadosDoBanco();
    obterDadosDoBancoMudanca();

};



async function obterDadosDoBanco() {
    try {
        const resultadoComPrevisao = await fetch('/alerta/tendenciaUso');
        const data = await resultadoComPrevisao.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Erro ao obter dados:', error);
        return { resultadoComPrevisao: [], probabilidadeAcerto: 0 };
    }
}

async function criarGrafico() {
    const dados = await obterDadosDoBanco();
    const dadosAno = dados.resultadoComPrevisao[0];
    const scatterData = dadosAno.data.map((item, index) => ({
        x: index + 1,
        y: item.y
    }));

    const regressionLine = scatterData.map(point => ({
        x: point.x,
        y: point.y
    }));

    
    const ctx = document.getElementById('myChartPrevisao').getContext('2d');

    new Chart(ctx, {
        
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Alertas de Uso',
                    data: scatterData,
                    backgroundColor: '#290135',
                    borderColor: 'white',
                    borderWidth: 1,
                },
                {
                    label: 'Tendência de Uso',
                    data: regressionLine,
                    type: 'line',
                    borderColor: 'white',
                    backgroundColor: 'white',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {
                            size: 16
                        },
                        color: 'white'
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Meses',
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Número de Alertas',
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            elements: {
                point: {
                    radius: 5,
                    backgroundColor: 'white'
                }
            },
            layout: {
                padding: 10
            }
        }
    });
}

// #############################################################################################################


async function obterDadosDoBancoMudanca() {
    const componentePrev = document.getElementById("modal_componente_prev").value;

    try {
        const resultadoComPrevisaoMuda = await fetch(`/alerta/tendenciaGeral/${componentePrev}`);
        const data = await resultadoComPrevisaoMuda.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Erro ao obter dados:', error);
        return { resultadoComPrevisao: [], probabilidadeAcerto: 0 };
    }
}

let modalChartInstance = null;

async function criarGraficoMudanca() {

    const dados = await obterDadosDoBancoMudanca();


    if (!dados || !dados.resultadoComPrevisao || dados.resultadoComPrevisao.length === 0) {
        console.error("Erro: Dados de previsão não encontrados.");
        return;
    }

    const dadosAno = dados.resultadoComPrevisao[0];
    const scatterData = dadosAno.data.map((item, index) => ({
        x: index + 1,
        y: item.y
    }));

    const regressionLine = scatterData.map(point => ({
        x: point.x,
        y: point.y
    }));

    const ctx = document.getElementById('modalChartCanvasPrev').getContext('2d');

    if (modalChartInstance) {
        modalChartInstance.destroy();
    }
    
    modalChartInstance =new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Alertas de Uso',
                    data: scatterData,
                    backgroundColor: '#290135', 
                    borderColor: 'white',
                    borderWidth: 1,
                    pointRadius: 6, 
                },
                {
                    label: 'Tendência de Uso',
                    data: regressionLine,
                    type: 'line',
                    borderColor: 'white',
                    backgroundColor: 'white',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {
                            size: 16
                        },
                        color: 'white'
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Mês',
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Número de Alertas',
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            elements: {
                point: {
                    radius: 10, 
                    backgroundColor: '#FF0000' 
                }
            },
            layout: {
                padding: 10
            }
        }
    });
    

    const probabilidadeElemento = document.getElementById('probabilidadeAcerto');
    const tbodyElemento = document.querySelector('#faixasPrevisaoTabela tbody');

    tbodyElemento.innerHTML = '';

    if (dados.ranges && dados.faixa) {

        const previsaoFinal = Math.round(dados.previsaoFinal);
        const faixaProbabilidade = Math.round(dados.faixa.prob);

        probabilidadeElemento.innerHTML = `
        Previsão: <strong>${previsaoFinal}</strong> alertas <br />
        Faixa de Confiança: <strong>${faixaProbabilidade}%</strong>
    `;

        dados.ranges.forEach((range, index) => {

            const faixaMin = Math.round(range.min);
            const faixaMax = range.max !== null ? Math.round(range.max) : null;

            const faixa = faixaMax === null
                ? `${faixaMin}+`
                : `${faixaMin} - ${faixaMax}`;


            if (!isNaN(faixaMin) && !isNaN(range.prob)) {
                const tr = document.createElement('tr');

                const faixaTd = document.createElement('td');
                faixaTd.style.border = '1px solid white';
                faixaTd.style.padding = '8px';
                faixaTd.textContent = faixa;

                const probTd = document.createElement('td');
                probTd.style.border = '1px solid white';
                probTd.style.padding = '8px';
                probTd.textContent = `${Math.round(range.prob)}%`;

                tr.appendChild(faixaTd);
                tr.appendChild(probTd);

                tbodyElemento.appendChild(tr);
            } else {
                console.warn("Dados inválidos para um range:", range);
            }
        });
    } else {
        console.error("Erro: Dados de ranges ou faixa não encontrados.");
    }

}

document.getElementById('modal_componente_prev').addEventListener('change', criarGraficoMudanca);

criarGrafico();





function openModal() {

    const modal = document.getElementById("modal");
    modal.style.display = "block";

    listarVariacao();

}

function openModalPrevisao() {

    const modalPrev = document.getElementById("modal_Previsao");
    modalPrev.style.display = "block";
    // buscarProbabilidade();

}

function closeModalPrevisao() {
    const modalPrev = document.getElementById("modal_Previsao");
    modalPrev.style.display = "none";
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}


document.addEventListener("DOMContentLoaded", () => {
    const section1 = document.getElementById("section1");
    if (section1) {
        section1.addEventListener("click", () => {
            console.log("Div section1 clicada! Abrindo modal...");
            openModal();
        });
    }
});



document.addEventListener("DOMContentLoaded", () => {

    const section3 = document.getElementById("section3");

    if (section3) {
        section3.addEventListener("click", () => {
            console.log("Div section3 clicada! Abrindo modal...");
            openModalPrevisao();
        });
    }

});


function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Adiciona título principal
    doc.setFontSize(18);
    doc.text('Relatório de Alertas Mensal', 20, 20);

    // Adiciona gráfico (se existir no DOM)
    const chartCanvas = document.getElementById("myChartCanvas");
    if (chartCanvas) {
        doc.setFontSize(12);
        doc.text('Visão Geral Anual de Alertas de Componentes:', 20, 40);
        try {
            doc.addImage(chartCanvas, 'PNG', 20, 50, 180, 90);
        } catch (error) {
            console.error("Erro ao adicionar gráfico ao PDF:", error);
            doc.text('Erro ao carregar gráfico.', 20, 90);
        }
    }

    // Adiciona título da seção de alertas por componente
    doc.setFontSize(12);
    const alertasTituloY = chartCanvas ? 160 : 50; // Ajusta a posição com base na existência do gráfico
    doc.text('Alertas por Componente:', 20, alertasTituloY);

    // Captura os alertas da tabela em `section2`
    const alertasTabela = [];
    const rows = document.querySelectorAll('#section2 .linha_ranking:not(.header)'); // Ignora o cabeçalho

    rows.forEach(row => {
        const columns = row.querySelectorAll('span');
        const linha = Array.from(columns).map(col => col.textContent.trim());
        alertasTabela.push(linha);
    });

    // Adiciona tabela de alertas ao PDF
    const startYTabela = alertasTituloY + 10;
    if (alertasTabela.length > 0) {
        doc.autoTable({
            head: [['Componente', 'Período', 'Alertas']], // Cabeçalhos da tabela
            body: alertasTabela, // Dados capturados
            startY: startYTabela, // Posição inicial da tabela
            theme: 'grid',
            headStyles: { fillColor: [33, 33, 33], textColor: [255, 255, 255] },
            bodyStyles: { textColor: [0, 0, 0] },
        });
    } else {
        // Caso não haja alertas, exibe mensagem
        doc.text('Nenhum alerta encontrado.', 20, startYTabela);
    }

    // Adiciona título e tabela de variação de alertas (se existir)
    const variacaoTabelaY = doc.autoTable.previous ? doc.autoTable.previous.finalY + 20 : startYTabela + 20;
    const variacaoTabela = [];
    const variacaoRows = document.querySelectorAll('#Variacao_Lista tbody tr');

    console.log("Dados capturados da tabela de variação:", variacaoTabela);

    // Verifica se há dados
    if (variacaoRows.length > 0) {
        variacaoRows.forEach(row => {
            const columns = row.querySelectorAll('td');
            const linha = Array.from(columns).map(col => col.textContent.trim());
            variacaoTabela.push(linha);
        });
    }

    doc.text('Variação de Alertas:', 20, variacaoTabelaY);

    if (variacaoTabela.length > 0) {
        doc.autoTable({
            head: [['Mês', 'Quantidade', 'Variação']], // Cabeçalhos da tabela
            body: variacaoTabela, // Dados capturados
            startY: variacaoTabelaY + 10, // Posição inicial da tabela
            theme: 'grid',
            headStyles: { fillColor: [33, 33, 33], textColor: [255, 255, 255] },
            bodyStyles: { textColor: [0, 0, 0] },
        });
    } else {
        doc.text('Nenhuma variação encontrada.', 20, variacaoTabelaY + 10);
    }

    // Salva o arquivo PDF
    doc.save('Relatório_Alertas.pdf');
}


function calcularSemana() {
    const hoje = new Date();


    const primeiroDiaSemana = new Date(hoje.setDate(hoje.getDate() - hoje.getDay() + 1));


    const ultimoDiaSemana = new Date(hoje.setDate(primeiroDiaSemana.getDate() + 6));


    const formatarData = (data) =>
        data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

    return `${formatarData(primeiroDiaSemana)} - ${formatarData(ultimoDiaSemana)}`;
}


document.addEventListener('DOMContentLoaded', () => {
    const elementoSemana = document.querySelector('.textos p');
    if (elementoSemana) {
        elementoSemana.innerHTML = `Monitoramento da semana <br>${calcularSemana()}`;
    }
});







async function obterDadosOee(servidorId) {
    console.log('servidor:', servidorId)

    try {
        let response = await fetch(`/alerta/buscarOee/${servidorId}`);
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

    
    document.getElementById('oks').innerText = `${oeeFinal.toFixed(2)}%`;

    if (oeeFinal > 85) {
        document.getElementById('oks').style.color = "green";
    } else if (oeeFinal <= 85 && oeeFinal >= 60 ) {
        document.getElementById('oks').style.color = "yellow";
    } else if (oeeFinal < 60) {
        document.getElementById('oks').style.color = "red";
    }
}
