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
            sessionStorage.FKTIPO_USUARIO = json[0].fkTipoUsuario;

            console.log("ID_USUARIO: ", sessionStorage.ID_USUARIO);
            console.log("FKTIPOUSUARIO: ", sessionStorage.FKTIPO_USUARIO);


            if(sessionStorage.FKTIPO_USUARIO == 1){

                console.log("Redirecionando para a página apropriada...");

                setTimeout(function () {
                    window.location = "../listaEmpresas.html";
                }, 500);
            }
            if (sessionStorage.FKTIPO_USUARIO == 2) {
                console.log("Redirecionando para a página apropriada...");

                setTimeout(function () {
                    window.location = "../Dash(ADM).html";
                }, 500);
            }
            if (sessionStorage.FKTIPO_USUARIO == 3) {
                console.log("Redirecionando para a página apropriada...");

                setTimeout(function () {
                    window.location = "../dashboard.html";
                }, 500);
            }
            
        }
    }).catch(function (erro) {
        console.log("Erro de rede ou outra falha:", erro);
    });

    return false;
}
