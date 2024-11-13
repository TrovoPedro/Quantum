function listarServidor() {

    fetch(`/previsao/buscarPorId`, {
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
            const tbody = document.querySelector('.listaRanking tbody');
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

                <td>${item.nomeServidor}</td>
                <td>${item.downtime_minutos} minutos</td>
                `;
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Houve um erro ao capturar os dados', error);
        });
}
