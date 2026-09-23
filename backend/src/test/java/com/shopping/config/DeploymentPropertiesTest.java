package com.shopping.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Properties;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.mock.env.MockEnvironment;

class DeploymentPropertiesTest {
    private MockEnvironment environment() throws Exception {
        Properties properties = PropertiesLoaderUtils.loadProperties(new ClassPathResource("application.properties"));
        MockEnvironment environment = new MockEnvironment();
        properties.forEach((key, value) -> environment.setProperty(key.toString(), value.toString()));
        return environment;
    }

    @Test
    void renderUsesPrivateDatabaseHostAndAssignedPort() throws Exception {
        MockEnvironment environment = environment()
            .withProperty("DB_HOST", "shopping-mysql-private")
            .withProperty("PORT", "10000");
        assertThat(environment.getProperty("spring.datasource.url"))
            .isEqualTo("jdbc:mysql://shopping-mysql-private:3306/shopping_system?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true");
        assertThat(environment.getProperty("server.port")).isEqualTo("10000");
    }

    @Test
    void existingDatabaseUrlAndLocalPortStillWork() throws Exception {
        MockEnvironment environment = environment().withProperty("DB_URL", "jdbc:mysql://existing:3306/shopping_system");
        assertThat(environment.getProperty("spring.datasource.url")).isEqualTo("jdbc:mysql://existing:3306/shopping_system");
        assertThat(environment.getProperty("server.port")).isEqualTo("8081");
    }
}
