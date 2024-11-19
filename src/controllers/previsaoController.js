var previsaoModel = require("../models/previsaoModel");

function buscarPorId(req, res) {
  var idServidor = req.params.idServidor;

  previsaoModel.buscarPorId(idServidor).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarTendenciaUsoRam(req, res) {
  previsaoModel.buscarTendenciaUsoRamPorDiaSemana().then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log(erro);
    res.status(500).json({ erro: "Erro ao buscar tendência de uso de RAM." });
  });
}

// Busca downtime por dia da semana

async function buscarHeatmap(req, res) {
  try {
      const dados = await previsaoModel.calcularPrevisaoDowntime(); // Dados históricos de downtime

      // Agrupar os dados no formato esperado pelo ApexCharts
      const resultado = dados.reduce((acc, { nomeServidor, dia_semana, total_downtime_minutos }) => {
          if (!acc[nomeServidor]) {
              acc[nomeServidor] = Array(7).fill(0); // Preencher com 0 para os 7 dias da semana
          }
          acc[nomeServidor][dia_semana - 1] = total_downtime_minutos; // Ajuste de índice (1 a 7 para os dias da semana)
          return acc;
      }, {});

      // Calcular a previsão de downtime para os dias sem dados de downtime (com base na média dos dias com dados)
      const resultadoComPrevisao = Object.entries(resultado).map(([nomeServidor, dados]) => {
          const previsao = dados.map((downtime, index) => {
              if (downtime === 0) {
                  // Se o downtime para o dia for 0, calculamos com a média dos outros dias que têm downtime
                  const diasComDowntime = dados.filter(d => d > 0); // Filtra os dias com downtime registrado
                  const mediaDowntime = diasComDowntime.length > 0 
                      ? diasComDowntime.reduce((a, b) => a + b, 0) / diasComDowntime.length 
                      : 0;
                  return mediaDowntime; // Previsão baseada na média dos dias com downtime
              }
              return downtime; // Caso contrário, usamos o downtime já registrado
          });

          // Formatar os dados para o gráfico de heatmap, convertendo minutos para horas
          return {
              name: nomeServidor,
              data: previsao.map((downtime, index) => ({
                  x: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index],
                  y: downtime / 60 // Converte o downtime de minutos para horas
              }))
          };
      });

      res.status(200).json(resultadoComPrevisao);
  } catch (erro) {
      console.error('Erro ao buscar heatmap:', erro);
      res.status(500).json({ erro: 'Erro ao buscar dados para o heatmap' });
  }
}


module.exports = {
  buscarPorId,
  buscarTendenciaUsoRam,
  buscarHeatmap
};