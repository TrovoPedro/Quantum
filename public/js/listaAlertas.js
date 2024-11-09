
function validarInformacoes() {
    var nomeServidor = document.getElementById("inputNomeServidor").value;
    var situacao = document.getElementById("situacaoServidor").value;

    if (
        nomeServidor === "" ||
        situacao === ""
    ) {
        alert("Por favor, preencha todos os campos.");
    } else {
        cadastrarServidor(nomeServidor, situacao);
    }
}



function mostrarServidor() {

    var mostrar = document.getElementById("aparecerBoxServidor");

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

        // Limpar a lista atual
        const listaServidores = document.getElementById('tabela-servidores');
        listaServidores.innerHTML = '';  // Limpar a estrutura antes de adicionar novos dados

        if (data.length === 0) {
            const div = document.createElement('div');
            div.classList.add('div_Server');
            div.innerHTML = '<p>Nenhum Registro encontrado.</p>';
            listaServidores.appendChild(div);
        } else {
            data.forEach(item => {
                // Criando uma nova div para cada servidor
                const div = document.createElement('div');
                div.classList.add('div_Server');

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


