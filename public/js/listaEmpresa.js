// Função para abrir o modal com os detalhes da empresa

function fecharModal1() {
    var span = document.getElementById("modalCadastroEmpresa");
    span.style.display = "none";
}


function aparecercard() {
    var span = document.getElementById("modalCadastroEmpresa");
    var info = document.getElementById('empresa-list-container')
    info.style.filter = 'blur(2)'
    span.style.display = "block";
}

function cadastroEmpresa() {
    var cardEmpresa = document.getElementById('modalCadastroEmpresa')
    var cardEndereco = document.getElementById('modalCadastroEndereco')


    var nomeEmpresa = document.getElementById("razaosocial").value;
    var cnpjEmpresa = document.getElementById("cnpj").value;

    console.log(nomeEmpresa);
    console.log(cnpjEmpresa);

    fetch("/empresas/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nomeEmpresa: nomeEmpresa,
            cnpjEmpresa: cnpjEmpresa,
        }),
    })
    .then(function (resposta) {
    if (resposta.ok) {
        return resposta.json(); // Retorne o resultado como JSON
    } else {
        throw new Error("Erro no cadastro. Status: " + resposta.status);
    }
})
.then(function (resultado) {
    alert("Cadastro feito com sucesso!");
    var idEmpresa = resultado.insertId; // Armazene o ID da empresa cadastrada

    // Armazenar o id da empresa para o cadastro do endereço
    document.getElementById("idEmpresa").value = idEmpresa; // Crie um input oculto para armazenar o ID
    
    // Agora abra o modal para cadastro do endereço
    cardEmpresa.style.display = 'none';
    cardEndereco.style.display = 'block';
})
.catch(function (erro) {
    console.log(`#ERRO: ${erro}`);
    alert("Um erro ocorreu: " + erro.message);
});

return false;
}

function cadastroEndereco() {
    var cardEndereco = document.getElementById('modalCadastroEndereco')
    var cardAdm = document.getElementById('modalCadastroAdm')

    var cep = document.getElementById("cep").value;
    var rua = document.getElementById("rua").value;
    var complemento = document.getElementById("complemento").value;
    var numero = document.getElementById("num").value;
    var idEmpresa = document.getElementById("idEmpresa").value; // Obtenha o ID da empresa

    fetch("/empresas/cadastrarEnd", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            cep: cep,
            rua: rua,
            complemento: complemento,
            numero: numero,
            idEmpresa: idEmpresa // Inclua o ID da empresa no corpo
        }),
    })
     .then(function (resposta) {
    if (resposta.ok) {
        return resposta.json(); // Retorne o resultado como JSON
    } else {
        throw new Error("Erro no cadastro. Status: " + resposta.status);
    }
})
.then(function (resultado) {
    alert("Cadastro feito com sucesso!");
    var idEmpresa = resultado.insertId; // Armazene o ID da empresa cadastrada

    // Armazenar o id da empresa para o cadastro do endereço
    document.getElementById("idEmpresa").value = idEmpresa; // Crie um input oculto para armazenar o ID
    
    // Agora abra o modal para cadastro do user
    cardEndereco.style.display = 'none'
    cardAdm.style.display = 'block'
})
.catch(function (erro) {
    console.log(`#ERRO: ${erro}`);
    alert("Um erro ocorreu: " + erro.message);
});

return false;
}

function listarEmpresa() {
fetch(`/empresas/buscarPorId`, {
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
        const tbody = document.querySelector('.empresa-list tbody');
        tbody.innerHTML = '';

        if (data.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 5;
            cell.textContent = 'Nenhum Registro encontrado.';
            row.appendChild(cell);
            tbody.appendChild(row);
        } else {
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${item.idEmpresa}</td>
                <td>${item.razao_social}</td>
                <td>${item.cnpj}</td>
                <td>${item.nome}</td>
                <td>CEP: ${item.cep}, ${item.rua}, nº:${item.num}</td>
                <td>${item.tipo}</td>
                <td>
    <td>
    <button onclick="mostrarEditar()" class="btn-icon" style="width: 35px; height: 35px; padding: 5px; background: #111111; border-style: none;">
        <img class="img-iconsEdit" src="assets/iconlapis.png" alt="" style="width: 25px; height: 25px;">
    </button>
</td>
<td>
    <button onclick="excluirServidor()" class="btn-icon" style="width: 35px; height: 35px; padding: 5px; background: #111111; border-style: none;">
        <img class="img-iconsEdit" src="assets/iconLixeira.svg" alt="" style="width: 25px; height: 25px;">
    </button>
</td>
                `;
                tbody.appendChild(row);
            });
        }
    })
    .catch(error => {
        console.error('Houve um erro ao capturar os dados', error);
    });
}