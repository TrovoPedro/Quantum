var modal = document.getElementById("meu_modal");

var btn = document.getElementById("cadastrarFuncionario");

var span = document.getElementsByClassName("Fechar")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


// Função  para cadastrar o Funcionario

function cadastrarFuncionario() {
    var fotoVar = foto.value;
    var nomeVar = nome.value;
    var emailVar = email.value;
    var cargoVar = cargo.value;
     var senhaVar = senha.value;

    if(
        fotoVar == "" || nomeVar == "" ||
        emailVar == "" || cargoVar == "" || senhaVar == ""
    ){
        alert("Campos em branco por favor preecha-los para conseguirmos dar continuidade ao cadastro")
        return false;
    }

    const formData = new FormData();
    formData.append('foto', foto.files[0])
    formData.append('nome',nome.value)
    formData.append('email',email.value)
    formData.append('cargo',cargo.value)
    formData.append('senha',senha.value)

    console.log(senha.value)

    fetch("usuario/cadastrarFuncionario",{
        method:"POST",
        body: formData
    })
    .then(function(resposta){
        console.log("resposta",resposta);

        if(resposta.ok){
            alert("cadastro realizado com sucesso!")
        }else{
            alert("Houve um erro ao tentar realizar o cadastro!")
        }
    })
    .catch(function(resposta){
        console.log(`#Erro: ${resposta}`)
    });
    return false
}