-- ============================================================
-- GUERRAS MODERNAS — FASE 11: REFORÇOS ALIADOS
-- Executar no phpMyAdmin
-- Data: 2026-04-25
-- ============================================================

-- Tabela para unidades estacionadas em bases aliadas
CREATE TABLE IF NOT EXISTS `reinforcements` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `origin_base_id` BIGINT UNSIGNED NOT NULL,
    `target_base_id` BIGINT UNSIGNED NOT NULL,
    `unit_type_id` BIGINT UNSIGNED NOT NULL,
    `quantity` INT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    FOREIGN KEY (`origin_base_id`) REFERENCES `bases`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`target_base_id`) REFERENCES `bases`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`unit_type_id`) REFERENCES `unit_types`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adicionar índice para performance de combate
CREATE INDEX idx_reinforcements_target ON reinforcements(target_base_id);
CREATE INDEX idx_reinforcements_origin ON reinforcements(origin_base_id);
