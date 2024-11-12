function validarEscolha() {
    var escolher = document.getElementById('escolher');  
    var valorInput = Number(escolher.value);

    if (isNaN(valorInput) || valorInput < 1 || valorInput > 4) {
        console.log("Valor inválido");
        return;
    }

    document.getElementById('pai-conteudo').style.display = 'none';
    document.getElementById('pai-conteudo2').style.display = 'none';
    document.getElementById('pai-conteudo3').style.display = 'none';
    document.getElementById('pai-conteudo4').style.display = 'none';

    if (valorInput == 1) {
        document.getElementById('pai-conteudo').style.display = 'flex';
    } else if (valorInput == 2) {
        document.getElementById('pai-conteudo2').style.display = 'flex';
    } else if (valorInput == 3) {
        document.getElementById('pai-conteudo3').style.display = 'flex';
    } else if (valorInput == 4) {
        document.getElementById('pai-conteudo4').style.display = 'flex';
    }
}

function voltarHome(){
    window.location.href = "dashboardComponenteGeral.html";
}

function enviarFormulario(){

}

function verPerfil(){
    window.location.href = "../Tela_Perfil.html";
}

function sair(){
    sessionStorage.clear();
    window.location = "../login.html";
}