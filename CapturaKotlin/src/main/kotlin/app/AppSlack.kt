package app

import dominio.Slack


fun main() {
    val slack = Slack("https://hooks.slack.com/services/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")

    val message = JSONObject().apply {
        put("text", "Teste")
    }

    slack.sendMessage(message)
}
