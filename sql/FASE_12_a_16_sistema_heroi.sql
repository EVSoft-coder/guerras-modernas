-- ============================================================
-- GUERRAS MODERNAS — FASES 12 A 16: SISTEMA DE HERÓI E ALIANÇAS
-- Executar no phpMyAdmin
-- Data: 2026-04-26
-- ============================================================

-- ============================================================
-- FASE 12/13: MOVIMENTOS E CONQUISTA
-- ============================================================

-- Tabela de movimentos militares (Normalizada)
CREATE TABLE IF NOT EXISTS `movements` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `origin_id` BIGINT UNSIGNED NOT NULL,
    `target_id` BIGINT UNSIGNED NOT NULL,
    `departure_time` TIMESTAMP NOT NULL,
    `arrival_time` TIMESTAMP NOT NULL,
    `type` VARCHAR(20) NOT NULL DEFAULT 'attack',
    `status` VARCHAR(20) NOT NULL DEFAULT 'moving',
    `loot_suprimentos` DECIMAL(20, 2) DEFAULT 0,
    `loot_combustivel` DECIMAL(20, 2) DEFAULT 0,
    `loot_municoes` DECIMAL(20, 2) DEFAULT 0,
    `loot_metal` DECIMAL(20, 2) DEFAULT 0,
    `loot_energia` DECIMAL(20, 2) DEFAULT 0,
    `loot_pessoal` DECIMAL(20, 2) DEFAULT 0,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    FOREIGN KEY (`origin_id`) REFERENCES `bases`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`target_id`) REFERENCES `bases`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de unidades em movimento
CREATE TABLE IF NOT EXISTS `movement_units` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `movement_id` BIGINT UNSIGNED NOT NULL,
    `unit_type_id` BIGINT UNSIGNED NOT NULL,
    `quantity` INT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    FOREIGN KEY (`movement_id`) REFERENCES `movements`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`unit_type_id`) REFERENCES `unit_types`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adicionar Fidelidade e Unidade Especial
ALTER TABLE `bases` ADD COLUMN IF NOT EXISTS `loyalty` INT DEFAULT 100;
INSERT IGNORE INTO `unit_types` (name, attack, defense, speed, carry_capacity, cost_suprimentos, cost_municoes, cost_combustivel, build_time) 
VALUES ('Politico', 5, 5, 1.0, 0, 10000, 2000, 5000, 3600);

-- ============================================================
-- FASE 14: MERCADO E TROCAS
-- ============================================================
CREATE TABLE IF NOT EXISTS `market_offers` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `base_id` BIGINT UNSIGNED NOT NULL,
    `offered_resource` VARCHAR(255) NOT NULL,
    `offered_amount` DECIMAL(20, 2) NOT NULL,
    `requested_resource` VARCHAR(255) NOT NULL,
    `requested_amount` DECIMAL(20, 2) NOT NULL,
    `status` VARCHAR(255) DEFAULT 'open',
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    FOREIGN KEY (`base_id`) REFERENCES `bases`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- FASE 15: ALIANÇAS E DIPLOMACIA
-- ============================================================

-- Convites
CREATE TABLE IF NOT EXISTS `convites_alianca` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `alianca_id` BIGINT UNSIGNED NOT NULL,
    `jogador_id` BIGINT UNSIGNED NOT NULL,
    `convidado_por_id` BIGINT UNSIGNED NOT NULL,
    `status` ENUM('pendente', 'aceite', 'rejeitado') DEFAULT 'pendente',
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    FOREIGN KEY (`alianca_id`) REFERENCES `aliancas`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`jogador_id`) REFERENCES `jogadores`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`convidado_por_id`) REFERENCES `jogadores`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Diplomacia
CREATE TABLE IF NOT EXISTS `alianca_diplomacia` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `alianca_id` BIGINT UNSIGNED NOT NULL,
    `alvo_alianca_id` BIGINT UNSIGNED NOT NULL,
    `tipo` ENUM('aliado', 'pna', 'inimigo') NOT NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    FOREIGN KEY (`alianca_id`) REFERENCES `aliancas`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`alvo_alianca_id`) REFERENCES `aliancas`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fórum
CREATE TABLE IF NOT EXISTS `alianca_forum_topicos` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `alianca_id` BIGINT UNSIGNED NOT NULL,
    `jogador_id` BIGINT UNSIGNED NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `last_post_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    FOREIGN KEY (`alianca_id`) REFERENCES `aliancas`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`jogador_id`) REFERENCES `jogadores`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `alianca_forum_posts` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `topico_id` BIGINT UNSIGNED NOT NULL,
    `jogador_id` BIGINT UNSIGNED NOT NULL,
    `conteudo` TEXT NOT NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    FOREIGN KEY (`topico_id`) REFERENCES `alianca_forum_topicos`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`jogador_id`) REFERENCES `jogadores`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Relatórios Partilhados
ALTER TABLE `relatorios` ADD COLUMN IF NOT EXISTS `partilhado_alianca` TINYINT(1) DEFAULT 0 AFTER `detalhes`;
ALTER TABLE `relatorios` ADD COLUMN IF NOT EXISTS `publico` TINYINT(1) DEFAULT 0 AFTER `partilhado_alianca`;

-- ============================================================
-- FASE 16: O GENERAL (SISTEMA DE HERÓI)
-- ============================================================

-- Tabela Principal do General
CREATE TABLE IF NOT EXISTS `generais` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `jogador_id` BIGINT UNSIGNED NOT NULL,
    `nome` VARCHAR(255) DEFAULT 'O General',
    `nivel` INT DEFAULT 1,
    `experiencia` INT DEFAULT 0,
    `pontos_skill` INT DEFAULT 0,
    `estatisticas` JSON NULL,
    `arsenal` JSON NULL,
    `base_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    FOREIGN KEY (`jogador_id`) REFERENCES `jogadores`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`base_id`) REFERENCES `bases`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Árvore de Skills
CREATE TABLE IF NOT EXISTS `general_skills` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `general_id` BIGINT UNSIGNED NOT NULL,
    `skill_slug` VARCHAR(255) NOT NULL,
    `nivel` INT DEFAULT 0,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    FOREIGN KEY (`general_id`) REFERENCES `generais`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vincular General aos Movimentos
ALTER TABLE `movements` ADD COLUMN IF NOT EXISTS `general_id` BIGINT UNSIGNED NULL AFTER `status`;
ALTER TABLE `movements` ADD CONSTRAINT `fk_movements_general` FOREIGN KEY (`general_id`) REFERENCES `generais`(`id`) ON DELETE SET NULL;

-- ============================================================
-- FIM DOS SCRIPTS
-- ============================================================
