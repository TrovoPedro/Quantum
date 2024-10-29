package dominio

import java.io.BufferedReader
import java.io.DataOutputStream
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import org.json.JSONObject

class Slack(private val url: String) {

    @Throws(Exception::class)
    fun sendMessage(message: JSONObject) {
        val obj = URL(url)
        val con = obj.openConnection() as HttpURLConnection

        con.requestMethod = "POST"
        con.doOutput = true

        DataOutputStream(con.outputStream).use { wr ->
            wr.writeBytes(message.toString())
        }

        val responseCode = con.responseCode
        println("Sending 'POST' request to URL: $url")
        println("POST parameters: $message")
        println("Response Code: $responseCode")

        BufferedReader(InputStreamReader(con.inputStream)).use { reader ->
            val response = StringBuilder()
            var inputLine: String?

            while (reader.readLine().also { inputLine = it } != null) {
                response.append(inputLine)
            }

            println("Success.")
        }
    }
}
