-- ============================================================
-- GUERRAS MODERNAS — FASE 3: SISTEMA DE PESQUISA
-- Executar no phpMyAdmin
-- ============================================================

-- PASSO 1: Adicionar coluna processed_at à tabela pesquisas
ALTER TABLE `pesquisas` ADD COLUMN `processed_at` DATETIME NULL DEFAULT NULL AFTER `completado_em`;

-- PASSO 2: Verificar que a coluna 'tipo' existe (já existe no dump original)
-- Se o ResearchService usar 'tipo', confirmar que é esse o campo na tabela

-- FIM DA FASE 3 (BD)
