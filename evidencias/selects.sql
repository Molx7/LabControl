-- ========================================================
-- Script de Consulta e Verificação - Banco de Dados LabControl
-- ========================================================

USE labcontrol;

-- 1. Estrutura do Banco de Dados
SHOW TABLES;

-- Estrutura da tabela de equipamentos
DESCRIBE equipamentos;

-- 2. Verificação após cada POST (Inserção)
-- Conferir registro recém-criado por patrimônio ou pelo último ID
SELECT * FROM equipamentos WHERE numero_patrimonio = 'PAT-1001';
SELECT * FROM equipamentos ORDER BY id DESC LIMIT 5;

-- 3. Verificação após cada PUT (Atualização)
-- Conferir se os campos foram atualizados no ID especificado
SELECT * FROM equipamentos WHERE id = 1;

-- 4. Verificação após cada DELETE (Remoção)
-- Conferir se o registro foi removido de fato (deve retornar vazio)
SELECT * FROM equipamentos WHERE id = 1;

-- Conferir quantidade total de registros restantes
SELECT COUNT(*) AS total_equipamentos FROM equipamentos;

-- 5. Listagem Geral de Equipamentos
SELECT id, nome, numero_patrimonio, categoria, quantidade 
FROM equipamentos 
ORDER BY id ASC;
