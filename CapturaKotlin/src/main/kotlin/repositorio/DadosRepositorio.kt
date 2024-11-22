package repositorio

import dominio.Componente
import org.apache.commons.dbcp2.BasicDataSource
import org.springframework.jdbc.core.BeanPropertyRowMapper
import org.springframework.jdbc.core.JdbcTemplate

class DadosRepositorio {

    lateinit var jdbcTemplate: JdbcTemplate;
    fun configurar(){
        val dataSource = BasicDataSource();
        dataSource.driverClassName = "com.mysql.cj.jdbc.Driver";
        dataSource.url = "jdbc:mysql://localhost/QuantumDB?useSSL=false&serverTimezone=America/Sao_Paulo"
        dataSource.username = "root"
        dataSource.password = "Semsenha13"

        jdbcTemplate = JdbcTemplate(dataSource);
    }

    fun inserirComponente(nome: String, fabricante: String): Boolean{
        println("Inserindo componente: Nome - ${nome}, Fabricante - ${fabricante}")
        var qtdLinhasAfetadas = jdbcTemplate.update("""
            insert into componente (nomeComponente, fabricante, fkServidor, fkTipoComponente) values(?, ?, 1, 4); 
        """, nome, fabricante);

        return qtdLinhasAfetadas > 0;
    }

    fun inserir(dadosRecebidos: Double): Boolean{
        var qtdLinhasAfetadas = jdbcTemplate.update("""
            insert into log (dtHora, usoComponente, fkComponente) values(NOW(), ?, 3); 
        """, dadosRecebidos,
            );

        return qtdLinhasAfetadas > 0;
    }

    fun listarComponentes(): List<Componente> {
        return jdbcTemplate.query(
            "select idComponente, nomeComponente, fabricante from componente",
            BeanPropertyRowMapper(Componente::class.java)
        )
    }

    fun editarComponente(id: Int, componenteAtualizado: String, fabricanteAtualizado: String): Boolean{
        val qtdLinhasAfetadas = jdbcTemplate.update("""
            update componente set nomeComponente = ?, fabricante = ?
	        where idComponente = ?;
        """,
            componenteAtualizado,
            fabricanteAtualizado,
            id)

        return qtdLinhasAfetadas > 0;
    }

    fun existePorId(id:Int): Boolean{
        val qtdExistentes = jdbcTemplate.queryForObject(
            "select count(*) from componente where idComponente = ?",
            Int::class.java,
            id
        )
        return qtdExistentes > 0
    }

    fun excluirComponente(id: Int): Boolean{
        val qtdLinhasAfetadas = jdbcTemplate.update("""
            delete from componente where idComponente = ?;
        """,
            id)
        return qtdLinhasAfetadas > 0
    }

    fun inserirLimite(limiteUsuario:Double, idComponente: Int):Boolean{
        var qtdLinhasAfetadas = jdbcTemplate.update("""
            insert into LimiteComponente(valorLimite, fkComponente) values (?, ?)
        """, limiteUsuario,
            idComponente)

        println("limite adicionado com sucesso")
        return qtdLinhasAfetadas > 0
    }

    fun inserirServicos(dadosRecebidos: Int): Boolean{
        var qtdLinhasAfetadas = jdbcTemplate.update("""
            insert into tabelaTrovo (qtdServicosAtivos) values(?); 
        """, dadosRecebidos,
        );

        return qtdLinhasAfetadas > 0;
    }

    fun inserirCargaSistema(dadosRecebidos: Int): Boolean{
        var qtdLinhasAfetadas = jdbcTemplate.update("""
            insert into tabelaTrovo (cargaSistema) values(?); 
        """, dadosRecebidos,
        );

        return qtdLinhasAfetadas > 0;
    }

    fun inserirThreads(dadosRecebidos: Int): Boolean{
        var qtdLinhasAfetadas = jdbcTemplate.update("""
            insert into tabelaTrovo (mudancaContexto) values(?); 
        """, dadosRecebidos,
        );

        return qtdLinhasAfetadas > 0;
    }

    fun inserirTotalRam(dadosRecebidos: Long): Boolean{
        println("Esses sao os dados recebidos "+dadosRecebidos)
        var qtdLinhasAfetadas = jdbcTemplate.update("""
            insert into tabelaTrovo (totalMemoriaRam) values(?); 
        """, dadosRecebidos
        );

        return qtdLinhasAfetadas > 0;
    }

    fun inserirTotalSwap(dadosRecebidos: Long): Boolean {
        println("Esses são os dados recebidos: $dadosRecebidos")
        val qtdLinhasAfetadas = jdbcTemplate.update("""
        INSERT INTO tabelaTrovo (totalMemoriaSwap) VALUES (?);
    """, dadosRecebidos)

        return qtdLinhasAfetadas > 0
    }
    fun inserirConsumoSwap(dadosRecebidos: Double): Boolean {
        println("Esses são os dados recebidos: $dadosRecebidos")
        val qtdLinhasAfetadas = jdbcTemplate.update("""
        INSERT INTO tabelaTrovo (consumoMemoriaSwap) VALUES (?);
    """, dadosRecebidos)

        return qtdLinhasAfetadas > 0
    }


}