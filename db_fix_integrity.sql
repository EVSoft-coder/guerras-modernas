-- SQL Fix for Guerras Modernas - Database Integrity & Tactical UI
-- Run this script to fix unit types, deduplicate, and sync coordinates.

-- 1. Ensure columns exist in unit_types
ALTER TABLE `unit_types` ADD COLUMN IF NOT EXISTS `slug` VARCHAR(50) AFTER `name`;
ALTER TABLE `unit_types` ADD COLUMN IF NOT EXISTS `display_name` VARCHAR(100) AFTER `slug`;
ALTER TABLE `unit_types` ADD COLUMN IF NOT EXISTS `cost_metal` INT DEFAULT 0 AFTER `cost_combustivel`;
ALTER TABLE `unit_types` ADD COLUMN IF NOT EXISTS `cost_pessoal` INT DEFAULT 1 AFTER `cost_metal`;

-- 2. Consolidate unit_types and set display names
-- First, ensure all have slugs (if missing)
UPDATE `unit_types` SET `slug` = `name` WHERE `slug` IS NULL OR `slug` = '';

-- Set Display Names and fix Slugs (Atomic mapping for core units)
UPDATE `unit_types` SET `display_name` = 'Infantaria Ligeira', `slug` = 'infantaria' WHERE `name` LIKE '%infantaria%';
UPDATE `unit_types` SET `display_name` = 'Blindado APC', `slug` = 'blindado_apc' WHERE `name` LIKE '%apc%' OR `name` LIKE '%blindado%';
UPDATE `unit_types` SET `display_name` = 'Tanque MBT', `slug` = 'tanque_combate' WHERE `name` LIKE '%tanque%' OR `name` LIKE '%mbt%';
UPDATE `unit_types` SET `display_name` = 'Líder Político', `slug` = 'politico' WHERE `name` LIKE '%politico%';
UPDATE `unit_types` SET `display_name` = 'Agente Espião', `slug` = 'agente_espiao' WHERE `name` LIKE '%espiao%';
UPDATE `unit_types` SET `display_name` = 'Helicóptero de Ataque', `slug` = 'helicoptero' WHERE `name` LIKE '%helicoptero%';
UPDATE `unit_types` SET `display_name` = 'Drone Recon', `slug` = 'drone' WHERE `name` LIKE '%drone%';
UPDATE `unit_types` SET `display_name` = 'Artilharia Pesada', `slug` = 'artilharia' WHERE `name` LIKE '%artilharia%';
UPDATE `unit_types` SET `display_name` = 'Engenheiro Militar', `slug` = 'engenheiro' WHERE `name` LIKE '%engenheiro%';
UPDATE `unit_types` SET `display_name` = 'Sniper de Elite', `slug` = 'sniper' WHERE `name` LIKE '%sniper%';

-- 3. Sync coords (Essential for MapService calculation)
UPDATE `bases` SET `x` = `coordenada_x`, `y` = `coordenada_y` WHERE `x` = 0 OR `x` IS NULL;

-- 4. Cleanup Duplicates
-- Map units/queue from duplicate IDs (11-16) to canonical IDs (5-10)
UPDATE `units` SET `unit_type_id` = 5 WHERE `unit_type_id` = 11;
UPDATE `units` SET `unit_type_id` = 6 WHERE `unit_type_id` = 12;
UPDATE `units` SET `unit_type_id` = 7 WHERE `unit_type_id` = 13;
UPDATE `units` SET `unit_type_id` = 8 WHERE `unit_type_id` = 14;
UPDATE `units` SET `unit_type_id` = 9 WHERE `unit_type_id` = 15;
UPDATE `units` SET `unit_type_id` = 10 WHERE `unit_type_id` = 16;

UPDATE `unit_queue` SET `unit_type_id` = 5 WHERE `unit_type_id` = 11;
UPDATE `unit_queue` SET `unit_type_id` = 6 WHERE `unit_type_id` = 12;
UPDATE `unit_queue` SET `unit_type_id` = 7 WHERE `unit_type_id` = 13;
UPDATE `unit_queue` SET `unit_type_id` = 8 WHERE `unit_type_id` = 14;
UPDATE `unit_queue` SET `unit_type_id` = 9 WHERE `unit_type_id` = 15;
UPDATE `unit_queue` SET `unit_type_id` = 10 WHERE `unit_type_id` = 16;

UPDATE `movement_units` SET `unit_type_id` = 5 WHERE `unit_type_id` = 11;
UPDATE `movement_units` SET `unit_type_id` = 6 WHERE `unit_type_id` = 12;
UPDATE `movement_units` SET `unit_type_id` = 7 WHERE `unit_type_id` = 13;
UPDATE `movement_units` SET `unit_type_id` = 8 WHERE `unit_type_id` = 14;
UPDATE `movement_units` SET `unit_type_id` = 9 WHERE `unit_type_id` = 15;
UPDATE `movement_units` SET `unit_type_id` = 10 WHERE `unit_type_id` = 16;

-- Delete orphaned duplicates
DELETE FROM `unit_types` WHERE `id` > 10;
