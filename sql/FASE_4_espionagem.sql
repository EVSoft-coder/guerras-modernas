-- =============================================================
-- FASE 4 (EXTENSÃO) — SISTEMA DE ESPIONAGEM TÁTICA
-- =============================================================
-- Executar via phpMyAdmin para habilitar relatórios de inteligência

-- 1. Atualizar o tipo ENUM da tabela mensagens
-- Nota: O MySQL não permite adicionar valores a ENUM sem recriar ou alterar a coluna
ALTER TABLE mensagens MODIFY COLUMN tipo ENUM('privada', 'relatorio_ataque', 'relatorio_defesa', 'sistema', 'espionagem') NOT NULL DEFAULT 'privada';

-- 2. Adicionar a coluna metadata para armazenar dados JSON do relatório
ALTER TABLE mensagens ADD COLUMN metadata JSON NULL AFTER lida;

-- 3. (OPCIONAL) Otimizar índice para o novo tipo
CREATE INDEX idx_tipo_espionagem ON mensagens(tipo);

-- =============================================================
-- FIM DA EXPANSÃO DE ESPIONAGEM
-- =============================================================
