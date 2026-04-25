-- ============================================================
-- GUERRAS MODERNAS — FASE 10: EVENTOS MUNDIAIS
-- Executar no phpMyAdmin
-- Data: 2026-04-25
-- ============================================================

-- Tabela para gerir eventos temporários no servidor (ex: 2x Produção, Treino Rápido)
CREATE TABLE IF NOT EXISTS `eventos_mundo` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `tipo_evento` enum('producao','recrutamento','combate') NOT NULL,
  `multiplicador` decimal(8,2) NOT NULL DEFAULT 1.00,
  `inicia_em` timestamp NULL DEFAULT NULL,
  `termina_em` timestamp NULL DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_evento_ativo_data` (`ativo`, `inicia_em`, `termina_em`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir um evento de exemplo (Fim de Semana de Produção a dobrar)
-- Este evento pode ser ativado/desativado mudando a coluna 'ativo' ou as datas
INSERT INTO `eventos_mundo` (`nome`, `descricao`, `tipo_evento`, `multiplicador`, `inicia_em`, `termina_em`, `ativo`)
VALUES (
    'Boom Económico Global', 
    'A economia global está em alta. Todas as minas e refinarias produzem 50% mais recursos!', 
    'producao', 
    1.50, 
    NOW(), 
    DATE_ADD(NOW(), INTERVAL 2 DAY), 
    1
);
