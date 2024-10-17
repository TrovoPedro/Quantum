package dominio

import repositorio.DadosRepositorio

class Componente {
    var idComponente: Int = 0

    var nome: String = ""
        private set;
    var fabricante: String = ""
        private set;

    fun setId(novoId: Int) {
        idComponente = novoId
    }

    fun setNomeComponente(novoNome: String){
        if(novoNome.length > 3){
            nome = novoNome;
        }
    }

    fun setFabricante(novoFabricante: String){
        if(novoFabricante.length > 3){
            fabricante = novoFabricante;
        }
    }

    val dadosRepositorio = DadosRepositorio();

}