import org.apache.commons.dbcp2.BasicDataSource
import org.springframework.jdbc.core.JdbcTemplate

class RepositorioDeConfiguracoes {
    lateinit var jdbcTemplate: JdbcTemplate;

    fun configurar(){
        // Conexão do banco

        val dataSource = BasicDataSource();
        dataSource.driverClassName = "com.mysql.cj.jdbc.Drive"
        dataSource.url = "jdbc:mysql://localhost:3306/meubanco";

        //Credencias do banco
        dataSource.username = "pedrotrovo";
        dataSource.password = "0000"

        jdbcTemplate = JdbcTemplate(dataSource)
    }

}