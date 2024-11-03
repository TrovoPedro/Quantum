package dominio

import com.github.britooo.looca.api.core.Looca
import repositorio.DadosRepositorio
import dominio.Slack
import org.json.JSONObject;
import java.time.Instant
import kotlin.time.Duration
import kotlin.time.Duration.Companion.milliseconds

class Dados {
    var id: Int = 0
    var totalDadosEnviados = 0.0
    var totalDadosRecebidos = 0.0
    var totalPacotesEnviados = 0
    var totalPacotesRecebidos = 0

    val looca = Looca()
    var dadosRepositorio = DadosRepositorio()

    private var capturando = false

    data class DadosDeRede(val enviados: Double, val recebidos: Double)

    fun converterParaMb(totalDados: Double): Double {
        return totalDados / (1024.0 * 1024.0)
    }

    fun capturarDados() {
        Thread {
            capturando = true
            while (capturando) {
                val interfacesDeRede = looca.rede.grupoDeInterfaces.interfaces
                interfacesDeRede.forEach { interfaceDeRede ->
                    totalDadosEnviados += interfaceDeRede.bytesEnviados.toDouble()
                    totalDadosRecebidos += interfaceDeRede.bytesRecebidos.toDouble()
                    totalPacotesEnviados += interfaceDeRede.pacotesEnviados.toInt()
                    totalPacotesRecebidos += interfaceDeRede.pacotesRecebidos.toInt()
                }

                val totalDadosRecebidosMB = converterParaMb(totalDadosRecebidos)
                inserirDados(totalDadosRecebidosMB)

                exibirDados()

                Thread.sleep(5000)
            }
        }.start()
    }

    fun inserirDados(totalDadosRecebidosMB: Double) {
        dadosRepositorio.inserir(totalDadosRecebidosMB)
    }

    fun exibirDados() {
        val dadosRede = DadosDeRede(
            enviados = converterParaMb(totalDadosEnviados),
            recebidos = converterParaMb(totalDadosRecebidos)
        )

        println("Total de Dados Enviados: %.2f MB".format(dadosRede.enviados))
        println("Total de Dados Recebidos: %.2f MB".format(dadosRede.recebidos))
        println("Total de Pacotes Enviados: $totalPacotesEnviados")
        println("Total de Pacotes Recebidos: $totalPacotesRecebidos")
    }

    fun iniciarCaptura() {
        if (!capturando) {
            capturarDados()
        }
    }
    fun pararCaptura() {
        capturando = false
    }

    fun alertar(alertaUsuario:Double){
        val slack = Slack("https://hooks.slack.com/services/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")
        val mensagem = JSONObject().apply {
            put("text", alertaUsuario)
        }
    }

}
