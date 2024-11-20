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

                        const nomeServidor = item.nomeServidor;

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

            <h3>Falhas por componente:</h3>

            <div class="ranking">
                <div class="linha_ranking header">
                    <span>COMPONENTE</span>
                    <span>PERÍODO</span>
                    <span>FALHAS</span>
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
                x: { ticks: { color: 'white' } },
                y: { ticks: { color: 'white' } }
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

// document.addEventListener("DOMContentLoaded", function() {
//     buscarProbabilidade();
// });





async function obterDadosDoBanco() {
    try {

        const resultadoComPrevisao = await fetch('/alerta/tendenciaUso');
        const data = await resultadoComPrevisao.json();
        console.log(data)
        return data;



    }

    catch (error) {

        console.error('Erro ao obter dados:', error);
        return [];

    }
}


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
                    borderColor: '#290135',
                    borderWidth: 1,
                },
                {
                    label: 'Tendência de Uso',
                    data: regressionLine,
                    type: 'line',
                    borderColor: 'white',
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
                    radius: 5,
                    backgroundColor: 'white'
                }
            },
            layout: {
                padding: 10
            }
        }
    });

    // Exibir probabilidade de acerto no painel
    document.getElementById('probabilidadeAcerto').textContent = `Probabilidade de Acerto: ${dados.probabilidadeAcerto.toFixed(2)}%`;
}

// Executar função ao carregar a página
criarGrafico();


//#############################################################################################################



async function obterDadosDoBancoMudanca() {


    let componente_prev = document.getElementById("modal_componente_prev").value;

    let previsto = componente_prev;

    if (componente_prev == 1) {
        previsto = '1';
    } else if (componente_prev == 2) {
        previsto = '2';
    } else if (componente_prev == 3) {
        previsto = '3';
    } else if (componente_prev == 4) {
        previsto = '4';
    }


    try {

        const resultadoComPrevisaoMuda = await fetch(`/alerta/tendenciaGeral/${previsto}`);
        const data = await resultadoComPrevisaoMuda.json();
        console.log(data)
        return data;



    }

    catch (error) {

        console.error('Erro ao obter dados:', error);
        return [];

    }
}


let modalChartInstance = null;


async function criarGraficoMudanca() {
    const dados = await obterDadosDoBancoMudanca();

    const dadosAno = dados[0];
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


    modalChartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Alertas de Uso',
                    data: scatterData,
                    backgroundColor: '#290135',
                    borderColor: '#290135',
                    borderWidth: 1,
                },
                {
                    label: 'Tendência de Uso',
                    data: regressionLine,
                    type: 'line',
                    backgroundColor: '#290135',
                    borderColor: '#ffff',
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
                        color: '#FFFFFF'
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
                        color: '#FFFFFF'
                    },
                    ticks: {
                        color: '#FFFFFF'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Número de Alertas',
                        color: '#FFFFFF'
                    },
                    ticks: {
                        color: '#FFFFFF'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            },
            elements: {
                point: {
                    radius: 5,
                    backgroundColor: '#FFC300'
                }
            },
            layout: {
                padding: 10
            }
        }
    });
}


document.getElementById('modal_componente_prev').addEventListener('change', () => {
    criarGraficoMudanca();
});


function buscarProbabilidade() {
    fetch(`/alerta/buscarProbabilidade`, {
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


            const h1 = document.querySelector('#div_percentual h1');

            if (data && data.chance_alerta_percentual !== undefined) {
                h1.textContent = `${data.chance_alerta_percentual}%`;
            } else {
                h1.textContent = "0%";
            }

            document.getElementById('loading').style.display = 'none';
        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados:', error);
            document.getElementById('loading').style.display = 'none';
        });
}


function openModal() {

    const modal = document.getElementById("modal");
    modal.style.display = "block";

    listarVariacao();
}

function openModalPrevisao() {

    const modalPrev = document.getElementById("modal_Previsao");
    modalPrev.style.display = "block";
    buscarProbabilidade();

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



