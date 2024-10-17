package app
import dominio.Dados;
import repositorio.DadosRepositorio;

fun main() {
    val dadosRepositorio = DadosRepositorio();
    dadosRepositorio.configurar();

    val dadosRecebidos = Dados();
    dadosRepositorio.inserir(dadosRecebidos.totalDadosRecebidos)
}
