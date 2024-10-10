function cadastrar(nome) {
    
    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            empresa: empresa,
            nome: nome,
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


fetch(`/servidores/buscar`, {
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
        const tbody = document.querySelector('#tabela-servidores tbody');
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
                <td>${item.nome}</td>
                <td>${item.fkEmpresa}</td>
                <td>${item.fkLocalizacao}</td>
                <td><button onclick="editarServidor()" class="btn-icon"><img class="img-iconsEdit" src="assets/iconlapis.png" alt=""></button></td>
                <td><button onclick="excluirServidor()" class="btn-icon"><img class="img-iconsEdit" src="assets/iconlixeira.png" alt=""></button></td>
                `;
                tbody.appendChild(row);
            });
        }
    })
    .catch(error => {
        console.error('Houve um erro ao capturar os dados', error);
    });

function editarServidor(idServidor) {
    sessionStorage.ID_SERVIDOR = idServidor;
    window.alert("Você será redirecionado à página de edição do aviso de id número: " + idServidor);
    window.location = "/editarServidor.html"

    fetch(`/servidores/editar/${sessionStorage.getItem("ID_SERVIDOR")}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome.value
        })
    }).then(function (resposta) {

        if (resposta.ok) {
            window.alert("Post atualizado com sucesso pelo usuario de email: " + sessionStorage.getItem("EMAIL_USUARIO") + "!");
            window.location = "/dashboard/mural.html"
        } else if (resposta.status == 404) {
            window.alert("Deu 404!");
        } else {
            throw ("Houve um erro ao tentar realizar a postagem! Código da resposta: " + resposta.status);
        }
    }).catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });
}

function excluirServidor(idServidor) {
    fetch(`/servidores/deletar/${idServidor}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (resposta) {
        if (resposta.ok) {
            window.location = "/listaServidores.html";
        } else if (resposta.status == 404) {
            window.alert("Deu 404! Servidor não encontrado.");
        }
    }).catch(function (erro) {
        console.log(`#ERRO ao excluir servidor: ${erro}`);
    });
}


