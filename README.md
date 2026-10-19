# LabControl - API de Controle de Equipamentos

API REST desenvolvida em Java 17 e Spring Boot 3 para gerenciamento de equipamentos do laboratório de informática.

---

## 🛠️ Pré-requisitos

- **Java 17** (JDK 17)
- **Maven 3.8+**
- **MySQL 5.7+ / 8.0+**

---

## 🗄️ 1. Configuração do Banco de Dados

1. Certifique-se de que o serviço do MySQL está em execução na porta `3306`.
2. Crie o banco de dados executando o script `database.sql` no MySQL Workbench, DBeaver ou terminal:
   ```sql
   CREATE DATABASE IF NOT EXISTS labcontrol;
   ```
3. Abra o arquivo `src/main/resources/application.properties` e informe a sua senha do MySQL no campo `spring.datasource.password`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/labcontrol?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=SUA_SENHA_AQUI
   ```

> As tabelas serão criadas automaticamente pelo Hibernate (`ddl-auto=update`).

---

## ▶️ 2. Como Rodar a Aplicação

### Opção A: Pelo Terminal (Maven)
No diretório raiz do projeto, execute:
```bash
mvn clean compile
mvn spring-boot:run
```

### Opção B: Pela IDE (IntelliJ / Eclipse / VS Code)
1. Abra a pasta do projeto na sua IDE.
2. Aguarde a sincronização das dependências do Maven.
3. Execute a classe principal:  
   `src/main/java/com/labcontrol/LabControlApplication.java`

A API estará acessível em: `http://localhost:8080/equipamentos`

---

## 🧪 3. Testes e Evidências

- Roteiro completo de testes com exemplos de requisições, respostas e tratamento de erros:  
  Consulte [evidencias/roteiro-postman.md](evidencias/roteiro-postman.md).
- Scripts SQL para conferência de tabelas e dados:  
  Consulte [evidencias/selects.sql](evidencias/selects.sql).
