package clink.adapters.out;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import io.github.cdimascio.dotenv.Dotenv;
import javax.sql.*;
import java.sql.*;

public class DataBaseConfig {
    private static HikariDataSource dataSource;
    private static final Dotenv dotenv = Dotenv.load();

    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(dotenv.get("DB_URL"));
        config.setUsername(dotenv.get("DB_USER"));
        config.setPassword(dotenv.get("DB_PASSWORD"));
        config.setDriverClassName("org.mariadb.jdbc.Driver");

        // Configuración del pool
        config.setMaximumPoolSize(Integer.parseInt(dotenv.get("DB_POOL_SIZE", "10")));
        config.setMinimumIdle(Integer.parseInt(dotenv.get("DB_MIN_IDLE", "5")));
        config.setIdleTimeout(30000);
        config.setPoolName("MariaDBPool");

        dataSource = new HikariDataSource(config);
    }

    public static DataSource getDataSource() {
        return dataSource;
    }

    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    public static void closePool() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
        }
    }
}
