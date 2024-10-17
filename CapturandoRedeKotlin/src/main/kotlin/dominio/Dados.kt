package dominio

import com.github.britooo.looca.api.core.Looca
class Dados {
    var id: Int = 0;
    var totalDadosEnviados = 0.0;
    var totalDadosRecebidos = 0.0;
    var totalPacotesEnviados = 0;
    var totalPacotesRecebidos = 0;

    val looca = Looca();
    data class DadosDeRede(val enviados: Double, val recebidos: Double);

    val interfacesDeRede = looca.rede.grupoDeInterfaces.interfaces;
    fun converterParaMb(totalDadosEnviados: Double, totalDadosRecebidos: Double): DadosDeRede {
        val totalDadosEnviadosMB = totalDadosEnviados / (1024.0 * 1024.0);
        val totalDadosRecebidosMB = totalDadosRecebidos / (1024.0 * 1024.0);

        return DadosDeRede(totalDadosEnviadosMB, totalDadosRecebidosMB);
    }

    fun descrever(){
        val dadosRede = converterParaMb(totalDadosEnviados, totalDadosRecebidos);
        println("Total de dominio.Dados Enviados: %.2f MB".format(dadosRede.enviados));
        println("Total de dominio.Dados Recebidos: %.2f MB".format(dadosRede.recebidos));
        println("Total de Pacotes Enviados: $totalPacotesEnviados");
        println("Total de Pacotes Recebidos: $totalPacotesRecebidos");
    }

    fun capturarDados() {
        while (true) {
            interfacesDeRede.forEach { interfaceDeRede ->
                totalDadosEnviados += interfaceDeRede.bytesEnviados.toDouble();
                totalDadosRecebidos += interfaceDeRede.bytesRecebidos;
                totalPacotesEnviados += interfaceDeRede.pacotesEnviados.toInt();
                totalPacotesRecebidos += interfaceDeRede.pacotesRecebidos.toInt();
            }
            println(descrever())
            Thread.sleep(5000);
        }
    }
}