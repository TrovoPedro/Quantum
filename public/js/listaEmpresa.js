let idUsuario01;
let idEndereco01;

function fecharModal1() {
    var span = document.getElementById("modalCadastroEmpresa");
    span.style.display = "none";
}


function aparecercard() {
    var span = document.getElementById("modalCadastroEmpresa");
    var info = document.getElementById('empresa-list-container')
    info.style.filter = 'blur(2)'
    span.style.display = "block";
}

function cadastroEmpresa() {
    var cardEmpresa = document.getElementById('modalCadastroEmpresa')
    var cardEndereco = document.getElementById('modalCadastroEndereco')


    var nomeEmpresa = document.getElementById("razaosocial").value;
    var cnpjEmpresa = document.getElementById("cnpj").value;

    console.log(nomeEmpresa);
    console.log(cnpjEmpresa);

    fetch("/empresas/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nomeEmpresa: nomeEmpresa,
            cnpjEmpresa: cnpjEmpresa,
        }),
    })
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                throw new Error("Erro no cadastro. Status: " + resposta.status);
            }
        })
        .then(function (resultado) {
            alert("Cadastro feito com sucesso!");
            var idEmpresa = resultado.insertId;

            document.getElementById("idEmpresa").value = idEmpresa;

            cardEmpresa.style.display = 'none';
            cardEndereco.style.display = 'block';
        })
        .catch(function (erro) {
            console.log(`#ERRO: ${erro}`);
            alert("Um erro ocorreu: " + erro.message);
        });

    return false;
}

function cadastroEndereco() {
    var cardEndereco = document.getElementById('modalCadastroEndereco')
    var cardAdm = document.getElementById('modalCadastroAdm')

    var cep = document.getElementById("cep").value;
    var rua = document.getElementById("rua").value;
    var complemento = document.getElementById("complemento").value;
    var numero = document.getElementById("num").value;
    var idEmpresa = document.getElementById("idEmpresa").value;

    fetch("/empresas/cadastrarEnd", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            cep: cep,
            rua: rua,
            complemento: complemento,
            numero: numero,
            idEmpresa: idEmpresa
        }),
    })
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                throw new Error("Erro no cadastro. Status: " + resposta.status);
            }
        })
        .then(function (resultado) {
            alert("Cadastro feito com sucesso!");
            var idEmpresa = resultado.insertId;

            document.getElementById("idEmpresa").value = idEmpresa;
            cardEndereco.style.display = 'none'
            cardAdm.style.display = 'block'
        })
        .catch(function (erro) {
            console.log(`#ERRO: ${erro}`);
            alert("Um erro ocorreu: " + erro.message);
        });

    return false;
}



