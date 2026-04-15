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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ataques`
--

LOCK TABLES `ataques` WRITE;
/*!40000 ALTER TABLE `ataques` DISABLE KEYS */;
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
  `loyalty` int(11) NOT NULL DEFAULT 100,
  `recursos_metal` decimal(20,2) NOT NULL DEFAULT 1000.00,
  `recursos_energia` decimal(20,2) NOT NULL DEFAULT 1000.00,
  `recursos_comida` decimal(20,2) NOT NULL DEFAULT 1000.00,
  `last_update_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `bases_coordenadas_unique` (`coordenada_x`,`coordenada_y`),
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
(1,1,'Base Principal',111,608,11,3,'2026-04-15 19:49:10','2026-04-07 20:55:47','2026-04-15 20:49:10',0,NULL,100,0.00,0.00,0.00,'2026-04-14 21:28:00'),
(2,2,'Base Principal',193,662,1,1,'2026-04-11 08:49:37','2026-04-11 07:49:37','2026-04-14 21:43:40',0,NULL,100,0.00,0.00,2801.00,'2026-04-11 08:49:37'),
(3,3,'Base Principal',743,246,1,1,'2026-04-11 08:51:28','2026-04-11 07:51:28','2026-04-14 21:43:40',0,NULL,100,0.00,0.00,2796.00,'2026-04-11 08:51:28'),
(4,4,'Base Principal',593,694,1,1,'2026-04-11 08:59:45','2026-04-11 07:59:45','2026-04-14 21:43:40',0,NULL,100,0.00,0.00,1500.00,'2026-04-11 08:59:45'),
(5,5,'Base Principal',477,513,1,1,'2026-04-11 09:03:36','2026-04-11 08:03:36','2026-04-14 21:43:40',0,NULL,100,0.00,0.00,2823.00,'2026-04-11 09:03:36'),
(6,6,'Base Principal',447,634,1,1,'2026-04-11 09:10:06','2026-04-11 08:10:06','2026-04-14 21:43:40',0,NULL,100,0.00,0.00,2766.00,'2026-04-11 09:10:06'),
(7,NULL,'Reduto Insurgente A',108,613,2,1,'2026-04-14 22:46:23','2026-04-14 21:46:23','2026-04-14 21:46:23',0,NULL,100,1000.00,1000.00,1000.00,'2026-04-14 22:46:23'),
(8,NULL,'Reduto Insurgente B',111,613,2,2,'2026-04-14 22:46:23','2026-04-14 21:46:23','2026-04-14 21:46:23',0,NULL,100,1000.00,1000.00,1000.00,'2026-04-14 22:46:23'),
(9,NULL,'Reduto Insurgente C',106,603,3,1,'2026-04-14 22:46:23','2026-04-14 21:46:23','2026-04-14 21:46:23',0,NULL,100,1000.00,1000.00,1000.00,'2026-04-14 22:46:23'),
(10,NULL,'Reduto Insurgente D',116,613,1,2,'2026-04-14 22:46:23','2026-04-14 21:46:23','2026-04-14 21:46:23',0,NULL,100,1000.00,1000.00,1000.00,'2026-04-14 22:46:23'),
(11,NULL,'Reduto Insurgente E',112,612,5,1,'2026-04-14 22:46:23','2026-04-14 21:46:23','2026-04-14 21:46:23',0,NULL,100,1000.00,1000.00,1000.00,'2026-04-14 22:46:23');
/*!40000 ALTER TABLE `bases` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `tipo` varchar(50) NOT NULL,
  `nivel` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `pos_x` int(11) NOT NULL,
  `pos_y` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `edificios_base_tipo_unique` (`base_id`,`tipo`),
  CONSTRAINT `edificios_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `bases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `edificios`
--

LOCK TABLES `edificios` WRITE;
/*!40000 ALTER TABLE `edificios` DISABLE KEYS */;
INSERT INTO `edificios` VALUES
(1,1,'QG',1,'2026-04-07 20:55:47','2026-04-07 20:55:47',0,0),
(2,1,'Quartel',5,'2026-04-07 20:55:47','2026-04-12 13:23:33',0,0),
(3,1,'Muralha',1,'2026-04-07 20:55:47','2026-04-07 20:55:47',0,0),
(4,1,'mina_suprimentos',6,'2026-04-07 21:00:08','2026-04-10 05:55:12',0,0),
(5,1,'refinaria',5,'2026-04-07 21:05:56','2026-04-13 21:47:13',0,0),
(6,1,'fabrica_municoes',4,'2026-04-07 21:13:22','2026-04-12 16:09:47',0,0),
(7,1,'posto_recrutamento',3,'2026-04-07 21:14:03','2026-04-12 13:28:29',0,0),
(8,1,'radar_estrategico',4,'2026-04-09 22:27:04','2026-04-12 21:09:54',0,0),
(9,1,'aerodromo',4,'2026-04-10 05:38:18','2026-04-12 13:28:54',0,0),
(10,2,'mina_suprimentos',1,'2026-04-11 07:49:37','2026-04-11 07:49:37',0,0),
(11,2,'quartel',1,'2026-04-11 07:49:37','2026-04-11 07:49:37',0,0),
(12,2,'posto_recrutamento',1,'2026-04-11 07:49:37','2026-04-11 07:49:37',0,0),
(13,3,'mina_suprimentos',1,'2026-04-11 07:51:28','2026-04-11 07:51:28',0,0),
(14,3,'quartel',1,'2026-04-11 07:51:28','2026-04-11 07:51:28',0,0),
(15,3,'posto_recrutamento',1,'2026-04-11 07:51:28','2026-04-11 07:51:28',0,0),
(16,4,'mina_suprimentos',1,'2026-04-11 07:59:45','2026-04-11 07:59:45',0,0),
(17,4,'quartel',1,'2026-04-11 07:59:45','2026-04-11 07:59:45',0,0),
(18,4,'posto_recrutamento',1,'2026-04-11 07:59:45','2026-04-11 07:59:45',0,0),
(19,5,'mina_suprimentos',1,'2026-04-11 08:03:36','2026-04-11 08:03:36',0,0),
(20,5,'quartel',1,'2026-04-11 08:03:36','2026-04-11 08:03:36',0,0),
(21,5,'posto_recrutamento',1,'2026-04-11 08:03:36','2026-04-11 08:03:36',0,0),
(22,6,'mina_suprimentos',1,'2026-04-11 08:10:06','2026-04-11 08:10:06',0,0),
(23,6,'quartel',1,'2026-04-11 08:10:06','2026-04-11 08:10:06',0,0),
(24,6,'posto_recrutamento',1,'2026-04-11 08:10:06','2026-04-11 08:10:06',0,0),
(25,1,'mina_metal',1,'2026-04-13 21:40:57','2026-04-13 23:22:39',0,0),
(26,1,'housing',2,'2026-04-13 21:54:09','2026-04-13 23:17:07',0,0),
(27,1,'central_energia',1,'2026-04-13 22:02:06','2026-04-13 23:22:40',0,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
(26,'2026_04_14_200436_add_resource_calculation_fields_to_bases_table',10);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
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
  `suprimentos` bigint(20) unsigned NOT NULL DEFAULT 1000,
  `combustivel` bigint(20) unsigned NOT NULL DEFAULT 800,
  `municoes` bigint(20) unsigned NOT NULL DEFAULT 700,
  `pessoal` int(10) unsigned NOT NULL DEFAULT 500,
  `metal` bigint(20) unsigned NOT NULL DEFAULT 0,
  `energia` bigint(20) unsigned NOT NULL DEFAULT 0,
  `cap` int(11) NOT NULL DEFAULT 10000,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp(),
  `suprimentos_por_hora` int(11) NOT NULL DEFAULT 0,
  `combustivel_por_hora` int(11) NOT NULL DEFAULT 0,
  `municoes_por_hora` int(11) NOT NULL DEFAULT 0,
  `metal_por_hora` int(11) NOT NULL DEFAULT 0,
  `energia_por_hora` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `base_id_2` (`base_id`),
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
(1,1,0,0,0,28570,0,0,10000,'2026-04-07 20:55:47','2026-04-15 19:49:10','2026-04-15 20:58:21',0,0,0,0,0),
(3,2,2801,1416,1112,1120,0,0,10000,'2026-04-11 07:49:37','2026-04-11 08:52:04','2026-04-15 20:58:21',0,0,0,0,0),
(4,3,2796,1415,1111,1118,0,0,10000,'2026-04-11 07:51:28','2026-04-11 08:53:41','2026-04-15 20:58:21',0,0,0,0,0),
(5,4,1500,1000,800,600,0,0,10000,'2026-04-11 07:59:45','2026-04-11 07:59:45','2026-04-15 20:58:21',0,0,0,0,0),
(6,5,2823,1423,1117,1129,0,0,10000,'2026-04-11 08:03:36','2026-04-11 09:07:04','2026-04-15 20:58:21',0,0,0,0,0),
(7,6,2766,1405,1104,1106,0,0,10000,'2026-04-11 08:10:06','2026-04-11 09:10:52','2026-04-15 20:58:21',0,0,0,0,0),
(8,7,5000,5000,5000,1000,0,0,10000,'2026-04-14 21:46:23','2026-04-14 21:46:23','2026-04-15 20:58:21',0,0,0,0,0),
(9,8,5000,5000,5000,1000,0,0,10000,'2026-04-14 21:46:23','2026-04-14 21:46:23','2026-04-15 20:58:21',0,0,0,0,0),
(10,9,5000,5000,5000,1000,0,0,10000,'2026-04-14 21:46:23','2026-04-14 21:46:23','2026-04-15 20:58:21',0,0,0,0,0),
(11,10,5000,5000,5000,1000,0,0,10000,'2026-04-14 21:46:23','2026-04-14 21:46:23','2026-04-15 20:58:21',0,0,0,0,0),
(12,11,5000,5000,5000,1000,0,0,10000,'2026-04-14 21:46:23','2026-04-14 21:46:23','2026-04-15 20:58:21',0,0,0,0,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tropas`
--

LOCK TABLES `tropas` WRITE;
/*!40000 ALTER TABLE `tropas` DISABLE KEYS */;
INSERT INTO `tropas` VALUES
(1,1,'infantaria',98,'2026-04-09 22:25:56','2026-04-12 21:09:34'),
(2,1,'blindado_apc',20,'2026-04-10 05:41:32','2026-04-11 11:49:57'),
(3,1,'tanque_combate',35,'2026-04-11 10:17:35','2026-04-12 13:50:33'),
(4,1,'agente_espiao',10,'2026-04-11 10:17:47','2026-04-11 10:17:47'),
(5,1,'helicoptero_ataque',43,'2026-04-11 12:21:16','2026-04-12 13:56:23');
/*!40000 ALTER TABLE `tropas` ENABLE KEYS */;
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

-- Dump completed on 2026-04-15 22:12:35
