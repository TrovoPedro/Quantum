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

            // Verifique a estrutura da resposta e preencha os campos
            document.getElementById("nome_usuario").textContent = usuario.nomeUsuario || "Nome não encontrado"; // Nome do usuário
            document.getElementById("input_email").value = usuario.email || "Email não encontrado"; // Campo de email
           

            // Verificando se os dados da empresa existem antes de preencher
            if (usuario.nomeEmpresa) {
                document.getElementById("empresa_usuario").textContent = usuario.nomeEmpresa; // Nome da empresa
            } else {
                document.getElementById("empresa_usuario").textContent = "Empresa não encontrada";
            }

            // Formatar e exibir a data no padrão BR
            document.getElementById("data_criacao").textContent = formatarData(usuario.DtCadastro) || "Data de criação não encontrada"; // Data de criação

            document.getElementById("funcao_usuario").textContent = usuario.cargoUsuario || "Cargo não encontrado"; // Função
        })
        .catch(function (erro) {
            console.error("Erro na requisição fetch:", erro);
        });
}

// Função para formatar a data no padrão brasileiro (DD/MM/YYYY)
function formatarData(data) {
    const dataObj = new Date(data);

    // Verifica se a data é válida
    if (isNaN(dataObj)) {
        return "Data inválida";
    }

    return new Intl.DateTimeFormat('pt-BR').format(dataObj);
}


function formatarData(data){
    const newData = new Date(data);

    if (isNaN(newData)) {
        return "Data Invalida"
    }

    return new Intl.DateTimeFormat('pr-BR').format(newData)
}


function uploadImage(event) {
    const file = event.target.files[0];
    const idUsuario = sessionStorage.getItem("ID_USUARIO"); // Pegando o ID do usuário da sessão

    if (!file) {
        return;
    }

    const formData = new FormData();
    formData.append('imagem', file);
    formData.append('idUsuario', idUsuario); // Envia o ID do usuário para atualizar o perfil correto

    // Fazendo o upload para o backend
    fetch('/upload-imagem', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Imagem atualizada com sucesso') {
            // Atualiza a imagem do perfil na interface
            const imageUrl = `assets/${file.name}`; // Caminho da imagem no servidor
            document.getElementById("foto-usuario").src = imageUrl; // Atualiza o src da imagem do perfil
        } else {
            alert('Erro ao atualizar a imagem.');
        }
    })
    .catch(error => {
        console.error('Erro ao fazer upload da imagem:', error);
    });
}
