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

    var idUsuario = sessionStorage.getItem("ID_USUARIO")
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
            if (resposta.length === 0) {
                var Dashboard = document.getElementById("Dashboard");
                info.innerHTML = "<span>Nenhum resultado encontrado.</span>";
                return;
            }

            var html = resposta.map(function (usuario) {
                console.log("Usuário:", usuario);
                // Acesse 'usuario.empresa' para obter os dados da empresa
                return `
                    <div class="box1low">
                        <div class="cardServidor">
                            <div class="boxServidores">
                                <span>Email:</span>
                                <input type="email" class="input-perfil" class="container_radiu"> <span id="b_usuario_email" value="${usuario.email}" style="color: gray;"></span></input>
                            </div>
                            <div class="boxServidores">
                                <span>Senha:</span>
                                <input type="password" class="input-perfil" class="container_radiu" id="senha" value="${usuario.senha}" contenteditable="true"></input>
                            </div>
                        </div>
                    </div>
                    <div class="box2low">
                        <div class="cardServidor">
                            
                            <div class="boxServidores">
                                <span>Data de criação:</span>
                                <div class="container_radiu">
                                    <span id="data_criacao" value="${usuario.datacadastro}">${usuario.datacadastro}</span>
                                </div>
                            </div>
                            <div class="boxServidores">
                                <span>Função:</span>
                                <div class="container_radiu">
                                    <span id="funcao" value="${usuario.funcao}">${usuario.funcao}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            })
            
            
        })
        .catch(function (erro) {
            console.error("Erro na requisição fetch:", erro);
        });
}
