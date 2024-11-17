var ctx = document.getElementById('grafico-linhas').getContext('2d');
        var meuGrafico = new Chart(ctx, {
            type: 'line', // Tipo de gráfico (bar, line, pie, etc)
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'], // Labels para as barras
                datasets: [{
                    label: 'Vendas por Mês',
                    data: [12, 19, 3, 5, 2], // Dados do gráfico
                    backgroundColor: 'rgba(255, 255, 255, 1)', // Cor de fundo das barras
                    borderColor: 'rgba(255, 255, 255, 1)', // Cor das bordas das barras
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        var ctx = document.getElementById('grafico-linhas2').getContext('2d');
        var meuGrafico = new Chart(ctx, {
            type: 'line', // Tipo de gráfico (bar, line, pie, etc)
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'], // Labels para as barras
                datasets: [{
                    label: 'Vendas por Mês',
                    data: [12, 19, 3, 5, 2], // Dados do gráfico
                    backgroundColor: 'rgba(255, 255, 255, 1)', // Cor de fundo das barras
                    borderColor: 'rgba(255, 255, 255, 1)', // Cor das bordas das barras
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });


        var ctx = document.getElementById('grafico-uso-recursos-secao').getContext('2d');
        var meuGrafico = new Chart(ctx, {
            type: 'bar', // Tipo de gráfico (bar, line, pie, etc)
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'], // Labels para as barras
                datasets: [{
                    label: 'Vendas por Mês',
                    data: [12, 19, 3, 5, 2], // Dados do gráfico
                    backgroundColor: 'rgba(255, 255, 255, 1)', // Cor de fundo das barras
                    borderColor: 'rgba(255, 255, 255, 1)', // Cor das bordas das barras
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        
        var ctx = document.getElementById('grafico-acoes-usuario').getContext('2d');
        var meuGrafico = new Chart(ctx, {
            type: 'bar', // Tipo de gráfico (bar, line, pie, etc)
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'], // Labels para as barras
                datasets: [{
                    label: 'Vendas por Mês',
                    data: [12, 19, 3, 5, 2], // Dados do gráfico
                    backgroundColor: 'rgba(255, 255, 255, 1)', // Cor de fundo das barras
                    borderColor: 'rgba(255, 255, 255, 1)', // Cor das bordas das barras
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });