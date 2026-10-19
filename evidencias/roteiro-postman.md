# Roteiro de Testes - Postman (API LabControl)

**Base URL:** `http://localhost:8080/equipamentos`  
**Header padrão:** `Content-Type: application/json`

---

## 1. Sucessos (Fluxo Principal)

### 1.1. Cadastrar Equipamento (POST)
- **Método:** `POST`
- **URL:** `http://localhost:8080/equipamentos`
- **Status Esperado:** `201 Created`
- **Body (JSON):**
```json
{
  "nome": "Notebook Dell Inspiron",
  "numeroPatrimonio": "PAT-1001",
  "categoria": "Informática",
  "quantidade": 15
}
```
- **Resposta Esperada:**
```json
{
  "id": 1,
  "nome": "Notebook Dell Inspiron",
  "numeroPatrimonio": "PAT-1001",
  "categoria": "Informática",
  "quantidade": 15
}
```

---

### 1.2. Listar Todos os Equipamentos (GET)
- **Método:** `GET`
- **URL:** `http://localhost:8080/equipamentos`
- **Status Esperado:** `200 OK`
- **Resposta Esperada:**
```json
[
  {
    "id": 1,
    "nome": "Notebook Dell Inspiron",
    "numeroPatrimonio": "PAT-1001",
    "categoria": "Informática",
    "quantidade": 15
  }
]
```

---

### 1.3. Buscar Equipamento por ID (GET)
- **Método:** `GET`
- **URL:** `http://localhost:8080/equipamentos/1`
- **Status Esperado:** `200 OK`
- **Resposta Esperada:**
```json
{
  "id": 1,
  "nome": "Notebook Dell Inspiron",
  "numeroPatrimonio": "PAT-1001",
  "categoria": "Informática",
  "quantidade": 15
}
```

---

### 1.4. Atualizar Equipamento (PUT)
- **Método:** `PUT`
- **URL:** `http://localhost:8080/equipamentos/1`
- **Status Esperado:** `200 OK`
- **Body (JSON):**
```json
{
  "nome": "Notebook Dell Inspiron 15 3000",
  "numeroPatrimonio": "PAT-1001",
  "categoria": "Notebooks",
  "quantidade": 18
}
```
- **Resposta Esperada:**
```json
{
  "id": 1,
  "nome": "Notebook Dell Inspiron 15 3000",
  "numeroPatrimonio": "PAT-1001",
  "categoria": "Notebooks",
  "quantidade": 18
}
```

---

### 1.5. Excluir Equipamento (DELETE)
- **Método:** `DELETE`
- **URL:** `http://localhost:8080/equipamentos/1`
- **Status Esperado:** `204 No Content`
- **Resposta Esperada:** Sem corpo de resposta.

---

## 2. Erros de Validação (400 Bad Request)

### 2.1. Nome com 2 Caracteres (Inválido - Mínimo 3)
- **Método:** `POST`
- **URL:** `http://localhost:8080/equipamentos`
- **Status Esperado:** `400 Bad Request`
- **Body (JSON):**
```json
{
  "nome": "PC",
  "numeroPatrimonio": "PAT-2001",
  "categoria": "Informática",
  "quantidade": 5
}
```
- **Resposta Esperada:**
```json
{
  "timestamp": "2026-10-19T19:30:00",
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "nome: O nome deve ter entre 3 e 100 caracteres"
}
```

---

### 2.2. Nome Vazio
- **Método:** `POST`
- **URL:** `http://localhost:8080/equipamentos`
- **Status Esperado:** `400 Bad Request`
- **Body (JSON):**
```json
{
  "nome": "",
  "numeroPatrimonio": "PAT-2002",
  "categoria": "Informática",
  "quantidade": 5
}
```
- **Resposta Esperada:**
```json
{
  "timestamp": "2026-10-19T19:30:00",
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "nome: O nome é obrigatório; nome: O nome deve ter entre 3 e 100 caracteres"
}
```

---

