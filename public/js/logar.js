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
        console.log("ESTOU NO THEN DO entrar()!")

        if (resposta.ok) {
            console.log(resposta);

            resposta.json().then(json => {
                console.log(json);
                console.log(JSON.stringify(json));
                sessionStorage.EMAIL_USUARIO = json[0].email;
                sessionStorage.NOME_USUARIO = json[0].nomeUsuario;
                sessionStorage.ID_USUARIO = json[0].idUsuario;

                setTimeout(function () {
                    window.location = "../Tela_Perfil.html";
                }, 500); // apenas para exibir o loading

            });

        }
    }).catch(function (erro) {
        console.log(erro);
    })

    return false;
}