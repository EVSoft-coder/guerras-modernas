-- SCRIPT DE MANUTENÇÃO TÁTICA: LIMPEZA DE UNIDADES DUPLICADAS
-- Executar este script no phpMyAdmin para normalizar o catálogo militar.

-- 1. GARANTIR ESTRUTURA (Adiciona colunas se não existirem)
-- Nota: 'IF NOT EXISTS' em colunas requer MariaDB 10.2+ ou MySQL 8.0+. 
-- Se der erro, podes ignorar esta parte se as colunas já existirem.
SET @dbname = DATABASE();
SET @tablename = 'unit_types';

-- Adicionar 'slug'
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'slug') = 0,
  'ALTER TABLE `unit_types` ADD `slug` VARCHAR(50) UNIQUE AFTER `name` ;',
  'SELECT 1;'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar 'building_type'
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'building_type') = 0,
  'ALTER TABLE `unit_types` ADD `building_type` VARCHAR(50) AFTER `slug` ;',
  'SELECT 1;'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. LIMPEZA TOTAL (ATENÇÃO: Isto reinicia as tropas atuais das bases!)
-- Se quiseres manter as tropas, não executes esta parte.
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `unit_queue`;
TRUNCATE TABLE `units`;
TRUNCATE TABLE `unit_types`;
SET FOREIGN_KEY_CHECKS = 1;

-- 3. INSERÇÃO DO CATÁLOGO CONSOLIDADO (V3.9)
INSERT INTO `unit_types` 
(`name`, `slug`, `building_type`, `attack`, `defense`, `speed`, `carry_capacity`, `cost_suprimentos`, `cost_municoes`, `cost_combustivel`, `cost_pessoal`, `build_time`, `created_at`, `updated_at`) 
VALUES
('Infantaria de Elite', 'infantaria', 'quartel', 10, 15, 18.0, 10, 50, 10, 0, 1, 10, NOW(), NOW()),
('Blindado de Reconhecimento', 'blindado', 'fabrica_municoes', 25, 20, 10.0, 20, 120, 30, 40, 2, 25, NOW(), NOW()),
('Tanque de Combate (MBT)', 'tanque', 'quartel', 80, 60, 14.0, 40, 350, 120, 150, 4, 45, NOW(), NOW()),
('Helicóptero de Ataque', 'helicoptero', 'aerodromo', 120, 40, 60.0, 30, 800, 300, 500, 3, 90, NOW(), NOW()),
('Agente de Inteligência (Espião)', 'agente', 'radar_estrategico', 0, 10, 4.0, 0, 150, 0, 50, 1, 60, NOW(), NOW()),
('Atirador Especial (Sniper)', 'sniper', 'quartel', 45, 5, 12.0, 5, 150, 80, 0, 1, 25, NOW(), NOW()),
('Engenheiro Militar', 'engenheiro', 'quartel', 5, 15, 8.0, 150, 100, 20, 20, 1, 15, NOW(), NOW()),
('Líder Político', 'politico', 'quartel', 5, 5, 1.0, 0, 10000, 2000, 5000, 1, 300, NOW(), NOW()),
('Drone de Reconhecimento', 'drone', 'radar_estrategico', 0, 1, 100.0, 0, 500, 50, 200, 1, 30, NOW(), NOW());