function listarEmpresa() {

    fetch(`/empresas/buscarPorId`, {
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
            const tbody = document.querySelector('.empresa-list tbody');
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

                <td>${item.razao_social}</td>
                <td>${item.cnpj}</td>
                <td>${item.nome}</td>
                <td>CEP: ${item.cep}, ${item.rua}, nº:${item.num}</td>
                <td>${item.tipo}</td>
                <td>
<td>
    <button onclick="aparecerModalEditar(${item.idUsuario}, 
    '${item.nome}',
     '${item.email}',
     '${item.idEndereco}',
      '${item.cep}', 
       '${item.rua}',
        '${item.num}',)" 
            class="btn-icon" 
            style="width: 35px; height: 35px; padding: 5px; background: #111111; border-style: none;">
        <img class="img-iconsEdit" src="assets/iconlapis.png" alt="" style="width: 25px; height: 25px;">
    </button>
</td>


<td>
    <button onclick="excluirEmpresa(${item.idEmpresa})" class="btn-icon" style="width: 35px; height: 35px; padding: 5px; background: #111111; border-style: none;">
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


function aparecerModalEditar(idUsuario, nome, email, idEndereco,  cep, rua, numero, ) {


    document.getElementById("modalEditarAdm").style.display = "block";


    nomeEditado.value = nome;
    emailGerenteEditado.value = email;

    inputCepEmpresa.value = cep;
    inputRuaEmpresa.value = rua;
    inputNumeroEmpresa.value = numero;

    idUsuario01 = idUsuario;
    idEndereco01 = idEndereco;

}

function fecharModalEditar() {

    document.getElementById("modalEditarAdm").style.display = "none";
}

function abrirModalEditarAdministrador(usuario) {

    console.log("Abrindo modal para editar usuário:", usuario);
    document.getElementById('idUsuario').value = usuario.id;
    document.getElementById('nomeEditado').value = usuario.nome
    document.getElementById('emailGerenteEditado').value = usuario.email;
    document.getElementById('modalEditarAdm').style.display = 'block';

}

function mostrarEditar(idUsuario, nomeAdm, emailAdm) {

    abrirModalEditarAdministrador({ id: idUsuario, nome: nomeAdm, email: emailAdm });

}






function salvarEdicao() {

    var nomeEditado = document.getElementById("nomeEditado").value;
    var emailGerenteEditado = document.getElementById("emailGerenteEditado").value;


    var idUsuario = idUsuario01

    fetch(`/empresas/editarADM/${idUsuario}`, {
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
                throw new Error("Erro ao editar o administrador: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Administrador editado com sucesso:", data);

            document.getElementById("modalEditarAdm").style.display = "none";
            document.getElementById("modalEditarEndereco").style.display = "block";

        })
        .catch(error => {
            console.error("Erro:", error);
        });
}






function editarEndereco() {


    var cepEditado = document.getElementById("inputCepEmpresa").value;
    var ruaEditada = document.getElementById("inputRuaEmpresa").value;
    var numEditado = document.getElementById("inputNumeroEmpresa").value;


    var idEndereco = idEndereco01

    fetch(`/empresas/editarEndereco/${idEndereco}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({

            cep: cepEditado,
            rua: ruaEditada,
            numero: numEditado
            
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao editar o Endereço: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Endereço editado com sucesso:", data);
            alert("Os registros foram editados com sucesso!");
            setTimeout(() => {
                window.location = "listaEmpresas.html";
            }, 2000);

        })
        .catch(error => {
            console.error("Erro:", error);
        });


}





function editarEmpresa() {
    var idEmpresa = sessionStorage.getItem("ID_EMPRESA");
    var idUsuario = sessionStorage.getItem("ID_USUARIO");
    var nomeGerenteEditado = document.getElementById("inputNomeAdm").value;
    var emailGerenteEditado = document.getElementById("inputEmailAdm").value;
    var senhaGerenteEditado = document.getElementById("inputSenhaAdm").value;


    if (!idEmpresa) {
        alert("ID da empresa não encontrado.");
        return;
    }

    if (!idUsuario) {
        alert("ID do gerente não encontrado.");
        return;
    }

    if (!nomeGerenteEditado) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (!emailGerenteEditado) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (!senhaGerenteEditado) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    fetch(`/empresas/editar/${idEmpresa},${idUsuario}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nomeEditado: nomeGerenteEditado
        })
    }).then(function (resposta) {
        if (resposta.ok) {
            window.location = "/listaEmpresas.html";
        } else if (resposta.status == 404) {
            window.alert("Gerente não encontrado.");
        } else {
            alert("Erro ao editar o Gerente. Tente novamente.");
        }
    }).catch(function (erro) {
        console.log(`#ERRO: ${erro}`);
    });
}

function excluirEmpresa(idEmpresa) {

    fetch(`/empresas/excluir/${idEmpresa}`, {
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
                window.location = "/listaEmpresas.html";
            } else if (resposta.status == 404) {
                window.alert("Deu 404!");
            }
        })
        .catch(function (erro) {
            console.log(`#ERRO: ${erro}`);
        });
}