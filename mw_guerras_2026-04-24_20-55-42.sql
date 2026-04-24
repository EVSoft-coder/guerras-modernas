/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.10-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: mw_guerras
-- ------------------------------------------------------
-- Server version	11.4.10-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `alianca_diplomacia`
--

DROP TABLE IF EXISTS `alianca_diplomacia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `alianca_diplomacia` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `alianca_id` bigint(20) unsigned NOT NULL,
  `target_alianca_id` bigint(20) unsigned NOT NULL,
  `tipo` enum('ALLY','NAP','ENEMY') NOT NULL DEFAULT 'NAP',
  `status` enum('PENDING','ACCEPTED') NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `alianca_id` (`alianca_id`,`target_alianca_id`),
  KEY `target_alianca_id` (`target_alianca_id`),
  CONSTRAINT `alianca_diplomacia_ibfk_1` FOREIGN KEY (`alianca_id`) REFERENCES `aliancas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `alianca_diplomacia_ibfk_2` FOREIGN KEY (`target_alianca_id`) REFERENCES `aliancas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alianca_diplomacia`
--

LOCK TABLES `alianca_diplomacia` WRITE;
/*!40000 ALTER TABLE `alianca_diplomacia` DISABLE KEYS */;
/*!40000 ALTER TABLE `alianca_diplomacia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aliancas`
--

DROP TABLE IF EXISTS `aliancas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aliancas`
--

LOCK TABLES `aliancas` WRITE;
/*!40000 ALTER TABLE `aliancas` DISABLE KEYS */;
/*!40000 ALTER TABLE `aliancas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ataques`
--

DROP TABLE IF EXISTS `ataques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ataques` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `origem_base_id` bigint(20) unsigned NOT NULL,
  `destino_base_id` bigint(20) unsigned NOT NULL,
  `destino_x` int(11) DEFAULT NULL,
  `destino_y` int(11) DEFAULT NULL,
  `tropas` longtext NOT NULL,
  `saque` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`saque`)),
  `tipo` enum('saque','conquista','reforco','espionagem') NOT NULL DEFAULT 'saque',
  `chegada_em` timestamp NOT NULL,
  `processado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ataques_ibfk_1` (`origem_base_id`),
  KEY `ataques_ibfk_2` (`destino_base_id`),
  CONSTRAINT `ataques_ibfk_1` FOREIGN KEY (`origem_base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ataques_ibfk_2` FOREIGN KEY (`destino_base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ataques`
--

LOCK TABLES `ataques` WRITE;
/*!40000 ALTER TABLE `ataques` DISABLE KEYS */;
INSERT INTO `ataques` VALUES
(1,1,4,593,694,'{\"agente_espiao\":10,\"blindado_apc\":0,\"helicoptero_ataque\":0,\"infantaria\":0,\"tanque_combate\":0}',NULL,'espionagem','2026-04-16 19:42:57',0,'2026-04-16 19:40:55','2026-04-16 19:40:55');
/*!40000 ALTER TABLE `ataques` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bases`
--

DROP TABLE IF EXISTS `bases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `bases` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `jogador_id` bigint(20) unsigned DEFAULT NULL,
  `nome` varchar(100) NOT NULL DEFAULT 'Base Principal',
  `coordenada_x` int(11) NOT NULL,
  `coordenada_y` int(11) NOT NULL,
  `qg_nivel` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `muralha_nivel` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `ultimo_update` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_protected` tinyint(1) NOT NULL DEFAULT 0,
  `protection_until` timestamp NULL DEFAULT NULL,
  `loyalty` int(11) DEFAULT 100,
  `recursos_metal` decimal(20,2) NOT NULL DEFAULT 1000.00,
  `recursos_energia` decimal(20,2) NOT NULL DEFAULT 1000.00,
  `recursos_comida` decimal(20,2) NOT NULL DEFAULT 1000.00,
  `last_update_at` timestamp NULL DEFAULT current_timestamp(),
  `x` int(11) DEFAULT 0,
  `y` int(11) DEFAULT 0,
  `loyalty_updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `bases_coordenadas_unique` (`coordenada_x`,`coordenada_y`),
  UNIQUE KEY `unique_coordinates` (`x`,`y`),
  KEY `jogador_id` (`jogador_id`),
  CONSTRAINT `bases_ibfk_1` FOREIGN KEY (`jogador_id`) REFERENCES `jogadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bases`
--

LOCK TABLES `bases` WRITE;
/*!40000 ALTER TABLE `bases` DISABLE KEYS */;
INSERT INTO `bases` VALUES
(1,1,'Base Principal',111,608,11,7,'2026-04-23 19:45:04','2026-04-07 20:55:47','2026-04-23 19:45:04',0,NULL,100,0.00,0.00,0.00,'2026-04-14 21:28:00',94,944,'2026-04-18 11:27:08'),
(2,2,'Base Principal',193,662,1,1,'2026-04-11 08:49:37','2026-04-11 07:49:37','2026-04-17 19:14:04',0,NULL,100,0.00,0.00,2801.00,'2026-04-11 08:49:37',442,375,'2026-04-18 11:27:08'),
(3,3,'Base Principal',743,246,1,1,'2026-04-11 08:51:28','2026-04-11 07:51:28','2026-04-17 19:14:04',0,NULL,100,0.00,0.00,2796.00,'2026-04-11 08:51:28',551,629,'2026-04-18 11:27:08'),
(4,4,'Base Principal',593,694,1,1,'2026-04-11 08:59:45','2026-04-11 07:59:45','2026-04-17 19:14:04',0,NULL,100,0.00,0.00,1500.00,'2026-04-11 08:59:45',492,572,'2026-04-18 11:27:08'),
(5,5,'Base Principal',477,513,1,1,'2026-04-11 09:03:36','2026-04-11 08:03:36','2026-04-17 19:14:04',0,NULL,100,0.00,0.00,2823.00,'2026-04-11 09:03:36',388,223,'2026-04-18 11:27:08'),
(6,6,'Base Principal',447,634,1,1,'2026-04-11 09:10:06','2026-04-11 08:10:06','2026-04-17 19:14:04',0,NULL,100,0.00,0.00,2766.00,'2026-04-11 09:10:06',952,92,'2026-04-18 11:27:08'),
(7,NULL,'Reduto Insurgente A',108,613,2,1,'2026-04-14 22:46:23','2026-04-14 21:46:23','2026-04-17 19:14:04',0,NULL,100,1000.00,1000.00,1000.00,'2026-04-14 22:46:23',605,750,'2026-04-18 11:27:08'),
(8,NULL,'Reduto Insurgente B',111,613,2,2,'2026-04-14 22:46:23','2026-04-14 21:46:23','2026-04-17 19:14:04',0,NULL,100,1000.00,1000.00,1000.00,'2026-04-14 22:46:23',935,427,'2026-04-18 11:27:08'),
(9,NULL,'Reduto Insurgente C',106,603,3,1,'2026-04-14 22:46:23','2026-04-14 21:46:23','2026-04-17 19:14:04',0,NULL,100,1000.00,1000.00,1000.00,'2026-04-14 22:46:23',328,361,'2026-04-18 11:27:08'),
(10,NULL,'Reduto Insurgente D',116,613,1,2,'2026-04-14 22:46:23','2026-04-14 21:46:23','2026-04-17 19:14:04',0,NULL,100,1000.00,1000.00,1000.00,'2026-04-14 22:46:23',820,20,'2026-04-18 11:27:08'),
(11,NULL,'Reduto Insurgente E',112,612,5,1,'2026-04-14 22:46:23','2026-04-14 21:46:23','2026-04-17 19:14:04',0,NULL,100,1000.00,1000.00,1000.00,'2026-04-14 22:46:23',641,144,'2026-04-18 11:27:08');
/*!40000 ALTER TABLE `bases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_queue`
--

DROP TABLE IF EXISTS `building_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `building_queue` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `position` int(11) DEFAULT 1,
  `base_id` bigint(20) unsigned NOT NULL,
  `building_id` bigint(20) unsigned DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `target_level` int(11) NOT NULL,
  `duration` int(11) DEFAULT 0,
  `status` varchar(20) DEFAULT 'pending',
  `started_at` timestamp NULL DEFAULT NULL,
  `finishes_at` timestamp NOT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `cost_suprimentos` int(11) DEFAULT 0,
  `cost_combustivel` int(11) DEFAULT 0,
  `cost_municoes` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_base_position` (`base_id`,`position`),
  KEY `idx_queue_pos` (`base_id`,`position`),
  CONSTRAINT `building_queue_base_id_foreign` FOREIGN KEY (`base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_queue`
--

LOCK TABLES `building_queue` WRITE;
/*!40000 ALTER TABLE `building_queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `building_queue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_types`
--

DROP TABLE IF EXISTS `building_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `building_types` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `base_production` int(11) DEFAULT 0,
  `production_type` varchar(50) DEFAULT NULL,
  `base_build_time` int(11) DEFAULT 60,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_types`
--

LOCK TABLES `building_types` WRITE;
/*!40000 ALTER TABLE `building_types` DISABLE KEYS */;
INSERT INTO `building_types` VALUES
(1,'quartel_general',0,NULL,120,'2026-04-17 12:59:20','2026-04-22 20:47:26'),
(2,'mina_de_suprimentos',10,'suprimentos',60,'2026-04-17 12:59:20','2026-04-22 20:47:26'),
(3,'refinaria_de_combustível',8,'combustivel',80,'2026-04-17 12:59:20','2026-04-22 20:47:26'),
(4,'fábrica_de_munições',12,'municoes',90,'2026-04-17 12:59:20','2026-04-22 20:47:26'),
(5,'mina_de_metal',15,'metal',100,'2026-04-17 12:59:20','2026-04-22 20:47:26'),
(6,'central_de_energia',20,'energia',70,'2026-04-17 12:59:20','2026-04-22 20:47:26'),
(7,'posto_de_recrutamento',5,'pessoal',50,'2026-04-17 12:59:20','2026-04-22 20:47:26'),
(8,'quartel',0,NULL,120,'2026-04-17 12:59:20','2026-04-22 20:47:26'),
(9,'perímetro_defensivo',0,NULL,150,'2026-04-17 12:59:20','2026-04-22 20:47:26'),
(10,'plataforma_habitacional',0,NULL,45,'2026-04-17 12:59:20','2026-04-22 20:47:26');
/*!40000 ALTER TABLE `building_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `construcaos`
--

DROP TABLE IF EXISTS `construcaos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `construcaos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `base_id` bigint(20) unsigned NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `concluido_em` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `construcaos_base_id_foreign` (`base_id`),
  CONSTRAINT `construcaos_base_id_foreign` FOREIGN KEY (`base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `construcaos`
--

LOCK TABLES `construcaos` WRITE;
/*!40000 ALTER TABLE `construcaos` DISABLE KEYS */;
/*!40000 ALTER TABLE `construcaos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `construcoes`
--

DROP TABLE IF EXISTS `construcoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `construcoes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `base_id` bigint(20) unsigned NOT NULL,
  `edificio_tipo` varchar(50) NOT NULL,
  `nivel_destino` int(11) NOT NULL,
  `completado_em` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `construcoes_ibfk_1` (`base_id`),
  CONSTRAINT `construcoes_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `construcoes`
--

LOCK TABLES `construcoes` WRITE;
/*!40000 ALTER TABLE `construcoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `construcoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `edificios`
--

DROP TABLE IF EXISTS `edificios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `edificios` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `base_id` bigint(20) unsigned NOT NULL,
  `building_type_id` bigint(20) unsigned DEFAULT NULL,
  `tipo` varchar(50) NOT NULL,
  `nivel` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `pos_x` int(11) NOT NULL,
  `pos_y` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `edificios_base_tipo_unique` (`base_id`,`tipo`),
  KEY `fk_edificios_building_type` (`building_type_id`),
  CONSTRAINT `edificios_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_edificios_building_type` FOREIGN KEY (`building_type_id`) REFERENCES `building_types` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `edificios`
--

LOCK TABLES `edificios` WRITE;
/*!40000 ALTER TABLE `edificios` DISABLE KEYS */;
INSERT INTO `edificios` VALUES
(1,1,1,'hq',1,'2026-04-07 20:55:47','2026-04-22 20:47:26',1,0),
(2,1,8,'quartel',7,'2026-04-07 20:55:47','2026-04-22 20:47:26',2,0),
(3,1,9,'muralha',1,'2026-04-07 20:55:47','2026-04-22 20:47:26',3,0),
(4,1,2,'mina_suprimentos',10,'2026-04-07 21:00:08','2026-04-18 08:38:23',0,1),
(5,1,3,'refinaria',6,'2026-04-07 21:05:56','2026-04-18 08:29:23',1,1),
(6,1,4,'fabrica_municoes',5,'2026-04-07 21:13:22','2026-04-17 19:17:04',2,1),
(7,1,7,'posto_recrutamento',8,'2026-04-07 21:14:03','2026-04-17 21:48:07',3,1),
(8,1,NULL,'radar_estrategico',4,'2026-04-09 22:27:04','2026-04-15 21:17:18',0,2),
(9,1,NULL,'aerodromo',5,'2026-04-10 05:38:18','2026-04-17 21:48:58',1,2),
(10,2,2,'mina_suprimentos',1,'2026-04-11 07:49:37','2026-04-17 19:17:04',0,0),
(11,2,8,'quartel',1,'2026-04-11 07:49:37','2026-04-17 19:17:04',0,0),
(12,2,7,'posto_recrutamento',1,'2026-04-11 07:49:37','2026-04-17 19:17:04',0,0),
(13,3,2,'mina_suprimentos',1,'2026-04-11 07:51:28','2026-04-17 19:17:04',0,0),
(14,3,8,'quartel',1,'2026-04-11 07:51:28','2026-04-17 19:17:04',0,0),
(15,3,7,'posto_recrutamento',1,'2026-04-11 07:51:28','2026-04-17 19:17:04',0,0),
(16,4,2,'mina_suprimentos',1,'2026-04-11 07:59:45','2026-04-17 19:17:04',0,0),
(17,4,8,'quartel',1,'2026-04-11 07:59:45','2026-04-17 19:17:04',0,0),
(18,4,7,'posto_recrutamento',1,'2026-04-11 07:59:45','2026-04-17 19:17:04',0,0),
(19,5,2,'mina_suprimentos',1,'2026-04-11 08:03:36','2026-04-17 19:17:04',0,0),
(20,5,8,'quartel',1,'2026-04-11 08:03:36','2026-04-17 19:17:04',0,0),
(21,5,7,'posto_recrutamento',1,'2026-04-11 08:03:36','2026-04-17 19:17:04',0,0),
(22,6,2,'mina_suprimentos',1,'2026-04-11 08:10:06','2026-04-17 19:17:04',0,0),
(23,6,8,'quartel',1,'2026-04-11 08:10:06','2026-04-17 19:17:04',0,0),
(24,6,7,'posto_recrutamento',1,'2026-04-11 08:10:06','2026-04-17 19:17:04',0,0),
(25,1,5,'mina_metal',6,'2026-04-13 21:40:57','2026-04-17 21:50:01',1,6),
(26,1,10,'housing',13,'2026-04-13 21:54:09','2026-04-17 19:17:04',2,6),
(27,1,6,'central_energia',6,'2026-04-13 22:02:06','2026-04-20 11:17:01',3,6),
(28,1,NULL,'centro_pesquisa',1,'2026-04-18 10:52:09','2026-04-18 10:52:09',0,0),
(29,2,NULL,'hq',1,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,300),
(30,2,NULL,'muralha',1,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,530),
(31,3,NULL,'hq',1,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,300),
(32,3,NULL,'muralha',1,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,530),
(33,4,NULL,'hq',1,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,300),
(34,4,NULL,'muralha',1,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,530),
(35,5,NULL,'hq',1,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,300),
(36,5,NULL,'muralha',1,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,530),
(37,6,NULL,'hq',1,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,300),
(38,6,NULL,'muralha',1,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,530),
(39,7,NULL,'hq',2,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,300),
(40,7,NULL,'muralha',1,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,530),
(41,8,NULL,'hq',2,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,300),
(42,8,NULL,'muralha',2,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,530),
(43,9,NULL,'hq',3,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,300),
(44,9,NULL,'muralha',1,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,530),
(45,10,NULL,'hq',1,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,300),
(46,10,NULL,'muralha',2,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,530),
(47,11,NULL,'hq',5,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,300),
(48,11,NULL,'muralha',1,'2026-04-22 20:56:26','2026-04-22 20:56:26',400,530);
/*!40000 ALTER TABLE `edificios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos_mundo`
--

DROP TABLE IF EXISTS `eventos_mundo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos_mundo` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `dados` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados`)),
  `expira_em` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos_mundo`
--

LOCK TABLES `eventos_mundo` WRITE;
/*!40000 ALTER TABLE `eventos_mundo` DISABLE KEYS */;
/*!40000 ALTER TABLE `eventos_mundo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES
(1,'default','{\"uuid\":\"23b35914-bffd-4dba-866e-95e49a8311f6\",\"displayName\":\"App\\\\Events\\\\BaseUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:22:\\\"App\\\\Events\\\\BaseUpdated\\\":1:{s:4:\\\"base\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\Base\\\";s:2:\\\"id\\\";i:1;s:9:\\\"relations\\\";a:5:{i:0;s:8:\\\"recursos\\\";i:1;s:9:\\\"edificios\\\";i:2;s:11:\\\"construcoes\\\";i:3;s:7:\\\"treinos\\\";i:4;s:6:\\\"tropas\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\",\"batchId\":null},\"createdAt\":1776013787,\"delay\":null}',0,NULL,1776013787,1776013787),
(2,'default','{\"uuid\":\"8630a93c-ee13-443f-8ffb-234fa6e52122\",\"displayName\":\"App\\\\Events\\\\BaseUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:22:\\\"App\\\\Events\\\\BaseUpdated\\\":1:{s:4:\\\"base\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\Base\\\";s:2:\\\"id\\\";i:1;s:9:\\\"relations\\\";a:5:{i:0;s:8:\\\"recursos\\\";i:1;s:9:\\\"edificios\\\";i:2;s:11:\\\"construcoes\\\";i:3;s:7:\\\"treinos\\\";i:4;s:6:\\\"tropas\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\",\"batchId\":null},\"createdAt\":1776013809,\"delay\":null}',0,NULL,1776013809,1776013809);
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jogadores`
--

DROP TABLE IF EXISTS `jogadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `xp` bigint(20) DEFAULT 0,
  `nivel` int(11) DEFAULT 1,
  `cargo` varchar(255) DEFAULT 'Recruta',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `alianca_id` (`alianca_id`),
  CONSTRAINT `jogadores_ibfk_1` FOREIGN KEY (`alianca_id`) REFERENCES `aliancas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jogadores`
--

LOCK TABLES `jogadores` WRITE;
/*!40000 ALTER TABLE `jogadores` DISABLE KEYS */;
INSERT INTO `jogadores` VALUES
(1,'admin','fotoamadorblog@gmail.com','$2y$12$UVRX7ov3VcNQB44VUpizf.uO1SVD2hQhyDwq9vdhKmKgignpbuPQq',NULL,NULL,NULL,'2026-04-07 20:55:47','2026-04-10 21:24:33',306,1,'Recruta'),
(2,'test_officer','test_officer@evsoft.pt','$2y$12$NO9jmaZ8ZuFeDc7MpQ3Y..xtHAei3x/BwklYcWyZVBTehltTTMtdO',NULL,NULL,NULL,'2026-04-11 07:49:37','2026-04-11 07:49:37',0,1,'Recruta'),
(3,'test_target','test_target@evsoft.pt','$2y$12$7gHmA.kak8VCCvMkdQvOGOPSyXqw5gqZhao2.7IZ1fvoLfjzXawfG',NULL,NULL,NULL,'2026-04-11 07:51:28','2026-04-11 07:51:28',0,1,'Recruta'),
(4,'test_target_6','test_target_6@evsoft.pt','$2y$12$iMHEVfCEudQ1QNcfhgzipuaKB8RUgHDTCwLiSTubYhRmGYYKTeRKe',NULL,NULL,NULL,'2026-04-11 07:59:45','2026-04-11 07:59:45',0,1,'Recruta'),
(5,'TestOfficer99','test_officer_99@evsoft.pt','$2y$12$uyhtFWHoWxaARDJF1fcSAODFbHX3TCF.AVA42uWGclCGKYOLQYxpW',NULL,NULL,NULL,'2026-04-11 08:03:36','2026-04-11 08:03:36',0,1,'Recruta'),
(6,'TestOfficerV2','test_officer_v2@evsoft.pt','$2y$12$F7MqbEByOMagyW.P3fk8hOQ6DCkoa/0wbwEnpXCN835WpF7J.q9Hm',NULL,NULL,NULL,'2026-04-11 08:10:06','2026-04-11 08:10:06',0,1,'Recruta');
/*!40000 ALTER TABLE `jogadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensagem_aliancas`
--

DROP TABLE IF EXISTS `mensagem_aliancas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensagem_aliancas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `alianca_id` bigint(20) unsigned NOT NULL,
  `jogador_id` bigint(20) unsigned NOT NULL,
  `mensagem` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mensagem_aliancas_alianca_id_foreign` (`alianca_id`),
  KEY `mensagem_aliancas_jogador_id_foreign` (`jogador_id`),
  CONSTRAINT `mensagem_aliancas_alianca_id_foreign` FOREIGN KEY (`alianca_id`) REFERENCES `aliancas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `mensagem_aliancas_jogador_id_foreign` FOREIGN KEY (`jogador_id`) REFERENCES `jogadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensagem_aliancas`
--

LOCK TABLES `mensagem_aliancas` WRITE;
/*!40000 ALTER TABLE `mensagem_aliancas` DISABLE KEYS */;
/*!40000 ALTER TABLE `mensagem_aliancas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(1,'0001_01_01_000001_create_cache_table',1),
(2,'0001_01_01_000002_create_jobs_table',1),
(3,'2026_04_07_201100_create_bases_table',2),
(4,'2026_04_07_201100_create_jogadores_table',2),
(5,'2026_04_07_201101_create_edificios_table',2),
(6,'2026_04_07_201101_create_recursos_table',2),
(7,'2026_04_07_201102_create_ataques_table',2),
(8,'2026_04_07_201102_create_tropas_table',2),
(9,'2026_04_07_201837_create_construcaos_table',2),
(10,'2026_04_07_202220_create_treinos_table',2),
(11,'2026_04_07_202841_create_relatorios_table',2),
(12,'2026_04_07_213932_create_aliancas_table',2),
(13,'2026_04_08_063612_create_mensagem_aliancas_table',2),
(14,'2026_04_08_215458_create_eventos_mundo_table',2),
(15,'2026_04_08_230231_add_xp_to_jogadores_table',3),
(16,'2026_04_09_195101_create_pesquisas_table',3),
(17,'2026_04_11_185928_add_coords_to_ataques_table',3),
(18,'2026_04_11_190918_add_saque_to_ataques_table',3),
(19,'2026_04_12_162848_add_specialized_resources_to_recursos_table',4),
(20,'2026_04_12_163317_create_pedido_aliancas_table',4),
(21,'2026_04_12_215752_add_protection_to_bases_table',5),
(22,'2026_04_12_222029_add_cap_to_recursos_table',5),
(23,'2026_04_13_231303_rename_complexo_residencial_to_housing_in_tables',6),
(24,'2026_04_13_232148_rename_production_buildings_to_new_standard',7),
(25,'2026_04_14_210423_add_resource_calculation_fields_to_bases_table',9),
(26,'2026_04_14_200436_add_resource_calculation_fields_to_bases_table',10),
(27,'2026_04_15_212112_add_unique_base_id_to_recursos_table',11),
(28,'2026_04_15_224032_change_resource_columns_to_double',12),
(29,'2026_04_16_204637_create_building_queue_table',13),
(30,'2026_04_16_215446_add_unique_base_id_to_building_queue_table',14),
(31,'2026_04_16_220135_add_building_id_to_building_queue_table',15),
(32,'2026_04_16_224118_create_unit_system_tables',16),
(33,'2026_04_17_124453_fase_avancada_normalizacao_engine',16),
(34,'2026_04_17_131254_create_movements_table',16),
(35,'2026_04_17_134342_harden_movement_system',16),
(36,'2026_04_17_135801_add_loot_to_movements_table',16),
(37,'2026_04_17_140532_enable_conquest_system',16),
(38,'2026_04_18_103300_harden_queues_system',16),
(39,'2026_04_18_143545_repair_unit_types_building_assignment',16),
(40,'2026_04_22_195035_create_sessions_table',16);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movement_units`
--

DROP TABLE IF EXISTS `movement_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `movement_units` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `movement_id` bigint(20) unsigned NOT NULL,
  `unit_type_id` bigint(20) unsigned NOT NULL,
  `quantity` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `movement_id` (`movement_id`),
  KEY `unit_type_id` (`unit_type_id`),
  CONSTRAINT `movement_units_ibfk_1` FOREIGN KEY (`movement_id`) REFERENCES `movements` (`id`) ON DELETE CASCADE,
  CONSTRAINT `movement_units_ibfk_2` FOREIGN KEY (`unit_type_id`) REFERENCES `unit_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movement_units`
--

LOCK TABLES `movement_units` WRITE;
/*!40000 ALTER TABLE `movement_units` DISABLE KEYS */;
/*!40000 ALTER TABLE `movement_units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movements`
--

DROP TABLE IF EXISTS `movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `movements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `origin_id` bigint(20) unsigned NOT NULL,
  `target_id` bigint(20) unsigned NOT NULL,
  `departure_time` timestamp NOT NULL,
  `arrival_time` timestamp NOT NULL,
  `return_time` timestamp NULL DEFAULT NULL,
  `status` varchar(20) DEFAULT 'moving',
  `processed_at` timestamp NULL DEFAULT NULL,
  `type` varchar(20) DEFAULT 'attack',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `loot_suprimentos` decimal(20,2) DEFAULT 0.00,
  `loot_combustivel` decimal(20,2) DEFAULT 0.00,
  `loot_municoes` decimal(20,2) DEFAULT 0.00,
  `loot_metal` decimal(20,2) DEFAULT 0.00,
  `loot_energia` decimal(20,2) DEFAULT 0.00,
  `loot_pessoal` decimal(20,2) DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `fk_movements_origin` (`origin_id`),
  KEY `fk_movements_target` (`target_id`),
  KEY `idx_movements_arrival_status` (`arrival_time`,`status`),
  CONSTRAINT `fk_movements_origin` FOREIGN KEY (`origin_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_movements_target` FOREIGN KEY (`target_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movements`
--

LOCK TABLES `movements` WRITE;
/*!40000 ALTER TABLE `movements` DISABLE KEYS */;
/*!40000 ALTER TABLE `movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_aliancas`
--

DROP TABLE IF EXISTS `pedido_aliancas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_aliancas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `jogador_id` bigint(20) unsigned NOT NULL,
  `alianca_id` bigint(20) unsigned NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pendente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_aliancas_jogador_id_foreign` (`jogador_id`),
  KEY `pedido_aliancas_alianca_id_foreign` (`alianca_id`),
  CONSTRAINT `pedido_aliancas_alianca_id_foreign` FOREIGN KEY (`alianca_id`) REFERENCES `aliancas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pedido_aliancas_jogador_id_foreign` FOREIGN KEY (`jogador_id`) REFERENCES `jogadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_aliancas`
--

LOCK TABLES `pedido_aliancas` WRITE;
/*!40000 ALTER TABLE `pedido_aliancas` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido_aliancas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos_alianca`
--

DROP TABLE IF EXISTS `pedidos_alianca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos_alianca` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `jogador_id` bigint(20) unsigned DEFAULT NULL,
  `alianca_id` bigint(20) unsigned DEFAULT NULL,
  `status` enum('pendente','aceite','recusado') DEFAULT 'pendente',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos_alianca`
--

LOCK TABLES `pedidos_alianca` WRITE;
/*!40000 ALTER TABLE `pedidos_alianca` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos_alianca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pesquisas`
--

DROP TABLE IF EXISTS `pesquisas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pesquisas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `jogador_id` bigint(20) unsigned DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `nivel` int(11) DEFAULT 0,
  `completado_em` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pesquisas`
--

LOCK TABLES `pesquisas` WRITE;
/*!40000 ALTER TABLE `pesquisas` DISABLE KEYS */;
/*!40000 ALTER TABLE `pesquisas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recursos`
--

DROP TABLE IF EXISTS `recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `base_id` bigint(20) unsigned NOT NULL,
  `suprimentos` double NOT NULL DEFAULT 0,
  `combustivel` double NOT NULL DEFAULT 0,
  `municoes` double NOT NULL DEFAULT 0,
  `pessoal` double NOT NULL DEFAULT 0,
  `metal` double NOT NULL DEFAULT 0,
  `energia` double NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp(),
  `storage_capacity` int(11) DEFAULT 10000,
  PRIMARY KEY (`id`),
  UNIQUE KEY `base_id_2` (`base_id`),
  UNIQUE KEY `recursos_base_id_unique` (`base_id`),
  KEY `base_id` (`base_id`),
  CONSTRAINT `recursos_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recursos`
--

LOCK TABLES `recursos` WRITE;
/*!40000 ALTER TABLE `recursos` DISABLE KEYS */;
INSERT INTO `recursos` VALUES
(1,1,1000,1000,1000,1000,1000,1000,'2026-04-07 20:55:47','2026-04-23 19:45:04','2026-04-15 20:58:21',1000),
(3,2,2801,1416,1112,1120,0,0,'2026-04-11 07:49:37','2026-04-11 08:52:04','2026-04-15 20:58:21',10000),
(4,3,2796,1415,1111,1118,0,0,'2026-04-11 07:51:28','2026-04-11 08:53:41','2026-04-15 20:58:21',10000),
(5,4,1500,1000,800,600,0,0,'2026-04-11 07:59:45','2026-04-11 07:59:45','2026-04-15 20:58:21',10000),
(6,5,2823,1423,1117,1129,0,0,'2026-04-11 08:03:36','2026-04-11 09:07:04','2026-04-15 20:58:21',10000),
(7,6,2766,1405,1104,1106,0,0,'2026-04-11 08:10:06','2026-04-11 09:10:52','2026-04-15 20:58:21',10000),
(8,7,5000,5000,5000,1000,0,0,'2026-04-14 21:46:23','2026-04-14 21:46:23','2026-04-15 20:58:21',10000),
(9,8,5000,5000,5000,1000,0,0,'2026-04-14 21:46:23','2026-04-14 21:46:23','2026-04-15 20:58:21',10000),
(10,9,5000,5000,5000,1000,0,0,'2026-04-14 21:46:23','2026-04-14 21:46:23','2026-04-15 20:58:21',10000),
(11,10,5000,5000,5000,1000,0,0,'2026-04-14 21:46:23','2026-04-14 21:46:23','2026-04-15 20:58:21',10000),
(12,11,5000,5000,5000,1000,0,0,'2026-04-14 21:46:23','2026-04-14 21:46:23','2026-04-15 20:58:21',10000);
/*!40000 ALTER TABLE `recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relatorios`
--

DROP TABLE IF EXISTS `relatorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `relatorios` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vencedor_id` bigint(20) unsigned NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `origem_nome` varchar(255) NOT NULL,
  `destino_nome` varchar(255) NOT NULL,
  `detalhes` longtext DEFAULT NULL,
  `atacante_id` bigint(20) unsigned NOT NULL,
  `defensor_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `relatorios_ibfk_1` (`vencedor_id`),
  CONSTRAINT `relatorios_ibfk_1` FOREIGN KEY (`vencedor_id`) REFERENCES `jogadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relatorios`
--

LOCK TABLES `relatorios` WRITE;
/*!40000 ALTER TABLE `relatorios` DISABLE KEYS */;
/*!40000 ALTER TABLE `relatorios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES
('BCZAGEcuc20HiYUuYf3Rz8pEkjw3zX8UyUWcRkQc',1,'213.22.106.248','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','YTo2OntzOjY6Il90b2tlbiI7czo0MDoibTZyeFoyQlB4MnZ5S3E2VVA1Qm9zaERPd3lyN3J4Z2NaZXRSaEs1VyI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjI6e3M6MzoidXJsIjtzOjQxOiJodHRwczovL213LmV2c29mdC5jc21hbmFnZXIub3ZoL2Rhc2hib2FyZCI7czo1OiJyb3V0ZSI7czo5OiJkYXNoYm9hcmQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO3M6MTY6InNlbGVjdGVkX2Jhc2VfaWQiO2k6MTt9',1776978317),
('bUuB6VVu0GuUj0OUY1XsQ1mlEh8FMOLGuZPG4sAr',NULL,'63.35.178.161','Plesk screenshot bot https://support.plesk.com/hc/en-us/articles/10301006946066','YTo0OntzOjY6Il90b2tlbiI7czo0MDoieVBwOVVzOU90T1lRZDdEWmp2elRGZE15QWJUQk1NbnpiMjcwc25wNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHBzOi8vbXcuZXZzb2Z0LmNzbWFuYWdlci5vdmgvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjM6InVybCI7YToxOntzOjg6ImludGVuZGVkIjtzOjQxOiJodHRwczovL213LmV2c29mdC5jc21hbmFnZXIub3ZoL2Rhc2hib2FyZCI7fX0=',1777054141),
('jmo4rbIlFJRxkqFX9d4vC4RvvBGOj7hYJTj9Yy4L',1,'213.22.106.248','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','YTo2OntzOjY6Il90b2tlbiI7czo0MDoiQjVaOVBIMFRlZUxLZExBOThKVGRRcDc0YWFZeVNkYTVrdEFBazFHOCI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjI6e3M6MzoidXJsIjtzOjQxOiJodHRwczovL213LmV2c29mdC5jc21hbmFnZXIub3ZoL2Rhc2hib2FyZCI7czo1OiJyb3V0ZSI7czo5OiJkYXNoYm9hcmQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO3M6MTY6InNlbGVjdGVkX2Jhc2VfaWQiO2k6MTt9',1776979255),
('vVYLGxM1vtaGfguFPzgvYgyl1sBTUub6swxokaLS',NULL,'3.248.193.219','Plesk screenshot bot https://support.plesk.com/hc/en-us/articles/10301006946066','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiSENiY09pWjNCYjg4M1BEY1VYOHc3T2tGZmppU25kVkxSZGlsdENMaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHBzOi8vbXcuZXZzb2Z0LmNzbWFuYWdlci5vdmgvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjM6InVybCI7YToxOntzOjg6ImludGVuZGVkIjtzOjQxOiJodHRwczovL213LmV2c29mdC5jc21hbmFnZXIub3ZoL2Rhc2hib2FyZCI7fX0=',1776975669);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treinos`
--

DROP TABLE IF EXISTS `treinos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `treinos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `base_id` bigint(20) unsigned NOT NULL,
  `unidade` varchar(50) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `completado_em` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `treinos_ibfk_1` (`base_id`),
  CONSTRAINT `treinos_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treinos`
--

LOCK TABLES `treinos` WRITE;
/*!40000 ALTER TABLE `treinos` DISABLE KEYS */;
/*!40000 ALTER TABLE `treinos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tropas`
--

DROP TABLE IF EXISTS `tropas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tropas`
--

LOCK TABLES `tropas` WRITE;
/*!40000 ALTER TABLE `tropas` DISABLE KEYS */;
INSERT INTO `tropas` VALUES
(1,1,'infantaria',130,'2026-04-09 22:25:56','2026-04-22 11:32:50'),
(2,1,'blindado_apc',20,'2026-04-10 05:41:32','2026-04-11 11:49:57'),
(3,1,'tanque_combate',35,'2026-04-11 10:17:35','2026-04-12 13:50:33'),
(4,1,'agente_espiao',0,'2026-04-11 10:17:47','2026-04-16 19:40:55'),
(5,1,'helicoptero_ataque',43,'2026-04-11 12:21:16','2026-04-12 13:56:23'),
(6,1,'Tanque de Combate (MBT)',17,'2026-04-18 22:23:48','2026-04-22 19:22:51');
/*!40000 ALTER TABLE `tropas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_queue`
--

DROP TABLE IF EXISTS `unit_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit_queue` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `position` int(11) DEFAULT 1,
  `base_id` bigint(20) unsigned NOT NULL,
  `unit_type_id` bigint(20) unsigned NOT NULL,
  `quantity` int(11) NOT NULL,
  `units_produced` int(11) DEFAULT 0,
  `quantity_remaining` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'PENDING',
  `started_at` timestamp NULL DEFAULT NULL,
  `finishes_at` timestamp NOT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `duration_per_unit` int(11) DEFAULT 0,
  `total_duration` int(11) DEFAULT 0,
  `cost_suprimentos` int(11) DEFAULT 0,
  `cost_combustivel` int(11) DEFAULT 0,
  `cost_municoes` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `base_id` (`base_id`),
  KEY `finishes_at` (`finishes_at`),
  KEY `unit_type_id` (`unit_type_id`),
  KEY `idx_unit_queue_pos` (`base_id`,`position`),
  CONSTRAINT `unit_queue_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `unit_queue_ibfk_2` FOREIGN KEY (`unit_type_id`) REFERENCES `unit_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_queue`
--

LOCK TABLES `unit_queue` WRITE;
/*!40000 ALTER TABLE `unit_queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `unit_queue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_types`
--

DROP TABLE IF EXISTS `unit_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit_types` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `attack` int(11) NOT NULL,
  `defense` int(11) NOT NULL,
  `speed` float NOT NULL,
  `carry_capacity` int(11) NOT NULL,
  `cost_suprimentos` int(11) NOT NULL,
  `cost_municoes` int(11) NOT NULL,
  `cost_combustivel` int(11) NOT NULL,
  `build_time` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `building_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_types`
--

LOCK TABLES `unit_types` WRITE;
/*!40000 ALTER TABLE `unit_types` DISABLE KEYS */;
INSERT INTO `unit_types` VALUES
(1,'infantaria',10,15,10,20,100,20,0,30,'2026-04-16 22:51:20','2026-04-22 20:47:26','quartel'),
(2,'veículo_leve_(apc)',20,40,25,100,300,50,100,120,'2026-04-16 22:51:20','2026-04-22 20:47:26','fabrica_municoes'),
(3,'tanque_de_combate_(mbt)',150,100,20,50,800,200,300,600,'2026-04-16 22:51:20','2026-04-22 20:47:26','fabrica_municoes'),
(4,'politico',5,5,1,0,10000,2000,5000,3600,NULL,'2026-04-22 20:47:26','parlamento');
/*!40000 ALTER TABLE `unit_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `units` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `base_id` bigint(20) unsigned NOT NULL,
  `unit_type_id` bigint(20) unsigned NOT NULL,
  `quantity` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `base_id` (`base_id`),
  KEY `unit_type_id` (`unit_type_id`),
  CONSTRAINT `units_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `units_ibfk_2` FOREIGN KEY (`unit_type_id`) REFERENCES `unit_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES
(1,1,1,21,'2026-04-17 19:51:20','2026-04-22 11:32:50'),
(2,1,3,14,'2026-04-17 21:39:55','2026-04-22 19:22:51');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'mw_guerras'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-04-24 20:55:49
