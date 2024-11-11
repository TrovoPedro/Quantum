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
