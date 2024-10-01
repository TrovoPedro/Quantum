function validarInformacoes() {
    var empresa = document.getElementById("empresa").value;
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;
    var confirmar_senha = document.getElementById("confirmar_senha").value;

    if (
        empresa === "" ||
        email === "" ||
        senha === "" ||
        confirmar_senha === "" 
    ) {
        alert("Por favor, preencha todos os campos.");
    } else if (senha !== confirmar_senha) {
        alert("As senhas não coincidem.");
    } else {
        cadastrar(empresa, email, senha); // Se todas as validações forem bem-sucedidas, chama a função de cadastro.
    }
}

function cadastrar(empresa, email, senha) {

    console.log(empresa, email, senha);
    
    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            empresa: empresa,
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