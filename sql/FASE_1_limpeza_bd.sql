-- ============================================================
-- GUERRAS MODERNAS — FASE 1: LIMPEZA DA BD
-- Executar no phpMyAdmin (bloco a bloco, pela ordem)
-- Data: 2026-04-24
-- ============================================================

-- ============================================================
-- PASSO 1: NORMALIZAR building_types
-- Alinhar nomes com config/game.php
-- ============================================================
UPDATE building_types SET name = 'hq' WHERE id = 1;
UPDATE building_types SET name = 'mina_suprimentos' WHERE id = 2;
UPDATE building_types SET name = 'refinaria' WHERE id = 3;
UPDATE building_types SET name = 'fabrica_municoes' WHERE id = 4;
UPDATE building_types SET name = 'mina_metal' WHERE id = 5;
UPDATE building_types SET name = 'central_energia' WHERE id = 6;
UPDATE building_types SET name = 'posto_recrutamento' WHERE id = 7;
UPDATE building_types SET name = 'quartel' WHERE id = 8;
UPDATE building_types SET name = 'muralha' WHERE id = 9;
UPDATE building_types SET name = 'housing' WHERE id = 10;

-- ============================================================
-- PASSO 2: NORMALIZAR unit_types
-- Remover acentos e caracteres especiais
-- ============================================================
UPDATE unit_types SET name = 'infantaria' WHERE id = 1;
UPDATE unit_types SET name = 'veiculo_leve_apc' WHERE id = 2;
UPDATE unit_types SET name = 'tanque_combate_mbt' WHERE id = 3;
UPDATE unit_types SET name = 'politico' WHERE id = 4;

-- ============================================================
-- PASSO 3: PREENCHER building_type_id nos edifícios que têm NULL
-- (edifícios injetados pelo bootstrap sem FK)
-- ============================================================

-- Adicionar building_types para os que faltam
INSERT IGNORE INTO building_types (id, name, base_production, production_type, base_build_time)
VALUES
(11, 'aerodromo', 0, NULL, 120),
(12, 'radar_estrategico', 0, NULL, 200),
(13, 'centro_pesquisa', 0, NULL, 300),
(14, 'parlamento', 0, NULL, 600);

-- Atualizar edificios sem building_type_id
UPDATE edificios SET building_type_id = 11 WHERE tipo = 'aerodromo' AND building_type_id IS NULL;
UPDATE edificios SET building_type_id = 12 WHERE tipo = 'radar_estrategico' AND building_type_id IS NULL;
UPDATE edificios SET building_type_id = 13 WHERE tipo = 'centro_pesquisa' AND building_type_id IS NULL;
UPDATE edificios SET building_type_id = 1 WHERE tipo = 'hq' AND building_type_id IS NULL;
UPDATE edificios SET building_type_id = 9 WHERE tipo = 'muralha' AND building_type_id IS NULL;

-- ============================================================
-- PASSO 4: MIGRAR tropas legadas para units
-- (apenas dados da base #1 que existem em tropas mas não em units)
-- ============================================================

-- Verificar: a tabela units já tem infantaria(1) e tanque(3) para base 1
-- Faltam: blindado_apc → unit_type 2, helicoptero_ataque → criar, agente_espiao → criar

-- Inserir APC (blindado_apc = veiculo_leve_apc = unit_type_id 2)
INSERT INTO units (base_id, unit_type_id, quantity, created_at, updated_at)
VALUES (1, 2, 20, NOW(), NOW())
ON DUPLICATE KEY UPDATE quantity = 20;

-- NOTA: helicoptero_ataque e agente_espiao ainda não existem em unit_types
-- Serão adicionados na FASE 2

-- ============================================================
-- PASSO 5: REMOVER TABELAS DUPLICADAS/LIXO
-- Executar DEPOIS de confirmar que os dados estão migrados
-- ============================================================

-- Tabela com nome errado (pluralização Laravel incorreta)
DROP TABLE IF EXISTS `construcaos`;

-- Tabela legada de construções (substituída por building_queue)
DROP TABLE IF EXISTS `construcoes`;

-- Tabela legada de treinos (substituída por unit_queue)
DROP TABLE IF EXISTS `treinos`;

-- Tabela duplicada de pedidos de aliança (manter pedidos_alianca)
DROP TABLE IF EXISTS `pedido_aliancas`;

-- ============================================================
-- PASSO 6: REMOVER COLUNAS LEGADAS DA TABELA bases
-- Estas colunas foram substituídas por edificios e recursos
-- ============================================================
ALTER TABLE `bases`
  DROP COLUMN IF EXISTS `qg_nivel`,
  DROP COLUMN IF EXISTS `muralha_nivel`,
  DROP COLUMN IF EXISTS `recursos_metal`,
  DROP COLUMN IF EXISTS `recursos_energia`,
  DROP COLUMN IF EXISTS `recursos_comida`;

-- ============================================================
-- PASSO 7: LIMPAR tabela tropas (legada)
-- Manter por agora até confirmar que units está completa
-- Depois de tudo validado, executar:
-- DROP TABLE IF EXISTS `tropas`;
-- ============================================================

-- Limpar registos com quantidade 0
DELETE FROM tropas WHERE quantidade = 0;

-- ============================================================
-- PASSO 8: LIMPAR ataque legado não processado
-- ============================================================
-- O registo em ataques (id=1) é legado e nunca vai ser processado
-- porque o sistema novo usa movements
DELETE FROM ataques WHERE processado = 0;

-- ============================================================
-- FIM DA FASE 1
-- Após executar, fazer pull + deploy no servidor para testar
-- ============================================================
