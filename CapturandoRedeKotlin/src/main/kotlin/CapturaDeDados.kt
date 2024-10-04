import com.github.britooo.looca.api.core.Looca

fun main() {
    val looca = Looca()

    data class DadosDeRede(val enviados: Double, val recebidos: Double)

    val interfacesDeRede = looca.rede.grupoDeInterfaces.interfaces
    var totalDadosEnviados = 0.0
    var totalDadosRecebidos = 0.0
    var totalPacotesEnviados = 0
    var totalPacotesRecebidos = 0
    var totalInterface = 0

    fun converterParaMb(totalDadosEnviados: Double, totalDadosRecebidos: Double): DadosDeRede {
        val totalDadosEnviadosMB = totalDadosEnviados / (1024.0 * 1024.0)
        val totalDadosRecebidosMB = totalDadosRecebidos / (1024.0 * 1024.0)

        return DadosDeRede(totalDadosEnviadosMB, totalDadosRecebidosMB)
    }

    fun calcularPerdaDePacote(totalPacotesEnviados: Int, totalPacotesRecebidos: Int): Double {
        return if (totalPacotesEnviados > 0) {
            ((totalPacotesEnviados - totalPacotesRecebidos) / totalPacotesEnviados.toDouble()) * 100
        } else {
            0.0
        }
    }

    fun descrever(){
        val dadosRede = converterParaMb(totalDadosEnviados, totalDadosRecebidos)

        println("Total de Dados Enviados: %.2f MB".format(dadosRede.enviados))
        println("Total de Dados Recebidos: %.2f MB".format(dadosRede.recebidos))
        println("Total de Pacotes Enviados: $totalPacotesEnviados")
        println("Total de Pacotes Recebidos: $totalPacotesRecebidos")
        println("Perda de pacotes: %.2f%%".format(calcularPerdaDePacote(totalPacotesEnviados, totalPacotesRecebidos)))
    }

    fun capturarDados() {
        while (true) {
            interfacesDeRede.forEach { interfaceDeRede ->
                totalDadosEnviados += interfaceDeRede.bytesEnviados.toDouble()
                totalDadosRecebidos += interfaceDeRede.bytesRecebidos.toDouble()
                totalPacotesEnviados += interfaceDeRede.pacotesEnviados.toInt()
                totalPacotesRecebidos += interfaceDeRede.pacotesRecebidos.toInt()
                totalInterface += interfacesDeRede.wl.toInt()
            }
            println(descrever())
            Thread.sleep(5000)
        }
    }

    capturarDados()
}
