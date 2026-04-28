-- Otimizações e Ajustes para alinhamento com estilo Tribal Wars
-- Criado pela Auditoria - Guerras Modernas

SET @dbname = DATABASE();

-- 1. Otimização de Performance no Mapa
SET @s = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'bases' AND COLUMN_NAME = 'pontos') > 0,
    'SELECT 1',
    'ALTER TABLE `bases` ADD COLUMN `pontos` INT NOT NULL DEFAULT 26'
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE `bases` b
SET b.pontos = (
    SELECT COALESCE(SUM(e.nivel), 0) + CASE WHEN b.jogador_id IS NULL THEN 0 ELSE 10 END
    FROM `edificios` e
    WHERE e.base_id = b.id
) WHERE b.pontos = 26 OR b.pontos IS NULL;

-- 2. Sistema Premium
SET @s = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'jogadores' AND COLUMN_NAME = 'pontos_premium') > 0,
    'SELECT 1',
    'ALTER TABLE `jogadores` ADD COLUMN `pontos_premium` INT NOT NULL DEFAULT 0'
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @s = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'jogadores' AND COLUMN_NAME = 'premium_until') > 0,
    'SELECT 1',
    'ALTER TABLE `jogadores` ADD COLUMN `premium_until` TIMESTAMP NULL DEFAULT NULL'
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. Índices de Performance (Ignorar se já existirem)
-- Nota: MySQL não tem CREATE INDEX IF NOT EXISTS antes da v8.0.12. 
-- Usamos um procedimento para garantir idempotência.

DROP PROCEDURE IF EXISTS AddIndex;
DELIMITER //
CREATE PROCEDURE AddIndex(IN tableName VARCHAR(64), IN indexName VARCHAR(64), IN columnNames VARCHAR(255))
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = tableName AND INDEX_NAME = indexName
    ) THEN
        SET @sql = CONCAT('ALTER TABLE `', tableName, '` ADD INDEX `', indexName, '` (', columnNames, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END //
DELIMITER ;

CALL AddIndex('relatorios', 'idx_partilhado_alianca', '`partilhado_alianca`');
CALL AddIndex('relatorios', 'idx_created_at', '`created_at`');
CALL AddIndex('movements', 'idx_target_arrival', '`target_id`, `arrival_time`');
CALL AddIndex('movements', 'idx_origin_arrival', '`origin_id`, `arrival_time`');

DROP PROCEDURE AddIndex;

-- 4. Timestamp em Pedidos de Aliança
SET @s = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'pedidos_alianca' AND COLUMN_NAME = 'updated_at') > 0,
    'SELECT 1',
    'ALTER TABLE `pedidos_alianca` ADD COLUMN `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. Mecânica de Conquista
SET @s = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'bases' AND COLUMN_NAME = 'loyalty_updated_at') > 0,
    'SELECT 1',
    'ALTER TABLE `bases` ADD COLUMN `loyalty_updated_at` TIMESTAMP NULL DEFAULT NULL'
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 6. Unidades Especiais
INSERT INTO `unit_types` (`name`, `building_type`, `attack`, `defense`, `speed`, `carry_capacity`, `cost_suprimentos`, `cost_municoes`, `cost_combustivel`, `build_time`, `created_at`, `updated_at`)
SELECT 'Oficial de Inteligência', 'hq', 30, 100, 35.0, 0, 40000, 50000, 40000, 10800, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `unit_types` WHERE `name` = 'Oficial de Inteligência')
ON DUPLICATE KEY UPDATE `cost_suprimentos` = 40000;

-- 7. Mercado Premium
CREATE TABLE IF NOT EXISTS `mercado_premium` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `vendedor_id` BIGINT UNSIGNED NOT NULL,
    `recurso_tipo` VARCHAR(20) NOT NULL,
    `quantidade` INT NOT NULL,
    `preco_pp` INT NOT NULL,
    `status` ENUM('open', 'completed', 'cancelled') DEFAULT 'open',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`vendedor_id`) REFERENCES `jogadores`(`id`) ON DELETE CASCADE
);

