package app

import com.github.britooo.looca.api.core.Looca
import dominio.Componente;
import dominio.Dados;
import oshi.SystemInfo
import repositorio.DadosRepositorio;

open class Main {
    companion object {
        @JvmStatic
        fun main(args: Array<String>) {

            val dadosRepositorio = DadosRepositorio();
            dadosRepositorio.configurar();

            val dadosRecebidos = Dados();
            dadosRecebidos.dadosRepositorio = dadosRepositorio

            println("Informe seu nome: ");
            val nomeUsuario = readln();

            var capturaAtiva = false;
            val componente = Componente();
            var nome: String = "";
            var fabricante: String = "";

            while (true) {
                println(
                    """
            <-----Olá ${nomeUsuario}-----> 
            O que gostaria de fazer? 
            1 - Cadastrar componente 
            2 - Iniciar/Parar captura de rede  
            3 - Listar componentes 
            4-  Editar componente
            5 - Excluir componente
            6 - Cadastrar alerta
            7 - Sair
            """.trimIndent()
                );

                val opcao = readln().toInt();

                when (opcao) {
                    1 -> {
                        println("Informe o nome do componente: ");
                        nome = readln();
                        println("Informe o fabricante do componente: ");
                        fabricante = readln();

                        if (nome.isNotEmpty() && fabricante.isNotEmpty()) {
                            componente.setNomeComponente(nome);
                            componente.setFabricante(fabricante);
                            dadosRepositorio.inserirComponente(componente.nome, componente.fabricante);
                        } else {
                            println("Por favor, preencha todos os campos.");
                        }
                    }

                    2 -> {
                        capturaAtiva = if (!capturaAtiva) {
                            println("Iniciando captura de rede...");
                            dadosRecebidos.iniciarCaptura();
                            //dadosRecebidos.alertar(10.0);
                            true
                        } else {
                            println("Captura de rede finalizada.");
                            dadosRecebidos.pararCaptura();
                            false
                        }
                    }

                    3 -> {
                        val listaComponente = dadosRepositorio.listarComponentes()
                        println("<-----Listagem dos componentes----->")
                        listaComponente.forEach {
                            println(
                                """
                        ID: ${it.idComponente}
                        Nome componente: ${it.nome}
                        Fabricante: ${it.fabricante}
                    """
                            )
                        }
                    }

                    4 -> {
                        println("Digite o id do componente para ser atualizado: ");
                        val id = readln().toInt();

                        if (!dadosRepositorio.existePorId(id)) {
                            println("O componente com ID $id não existe.");
                        } else {
                            println("Informe o novo nome do componente: ");
                            nome = readln();

                            println("Informe o novo fabricante do componente: ");
                            fabricante = readln();

                            if (nome.isNotEmpty() && fabricante.isNotEmpty()) {
                                val atualizadoComSucesso = dadosRepositorio.editarComponente(id, nome, fabricante);
                                if (atualizadoComSucesso) {
                                    println("Componente atualizado com sucesso!");
                                } else {
                                    println("Erro ao atualizar o componente.");
                                }
                            } else {
                                println("Nome e fabricante não podem estar vazios.");
                            }
                        }
                    }

                    5 -> {
                        println("Digite o id do componente para ser excluído: ");
                        val id = readln().toInt();

                        if (!dadosRepositorio.existePorId(id)) {
                            println("O componente com ID $id não existe.");
                        } else {
                            val excluidoComSucesso = dadosRepositorio.excluirComponente(id);
                            if (excluidoComSucesso) {
                                println("Componente excluído com sucesso.");
                            } else {
                                println("Erro ao excluir o componente.");
                            }
                        }
                    }

                    6 -> {
                        println("Informe a quantidade limite de dados a serem recebidos pelo componente de rede: ")
                        dadosRecebidos.limiteRede = readln().toDouble();
                        //dadosRecebidos.alertar(dadosRecebidos.limiteRede);
                        dadosRepositorio.inserirLimite(dadosRecebidos.limiteRede, 4)

                        println("Informe o uso máximo de CPU: ")
                        dadosRecebidos.limiteCpu = readln().toDouble();
                        //dadosRecebidos.alertar(dadosRecebidos.limiteCpu);
                        dadosRepositorio.inserirLimite(dadosRecebidos.limiteCpu, 1)

                        println("Informe o uso máximo de RAM: ")
                        dadosRecebidos.limiteRam = readln().toDouble();
                        //dadosRecebidos.alertar(dadosRecebidos.limiteRam);
                        dadosRepositorio.inserirLimite(dadosRecebidos.limiteRam, 2)

                        println("Informe o limite de uso do disco: ")
                        dadosRecebidos.limiteDisco = readln().toDouble();
                        //dadosRecebidos.alertar(dadosRecebidos.limiteDisco);
                        dadosRepositorio.inserirLimite(dadosRecebidos.limiteDisco, 3)

                    }

                    7 -> {
                        println("Saindo...")
                        break
                    }

                    else -> {
                        println("Opção inválida, tente novamente.")
                    }
                }
            }
        }
    }
}