function entrar() {
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;

    console.log("FORM LOGIN: ", email);
    console.log("FORM SENHA: ", senha);

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            senha: senha
        })
    }).then(function (resposta) {
        console.log("ESTOU NO THEN DO entrar()!");

        if (resposta.ok) {
            console.log(resposta);
            return resposta.json();
        } else {
            // Lógica para falha na autenticação
            console.log("Erro na autenticação:", resposta.status);
            return resposta.json().then(json => {
                console.log("Mensagem de erro:", json.message);
            });
        }
    }).then(json => {
        if (json) { // Verifique se json existe
            console.log(json);
            console.log(JSON.stringify(json));
            sessionStorage.EMAIL_USUARIO = json[0].email;
            sessionStorage.NOME_USUARIO = json[0].nome;
            sessionStorage.ID_USUARIO = json[0].idUsuario;

            setTimeout(function () {
                window.location = "../Tela_Perfil.html";
            }, 500);
        }
    }).catch(function (erro) {
        console.log("Erro de rede ou outra falha:", erro);
    });

    return false;
}
