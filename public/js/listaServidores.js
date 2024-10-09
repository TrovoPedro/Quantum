function cadastrarServidor(){
    console.log("AAAA");
    
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

function editarServidor(){

}

function excluirServidor(){

}