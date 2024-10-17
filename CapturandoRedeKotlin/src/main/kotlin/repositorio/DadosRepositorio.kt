package repositorio

import org.apache.commons.dbcp2.BasicDataSource
import org.springframework.jdbc.core.JdbcTemplate

class DadosRepositorio {

    lateinit var jdbcTemplate: JdbcTemplate;

    fun configurar(){
        val dataSource = BasicDataSource();
        dataSource.driverClassName = "com.mysql.cj.jdbc.Driver";
        dataSource.url = "jdbc:mysql://localhost:3306/QuantumDB";
        dataSource.username = "root"
        dataSource.password = "Semsenha13"

        jdbcTemplate = JdbcTemplate(dataSource);
    }

    fun inserir(dadosRecebidos: Double): Boolean{
        var qtdLinhasAfetadas = jdbcTemplate.update("""
            insert into log (usoComponente) values(?); 
        """, dadosRecebidos);

        return qtdLinhasAfetadas > 0;
    }


}