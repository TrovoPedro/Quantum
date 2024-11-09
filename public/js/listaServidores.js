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

function mostrarEditar(idServidor) {

    sessionStorage.setItem("ID_SERVIDOR", idServidor);
    var mostrar = document.getElementById("aparecerBoxEditar");
    if (getComputedStyle(mostrar).display === "none") {
        mostrar.style.display = "flex";
    } else {
        mostrar.style.display = "none";
    }
}

function cadastrarServidor(nomeServidor, situacao) {

    var nomeServidor = document.getElementById("inputNomeServidor").value;
    var situacao = document.getElementById("situacaoServidor").value;

    console.log(nomeServidor);
    console.log(situacao);

    fetch("/servidores/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nomeServidor: nomeServidor,
            situacao: situacao || "Ativado",
        }),
    })
        .then(function (resposta) {
            if (resposta.ok) {
                alert("Cadastro feito com sucesso!");

                setTimeout(() => {
                    window.location = "listaServidores.html";
                }, 2000);
            } else {
                throw new Error("Erro no cadastro. Status: " + resposta.status);
            }
        })
        .catch(function (erro) {
            console.log(`#ERRO: ${erro}`);
            alert("Um erro ocorreu: " + erro.message);
        });

    return false;
}

function listarServidor() {
    fetch(`/servidores/buscar`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const tbody = document.querySelector('#tabela-servidores tbody');
            tbody.innerHTML = '';

            if (data.length === 0) {
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                cell.colSpan = 5;
                cell.textContent = 'Nenhum Registro encontrado.';
                row.appendChild(cell);
                tbody.appendChild(row);
            } else {
                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${item.idServidor}</td>
                    <td>${item.nomeServidor}</td>
                    <td>${item.razao_social}</td>
                    <td>${item.tipo}</td>

                <td><button onclick="mostrarEditar(${item.idServidor})" class="btn-icon"><img class="img-iconsEdit" src="assets/iconlapis.png" alt=""></button></td>

                
                <td><button onclick="excluirServidor(${item.idServidor})" class="btn-icon"><img class="img-iconsEdit" src="assets/iconLixeira.svg" alt=""></button></td>

                    `;
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados', error);
        });
}

function editarServidor() {

    var idServidor = sessionStorage.getItem("ID_SERVIDOR");
    var nomeServidorEditado = document.getElementById("inputNomeEditado").value;

    if (!idServidor) {
        alert("ID do servidor não encontrado.");
        return;
    }

    if (!nomeServidorEditado) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    fetch(`/servidores/editar/${idServidor}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nomeEditado: nomeServidorEditado 
        })
    }).then(function (resposta) {
        if (resposta.ok) {
            window.location = "/listaServidores.html";
        } else if (resposta.status == 404) {
            window.alert("Servidor não encontrado.");
        } else {
            alert("Erro ao editar o servidor. Tente novamente.");
        }
    }).catch(function (erro) {
        console.log(`#ERRO: ${erro}`);
    });
}



function excluirServidor(idServidor) {
    
    fetch(`/servidores/excluir/${idServidor}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            situacaoEditada: 1
        })
    })
    .then(function (resposta) {
        if (resposta.ok) {
            window.location = "/listaServidores.html";
        } else if (resposta.status == 404) {
            window.alert("Deu 404!");
        }
    })
    .catch(function (erro) {
        console.log(`#ERRO: ${erro}`);
    });
}