### 2.3. Categoria Vazia
- **Método:** `POST`
- **URL:** `http://localhost:8080/equipamentos`
- **Status Esperado:** `400 Bad Request`
- **Body (JSON):**
```json
{
  "nome": "Teclado USB",
  "numeroPatrimonio": "PAT-2003",
  "categoria": "",
  "quantidade": 10
}
```
- **Resposta Esperada:**
```json
{
  "timestamp": "2026-10-19T19:30:00",
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "categoria: A categoria é obrigatória"
}
```

---

### 2.4. Quantidade Negativa
- **Método:** `POST`
- **URL:** `http://localhost:8080/equipamentos`
- **Status Esperado:** `400 Bad Request`
- **Body (JSON):**
```json
{
  "nome": "Monitor LG 24",
  "numeroPatrimonio": "PAT-2004",
  "categoria": "Monitores",
  "quantidade": -1
}
```
- **Resposta Esperada:**
```json
{
  "timestamp": "2026-10-19T19:30:00",
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "quantidade: A quantidade deve ser maior ou igual a zero"
}
```

---

## 3. Erros de Conflito - Patrimônio Duplicado (409 Conflict)

### 3.1. Patrimônio Duplicado no POST
*Pré-requisito: Já existir equipamento com `numeroPatrimonio: "PAT-1001"`.*
- **Método:** `POST`
- **URL:** `http://localhost:8080/equipamentos`
- **Status Esperado:** `409 Conflict`
- **Body (JSON):**
```json
{
  "nome": "Projetor Epson",
  "numeroPatrimonio": "PAT-1001",
  "categoria": "Multimídia",
  "quantidade": 2
}
```
- **Resposta Esperada:**
```json
{
  "timestamp": "2026-10-19T19:30:00",
  "status": 409,
  "erro": "Conflict",
  "mensagem": "Número de patrimônio já cadastrado: PAT-1001"
}
```

---

### 3.2. Patrimônio Duplicado no PUT
*Pré-requisito: Equipamento com ID 1 tem patrimônio "PAT-1001" e Equipamento com ID 2 tem "PAT-1002". Ao tentar atualizar o ID 2 com o patrimônio "PAT-1001":*
- **Método:** `PUT`
- **URL:** `http://localhost:8080/equipamentos/2`
- **Status Esperado:** `409 Conflict`
- **Body (JSON):**
```json
{
  "nome": "Impressora Laser HP",
  "numeroPatrimonio": "PAT-1001",
  "categoria": "Impressoras",
  "quantidade": 3
}
```
- **Resposta Esperada:**
```json
{
  "timestamp": "2026-10-19T19:30:00",
  "status": 409,
  "erro": "Conflict",
  "mensagem": "Número de patrimônio já cadastrado: PAT-1001"
}
```

---

## 4. Erros de Recurso Não Encontrado (404 Not Found)

### 4.1. ID Inexistente no GET
- **Método:** `GET`
- **URL:** `http://localhost:8080/equipamentos/999`
- **Status Esperado:** `404 Not Found`
- **Resposta Esperada:**
```json
{
  "timestamp": "2026-10-19T19:30:00",
  "status": 404,
  "erro": "Not Found",
  "mensagem": "Equipamento não encontrado com o ID: 999"
}
```

---

### 4.2. ID Inexistente no PUT
- **Método:** `PUT`
- **URL:** `http://localhost:8080/equipamentos/999`
- **Status Esperado:** `404 Not Found`
- **Body (JSON):**
```json
{
  "nome": "Mouse Óptico",
  "numeroPatrimonio": "PAT-3001",
  "categoria": "Periféricos",
  "quantidade": 20
}
```
- **Resposta Esperada:**
```json
{
  "timestamp": "2026-10-19T19:30:00",
  "status": 404,
  "erro": "Not Found",
  "mensagem": "Equipamento não encontrado com o ID: 999"
}
```

---

### 4.3. ID Inexistente no DELETE
- **Método:** `DELETE`
- **URL:** `http://localhost:8080/equipamentos/999`
- **Status Esperado:** `404 Not Found`
- **Resposta Esperada:**
```json
{
  "timestamp": "2026-10-19T19:30:00",
  "status": 404,
  "erro": "Not Found",
  "mensagem": "Equipamento não encontrado com o ID: 999"
}
```
