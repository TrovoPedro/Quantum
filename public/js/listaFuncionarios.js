let idUsuario01;
let idUsuario02;

var modal = document.getElementById("meu_modal");

var btn = document.getElementById("cadastrarFuncionario");

var span = document.getElementsByClassName("Fechar")[0];

btn.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function validarInformacoes() {
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;
    var nome = document.getElementById("nome").value;
    var fkEmpresa = sessionStorage.getItem("FKEMPRESA");
    console.log("fkEmpresa:", fkEmpresa); 

    if (
        email === "" ||
        senha === "" ||
        nome === "" ||
        !fkEmpresa // Adicionando verificação da empresa
    ) {
        alert("Por favor, preencha todos os campos.");
        return; // Adicione um return para evitar chamada em caso de erro
    }
    console.log("Dados enviados:", {
        nome: nome,
        email: email,
        senha: senha,
        empresa: fkEmpresa
    });
    cadastrarFuncionario(nome, email, senha, fkEmpresa);
}

// Função para cadastrar o Funcionário
function cadastrarFuncionario(nome, email, senha, fkEmpresa) {
    console.log(fkEmpresa, nome, email, senha);
    console.log("Dados enviados:", {
        nome: nome,
        email: email,
        senha: senha,
        empresa: fkEmpresa
    });

    fetch("http://localhost:3333/usuarios/cadastrarFuncionario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome: nome,
            email: email,
            senha: senha,
            empresa: fkEmpresa // Use fkEmprea aqui
        }),
    })
        .then(function (resposta) {
            if (resposta.ok) {
                alert("Cadastro feito com sucesso!");
                setTimeout(() => {
                    window.location = "listaFuncionarios.html";
                }, 2000);
            } else {
                return resposta.json().then(err => {
                    console.error(err);
                    alert("Erro: " + (err.error || "Erro desconhecido"));
                });
            }
        })
        .catch(function (erro) {
            console.log(`#ERRO: ${erro}`);
            alert("Erro de comunicação com o servidor.");
        });

    return false;
}

function listarFuncionario() {
    fetch(`/usuarios/buscarPorId`, {
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
            const tbody = document.querySelector('.listaFuncionario tbody');
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
                    <td>${item.nome}</td>
                    <td>${item.email}</td>
                    <td>${item.tipoNome}</td>
                    <td>${item.razao_social}</td>
                    <td>${item.tipo}</td>

    <td>
        <button onclick="aparecerModalEditar(${item.idUsuario}, 

        '${item.nome}',
        '${item.email}')" 

        class="btn-icon" 
        style="width: 35px; height: 35px; padding: 5px; background: #111111; border-style: none;">
        <img class="img-iconsEdit" src="assets/iconlapis.png" alt="" style="width: 25px; height: 25px">

        </button>

    </td>



    <td>
        <button onclick="excluirFuncionario('${item.idUsuario}')" class="btn-icon" style="width: 35px; height: 35px; padding: 5px; background: #111111; border-style: none;">
            <img class="img-iconsEdit" src="assets/iconLixeira.svg" alt="" style="width: 25px; height: 25px;">
        </button>
    </td>
                    `;
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados', error);
        });
}




function aparecerModalEditar(idUsuario, nome, email) {


    document.getElementById("modalEditarFuncionario").style.display = "block";


    nomeEditado.value = nome;
    emailGerenteEditado.value = email;


    idUsuario01 = idUsuario;
    idUsuario02 = idUsuario;
   
}


function editarFuncionario() {

    var nomeEditado = document.getElementById("nomeEditado").value;
    var emailGerenteEditado = document.getElementById("emailGerenteEditado").value;


    var idUsuario = idUsuario01

    fetch(`/usuarios/editarFunc/${idUsuario}`, {
        method: 'PUT',
        headers: {
    
    
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nomeEditado,
            email: emailGerenteEditado
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao editar o funcionário: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {

            console.log("funcionário editado com sucesso:", data);

        })
        .catch(error => {
            console.error("Erro:", error);
        });
}




function excluirFuncionario(idUsuario) {



    fetch(`/usuarios/excluir/${idUsuario}`, {
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

                window.location = "/listaFuncionarios.html";

            } else if (resposta.status == 404) {

                window.alert("Deu 404!");

            }
        })
        .catch(function (erro) {
            console.log(`#ERRO: ${erro}`);
        });
}

