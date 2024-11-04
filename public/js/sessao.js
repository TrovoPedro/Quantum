function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;
    var idEmpresa = sessionStorage.getItem("FKEMPRESA");
    var idUsuario = sessionStorage.getItem("ID_USUARIO")


    var b_usuario = document.getElementById("b_usuario");
    var b_usuario_email = document.getElementById("b_usuario_email");


    if (email != null && nome != null) {
        b_usuario.innerHTML = nome;
        b_usuario_email.innerHTML = email;

    } else {
        window.location = "../login.html";
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../login.html";
}

// carregamento (loading)
function aguardar() {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "flex";
}

function finalizarAguardar(texto) {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "none";

    var divErrosLogin = document.getElementById("div_erros_login");
    if (texto) {
        divErrosLogin.style.display = "flex";
        divErrosLogin.innerHTML = texto;
    }
}


function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById("foto-usuario");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function mostrarDados() {
    var idEmpresa = sessionStorage.getItem("FKEMPRESA");
    console.log("FK da Empresa:", idEmpresa);

    var idUsuario = sessionStorage.getItem("ID_USUARIO");
    console.log("ID do Usuário:", idUsuario);

    fetch(`./usuarios/selecionar/${idUsuario}`)
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Resposta da API:", resposta);
                throw new Error('Erro na resposta da API');
            }
        })
        .then(function (resposta) {
            var dashboard = document.getElementsByClassName("dashboard")[0]; // Correção

            if (resposta.length === 0) {
                dashboard.innerHTML = "<span>Nenhum resultado encontrado.</span>";
                return;
            }

            var usuario = resposta[0]; // Supondo que há um único usuário retornado

            // Preenchendo os campos com os dados do usuário
            document.getElementById("nome_usuario").textContent = usuario.nome; // Nome do usuário
            document.getElementById("input_email").value = usuario.email; // Campo de email
            document.getElementById("input_senha").value = usuario.senha; // Campo de senha
            document.getElementById("empresa_usuario").textContent = usuario.empresa; // Empresa
            document.getElementById("data_criacao").textContent = usuario.datacadastro; // Data de criação
            document.getElementById("funcao_usuario").textContent = usuario.funcao; // Função
        })
        .catch(function (erro) {
            console.error("Erro na requisição fetch:", erro);
        });
}
