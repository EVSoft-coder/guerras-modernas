-- MariaDB dump
-- Host: localhost    Database: mw_guerras
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;

-- Table aliancas
DROP TABLE IF EXISTS `aliancas`;
CREATE TABLE `aliancas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `tag` varchar(10) NOT NULL,
  `fundador_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tag` (`tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table jogadores
DROP TABLE IF EXISTS `jogadores`;
CREATE TABLE `jogadores` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `alianca_id` bigint(20) unsigned DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `alianca_id` (`alianca_id`),
  CONSTRAINT `jogadores_ibfk_1` FOREIGN KEY (`alianca_id`) REFERENCES `aliancas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table bases
DROP TABLE IF EXISTS `bases`;
CREATE TABLE `bases` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `jogador_id` bigint(20) unsigned NOT NULL,
  `nome` varchar(100) NOT NULL DEFAULT 'Base Principal',
  `coordenada_x` int(11) NOT NULL,
  `coordenada_y` int(11) NOT NULL,
  `qg_nivel` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `muralha_nivel` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `ultimo_update` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `bases_coordenadas_unique` (`coordenada_x`,`coordenada_y`),
  KEY `jogador_id` (`jogador_id`),
  CONSTRAINT `bases_ibfk_1` FOREIGN KEY (`jogador_id`) REFERENCES `jogadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table recursos
DROP TABLE IF EXISTS `recursos`;
CREATE TABLE `recursos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `base_id` bigint(20) unsigned NOT NULL,
  `suprimentos` bigint(20) unsigned NOT NULL DEFAULT 1000,
  `combustivel` bigint(20) unsigned NOT NULL DEFAULT 800,
  `municoes` bigint(20) unsigned NOT NULL DEFAULT 700,
  `pessoal` int(10) unsigned NOT NULL DEFAULT 500,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `base_id` (`base_id`),
  CONSTRAINT `recursos_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table edificios
DROP TABLE IF EXISTS `edificios`;
CREATE TABLE `edificios` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `base_id` bigint(20) unsigned NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `nivel` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `edificios_base_tipo_unique` (`base_id`,`tipo`),
  CONSTRAINT `edificios_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table tropas
DROP TABLE IF EXISTS `tropas`;
CREATE TABLE `tropas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `base_id` bigint(20) unsigned NOT NULL,
  `unidade` varchar(50) NOT NULL,
  `quantidade` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tropas_base_unidade_unique` (`base_id`,`unidade`),
  CONSTRAINT `tropas_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table ataques
DROP TABLE IF EXISTS `ataques`;
CREATE TABLE `ataques` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `origem_base_id` bigint(20) unsigned NOT NULL,
  `destino_base_id` bigint(20) unsigned NOT NULL,
  `tropas` longtext NOT NULL,
  `tipo` enum('saque','conquista','reforco','espionagem') NOT NULL DEFAULT 'saque',
  `chegada_em` timestamp NOT NULL,
  `processado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  CONSTRAINT `ataques_ibfk_1` FOREIGN KEY (`origem_base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ataques_ibfk_2` FOREIGN KEY (`destino_base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table construcoes
DROP TABLE IF EXISTS `construcoes`;
CREATE TABLE `construcoes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `base_id` bigint(20) unsigned NOT NULL,
  `edificio_tipo` varchar(50) NOT NULL,
  `nivel_destino` int(11) NOT NULL,
  `completado_em` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  CONSTRAINT `construcoes_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table treinos
DROP TABLE IF EXISTS `treinos`;
CREATE TABLE `treinos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `base_id` bigint(20) unsigned NOT NULL,
  `unidade` varchar(50) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `completado_em` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  CONSTRAINT `treinos_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table relatorios
DROP TABLE IF EXISTS `relatorios`;
CREATE TABLE `relatorios` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vencedor_id` bigint(20) unsigned NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `origem_nome` varchar(255) NOT NULL,
  `destino_nome` varchar(255) NOT NULL,
  `detalhes` longtext NOT NULL,
  `atacante_id` bigint(20) unsigned NOT NULL,
  `defensor_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  CONSTRAINT `relatorios_ibfk_1` FOREIGN KEY (`vencedor_id`) REFERENCES `jogadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table pedidos_alianca
DROP TABLE IF EXISTS `pedidos_alianca`;
CREATE TABLE `pedidos_alianca` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `jogador_id` bigint(20) unsigned NOT NULL,
  `alianca_id` bigint(20) unsigned NOT NULL,
  `status` enum('pendente','aprovado','rejeitado') NOT NULL DEFAULT 'pendente',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  CONSTRAINT `pedidos_alianca_ibfk_1` FOREIGN KEY (`jogador_id`) REFERENCES `jogadores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pedidos_alianca_ibfk_2` FOREIGN KEY (`alianca_id`) REFERENCES `aliancas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40014 SET FOREIGN_KEY_CHECKS=1 */;
