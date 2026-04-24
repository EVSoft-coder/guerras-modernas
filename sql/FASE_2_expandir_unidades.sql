-- ============================================================
-- GUERRAS MODERNAS — FASE 2: EXPANDIR UNIDADES MILITARES
-- Executar no phpMyAdmin DEPOIS da FASE 1
-- ============================================================

-- ============================================================
-- PASSO 1: INSERIR NOVAS UNIDADES NO CATÁLOGO
-- ============================================================
INSERT INTO unit_types (name, attack, defense, speed, carry_capacity, cost_suprimentos, cost_municoes, cost_combustivel, build_time, building_type, created_at, updated_at) VALUES
('agente_espiao',          0,    2,  30,   0,  500, 100, 200,  180, 'radar_estrategico', NOW(), NOW()),
('helicoptero_ataque',    80,   30,  40,  30,  600, 300, 400,  480, 'aerodromo',         NOW(), NOW()),
('drone_reconhecimento',   0,    0,  50,   0,  200,   0, 150,  120, 'radar_estrategico', NOW(), NOW()),
('artilharia_pesada',    200,   20,   5,   0, 1000, 500, 200,  900, 'fabrica_municoes',  NOW(), NOW()),
('engenheiro',              5,  10,   8,  50,  300,  50, 100,   90, 'posto_recrutamento', NOW(), NOW()),
('sniper',                 50,   5,  12,   5,  400, 150,  50,  150, 'quartel',           NOW(), NOW());

-- ============================================================
-- PASSO 2: MIGRAR tropas legadas restantes para units
-- (helicoptero_ataque e agente_espiao agora existem em unit_types)
-- ============================================================

-- Obter IDs das novas unit_types (podem variar):
-- Usar subquery para ser seguro

-- Helicóptero (43 unidades na base 1)
INSERT INTO units (base_id, unit_type_id, quantity, created_at, updated_at)
SELECT 1, id, 43, NOW(), NOW()
FROM unit_types WHERE name = 'helicoptero_ataque'
ON DUPLICATE KEY UPDATE quantity = 43;

-- Agente Espião (0 na base 1, mas criar o registo)
INSERT INTO units (base_id, unit_type_id, quantity, created_at, updated_at)
SELECT 1, id, 0, NOW(), NOW()
FROM unit_types WHERE name = 'agente_espiao'
ON DUPLICATE KEY UPDATE quantity = 0;

-- ============================================================
-- PASSO 3: AGORA PODEMOS DROPAR A TABELA LEGADA
-- ============================================================
DROP TABLE IF EXISTS `tropas`;

-- ============================================================
-- PASSO 4 (OPCIONAL): DROPAR a tabela ataques legada
-- O sistema novo usa movements + movement_units
-- ============================================================
DROP TABLE IF EXISTS `ataques`;

-- ============================================================
-- FIM DA FASE 2
-- Após executar, fazer pull + deploy no servidor
-- ============================================================
