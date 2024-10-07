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