function validarInformacoes() {
    var empresa = document.getElementById("empresa").value;
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;
    var nome = document.getElementById("nome").value;
    var confirmar_senha = document.getElementById("confirmar_senha").value;

    if (
        empresa === "" ||
        email === "" ||
        senha === "" ||
        confirmar_senha === "" ||
        nome === ""
    ) {
        alert("Por favor, preencha todos os campos.");
    } else if (senha !== confirmar_senha) {
        alert("As senhas não coincidem.");
    } else {
        cadastrar(empresa, nome, email, senha); // Se todas as validações forem bem-sucedidas, chama a função de cadastro.
    }
}

function cadastrar(empresa, nome, email, senha) {

    console.log(empresa, nome, email, senha);
    
    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            empresa: empresa,
            nome: nome,
            email: email,
            senha: senha
        }),
    })
    .then(function (resposta) {
        if (resposta.ok) {
            alert("Cadastro feito com sucesso!");

            setTimeout(() => {
                window.location = "login.html";
            }, 2000);
        } else {
            alert("Houve um erro ao efetuar o cadastro.");
            throw new Error("Erro no cadastro. Status: " + resposta.status);
        }
    })
    .catch(function (erro) {
        console.log(`#ERRO: ${erro}`);
    });

    return false;
}

function listarEmpresa() {
    fetch(`/usuarios/listarEmpresa`, {
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
        const select = document.querySelector('#empresa'); // Seleciona o elemento select corretamente
        select.innerHTML = ''; // Limpa as opções existentes

        if (data.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'Nenhum Registro encontrado.';
            option.disabled = true; // Desabilita a opção
            option.selected = true; // Torna a opção selecionada
            select.appendChild(option);
        } else {
            data.forEach(item => {
                const option = document.createElement('option'); // Cria um novo elemento option
                option.value = item.id; // Define o valor da opção (pode ser o ID da empresa)
                option.textContent = item.razao_social; // Define o texto da opção
                select.appendChild(option); // Adiciona a nova opção ao select
            });
        }
    })
    .catch(error => {
        console.error('Houve um erro ao capturar os dados', error);
    });
}
