CREATE DATABASE  IF NOT EXISTS `springbootdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `springbootdb`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: springbootdb
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `brand`
--

DROP TABLE IF EXISTS `brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brand` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
INSERT INTO `brand` VALUES (1,'Samsung'),(3,'Apple'),(6,'Anker'),(7,'dbrand'),(8,'Bosch'),(9,'Makita'),(10,'DeWalt'),(11,'Asus');
/*!40000 ALTER TABLE `brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brand_category`
--

DROP TABLE IF EXISTS `brand_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brand_category` (
  `brand_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`brand_id`,`category_id`),
  KEY `FKn0e8s5bnd26hjohyh5xurwar2` (`category_id`),
  CONSTRAINT `FKi387ilww5ia7cy23wixj40q1q` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`),
  CONSTRAINT `FKn0e8s5bnd26hjohyh5xurwar2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand_category`
--

LOCK TABLES `brand_category` WRITE;
/*!40000 ALTER TABLE `brand_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `brand_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brand_has_category`
--

DROP TABLE IF EXISTS `brand_has_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brand_has_category` (
  `brand_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`brand_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `brand_has_category_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`),
  CONSTRAINT `brand_has_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand_has_category`
--

LOCK TABLES `brand_has_category` WRITE;
/*!40000 ALTER TABLE `brand_has_category` DISABLE KEYS */;
INSERT INTO `brand_has_category` VALUES (1,1);
/*!40000 ALTER TABLE `brand_has_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Electronics'),(4,'Clothings'),(7,'Construction Tools'),(8,'Foods');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `designation`
--

DROP TABLE IF EXISTS `designation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `designation` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `designation`
--

LOCK TABLES `designation` WRITE;
/*!40000 ALTER TABLE `designation` DISABLE KEYS */;
INSERT INTO `designation` VALUES (1,'Manager'),(2,'Inventory Manager'),(3,'Sales Rep');
/*!40000 ALTER TABLE `designation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_number` varchar(255) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `nic` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `mobilenumber` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `designation_id` int DEFAULT NULL,
  `employeestatus_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_number` (`employee_number`),
  KEY `designation_id` (`designation_id`),
  KEY `employeestatus_id` (`employeestatus_id`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`designation_id`) REFERENCES `designation` (`id`),
  CONSTRAINT `employee_ibfk_2` FOREIGN KEY (`employeestatus_id`) REFERENCES `employeestatus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10002 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'EMP001','Alice Perera','199012345V','Female','1990-03-05','0771234567','alice@example.com',1,1),(2,'EMP002','Bob Silva','198812345V','Male','1988-11-23','0719876543','bob@example.com',2,1),(9999,'EMP9999','Deleted Employee',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`springuser`@`%`*/ /*!50003 TRIGGER `before_employee_delete_sales` BEFORE DELETE ON `employee` FOR EACH ROW BEGIN
    UPDATE sales SET added_user = 9999 WHERE added_user = OLD.id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `employeestatus`
--

DROP TABLE IF EXISTS `employeestatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeestatus` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employeestatus`
--

LOCK TABLES `employeestatus` WRITE;
/*!40000 ALTER TABLE `employeestatus` DISABLE KEYS */;
INSERT INTO `employeestatus` VALUES (1,'Working'),(2,'Resign'),(3,'Temporery Resign');
/*!40000 ALTER TABLE `employeestatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inventorycode` varchar(255) DEFAULT NULL,
  `availableqty` decimal(38,2) DEFAULT NULL,
  `totalqty` decimal(38,2) DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `inventorystatus_id` int DEFAULT NULL,
  `supplier_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`),
  KEY `FK1pa3g0lfv5f7uubo77bw2q9j2` (`inventorystatus_id`),
  KEY `FKe0810rp6mmsbj1f46yhc4h7vb` (`supplier_id`),
  CONSTRAINT `FK1pa3g0lfv5f7uubo77bw2q9j2` FOREIGN KEY (`inventorystatus_id`) REFERENCES `inventorystatus` (`id`),
  CONSTRAINT `FKe0810rp6mmsbj1f46yhc4h7vb` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (6,NULL,4.00,24.00,4,1,NULL),(21,'INV-13-1753373188063',0.00,0.00,9999,1,NULL);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventorystatus`
--

DROP TABLE IF EXISTS `inventorystatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventorystatus` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventorystatus`
--

LOCK TABLES `inventorystatus` WRITE;
/*!40000 ALTER TABLE `inventorystatus` DISABLE KEYS */;
INSERT INTO `inventorystatus` VALUES (1,'In Stock'),(2,'On Hold');
/*!40000 ALTER TABLE `inventorystatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `irnstatus`
--

DROP TABLE IF EXISTS `irnstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `irnstatus` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `irnstatus`
--

LOCK TABLES `irnstatus` WRITE;
/*!40000 ALTER TABLE `irnstatus` DISABLE KEYS */;
INSERT INTO `irnstatus` VALUES (1,'Received'),(2,'Cancelled'),(3,'Damaged');
/*!40000 ALTER TABLE `irnstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `itemcode` varchar(255) DEFAULT NULL,
  `itemname` varchar(255) DEFAULT NULL,
  `itemsize` varchar(255) DEFAULT NULL,
  `rop` int DEFAULT NULL,
  `roq` int DEFAULT NULL,
  `salesprice` decimal(38,2) DEFAULT NULL,
  `purchaseprice` decimal(38,2) DEFAULT NULL,
  `itemstatus_id` int DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `subcategory_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `itemcode` (`itemcode`),
  KEY `itemstatus_id` (`itemstatus_id`),
  KEY `brand_id` (`brand_id`),
  KEY `subcategory_id` (`subcategory_id`),
  CONSTRAINT `item_ibfk_1` FOREIGN KEY (`itemstatus_id`) REFERENCES `itemstatus` (`id`),
  CONSTRAINT `item_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`),
  CONSTRAINT `item_ibfk_3` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategory` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (2,'ITM0002','Anker USB C Fast Charger','0.20',30,150,7500.00,6500.00,1,6,11),(4,'ITM0004','DeWalt Adjustable Wrench','10 Inch',12,50,4100.00,3500.00,1,10,13),(9999,'ITM9999','Deleted Item',NULL,0,0,0.00,0.00,NULL,NULL,NULL);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`springuser`@`%`*/ /*!50003 TRIGGER `before_item_delete_order_detail` BEFORE DELETE ON `item` FOR EACH ROW BEGIN
    UPDATE inventory SET item_id = 9999 WHERE item_id = OLD.id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`springuser`@`%`*/ /*!50003 TRIGGER `before_item_delete_itemreceivenote_has_item` BEFORE DELETE ON `item` FOR EACH ROW BEGIN
    UPDATE itemreceivenote_has_item SET item_id = 9999 WHERE item_id = OLD.id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`springuser`@`%`*/ /*!50003 TRIGGER `before_item_delete_purchaseorder_has_item` BEFORE DELETE ON `item` FOR EACH ROW BEGIN
    UPDATE purchaseorder_has_item SET item_id = 9999 WHERE item_id = OLD.id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`springuser`@`%`*/ /*!50003 TRIGGER `before_item_delete_item_has_sales` BEFORE DELETE ON `item` FOR EACH ROW BEGIN
    UPDATE item_has_sales SET item_id = 9999 WHERE item_id = OLD.id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `item_has_sales`
--

DROP TABLE IF EXISTS `item_has_sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_has_sales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int DEFAULT NULL,
  `sales_id` int DEFAULT NULL,
  `sales_price` decimal(38,2) DEFAULT NULL,
  `quantity` decimal(38,2) DEFAULT NULL,
  `line_price` decimal(38,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`),
  KEY `sales_id` (`sales_id`),
  CONSTRAINT `item_has_sales_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  CONSTRAINT `item_has_sales_ibfk_2` FOREIGN KEY (`sales_id`) REFERENCES `sales` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_has_sales`
--

LOCK TABLES `item_has_sales` WRITE;
/*!40000 ALTER TABLE `item_has_sales` DISABLE KEYS */;
INSERT INTO `item_has_sales` VALUES (14,9999,13,365000.00,1.00,365000.00),(15,9999,14,365000.00,1.00,365000.00),(16,2,15,7500.00,1.00,7500.00),(17,9999,16,365000.00,1.00,365000.00),(18,9999,17,365000.00,1.00,365000.00),(19,9999,18,365000.00,1.00,365000.00),(20,9999,19,365000.00,1.00,365000.00),(21,9999,20,365000.00,1.00,365000.00),(22,9999,21,365000.00,1.00,365000.00),(23,9999,22,365000.00,1.00,365000.00),(24,9999,23,365000.00,1.00,365000.00),(25,9999,24,365000.00,1.00,365000.00),(26,9999,25,365000.00,1.00,365000.00),(27,9999,26,365000.00,1.00,365000.00),(28,9999,27,365000.00,1.00,365000.00),(29,9999,28,365000.00,1.00,365000.00),(30,9999,29,365000.00,1.00,365000.00),(31,9999,30,365000.00,1.00,365000.00),(32,9999,31,365000.00,1.00,365000.00),(33,9999,32,365000.00,1.00,365000.00),(34,9999,33,365000.00,1.00,365000.00),(35,9999,34,365000.00,1.00,365000.00),(36,9999,35,365000.00,1.00,365000.00),(37,9999,36,365000.00,2.00,730000.00),(38,2,37,7500.00,1.00,7500.00),(39,4,38,4100.00,1.00,4100.00),(40,9999,39,7500.00,1.00,7500.00),(41,4,40,4100.00,1.00,4100.00),(42,2,41,7500.00,1.00,7500.00),(43,2,42,7500.00,1.00,7500.00),(44,2,43,7500.00,1.00,7500.00),(45,2,44,7500.00,1.00,7500.00),(46,2,45,7500.00,1.00,7500.00),(47,9999,46,7500.00,1.00,7500.00),(48,9999,47,7500.00,1.00,7500.00),(49,4,48,4100.00,1.00,4100.00),(50,2,49,7500.00,1.00,7500.00),(51,9999,50,7500.00,1.00,7500.00),(52,9999,51,24500.00,1.00,24500.00),(53,9999,52,24500.00,1.00,24500.00),(54,9999,53,7500.00,1.00,7500.00),(55,9999,54,24500.00,1.00,24500.00),(56,9999,55,24500.00,1.00,24500.00),(57,9999,56,24500.00,1.00,24500.00),(58,9999,57,24500.00,1.00,24500.00),(59,9999,58,24500.00,1.00,24500.00),(60,9999,59,24500.00,1.00,49000.00),(61,9999,59,7500.00,0.00,7500.00),(62,9999,60,24500.00,2.00,73500.00),(63,9999,60,7500.00,2.00,22500.00),(64,9999,61,24500.00,2.00,49000.00),(65,9999,61,7500.00,2.00,15000.00),(66,9999,62,24500.00,1.00,49000.00),(67,9999,62,7500.00,2.00,15000.00),(68,9999,63,24500.00,1.00,24500.00),(69,9999,64,24500.00,1.00,24500.00),(70,9999,65,24500.00,1.00,24500.00),(71,9999,66,24500.00,1.00,24500.00),(72,9999,67,24500.00,1.00,24500.00),(73,9999,68,7500.00,1.00,7500.00),(74,9999,68,24500.00,1.00,24500.00),(75,9999,69,7500.00,1.00,7500.00),(76,9999,70,365000.00,1.00,365000.00),(77,9999,71,365000.00,1.00,365000.00),(78,9999,72,365000.00,1.00,365000.00),(79,9999,73,365000.00,1.00,365000.00),(80,9999,74,365000.00,0.00,365000.00),(81,9999,75,365000.00,1.00,365000.00),(82,9999,76,365000.00,0.00,365000.00),(83,9999,77,365000.00,1.00,365000.00),(84,9999,78,365000.00,1.00,365000.00),(85,9999,79,5000.00,0.00,10000.00),(86,9999,80,24500.00,2.00,49000.00),(87,9999,80,365000.00,4.00,1825000.00),(88,9999,81,365000.00,5.00,1825000.00),(89,9999,82,365000.00,4.00,1825000.00),(90,9999,83,24500.00,1.00,24500.00),(91,9999,84,50000.00,1.00,50000.00),(92,4,85,4100.00,1.00,4100.00),(93,4,86,4100.00,1.00,4100.00),(94,4,87,4100.00,1.00,4100.00),(95,4,88,4100.00,1.00,4100.00),(96,4,89,4100.00,1.00,4100.00),(97,4,90,4100.00,1.00,4100.00),(98,4,91,4100.00,1.00,4100.00),(99,4,92,4100.00,1.00,4100.00),(100,4,93,4100.00,1.00,4100.00),(101,4,94,4100.00,1.00,4100.00),(102,4,95,4100.00,1.00,4100.00),(103,4,96,4100.00,4.00,16400.00),(104,4,97,4100.00,1.00,4100.00),(105,4,98,4100.00,5.00,20500.00),(106,4,99,4100.00,1.00,4100.00),(107,4,100,4100.00,3.00,12300.00),(108,4,101,4100.00,1.00,4100.00),(109,4,102,4100.00,2.00,8200.00),(110,4,103,4100.00,4.00,16400.00);
/*!40000 ALTER TABLE `item_has_sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemreceivenote`
--

DROP TABLE IF EXISTS `itemreceivenote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemreceivenote` (
  `id` int NOT NULL AUTO_INCREMENT,
  `irnno` varchar(255) DEFAULT NULL,
  `receiveddate` date DEFAULT NULL,
  `totalamount` decimal(38,2) DEFAULT NULL,
  `discountrate` decimal(38,2) DEFAULT NULL,
  `grossamount` decimal(38,2) DEFAULT NULL,
  `purchaseorder_id` int DEFAULT NULL,
  `irnstatus_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchaseorder_id` (`purchaseorder_id`),
  KEY `irnstatus_id` (`irnstatus_id`),
  CONSTRAINT `itemreceivenote_ibfk_1` FOREIGN KEY (`purchaseorder_id`) REFERENCES `purchaseorder` (`id`),
  CONSTRAINT `itemreceivenote_ibfk_2` FOREIGN KEY (`irnstatus_id`) REFERENCES `irnstatus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemreceivenote`
--

LOCK TABLES `itemreceivenote` WRITE;
/*!40000 ALTER TABLE `itemreceivenote` DISABLE KEYS */;
INSERT INTO `itemreceivenote` VALUES (20,NULL,'2025-07-21',NULL,0.00,NULL,18,NULL),(21,NULL,'2025-07-21',NULL,0.00,NULL,18,NULL),(22,NULL,'2025-07-21',NULL,0.00,NULL,18,NULL),(23,NULL,'2025-07-21',345000.00,0.00,345000.00,18,NULL),(24,NULL,'2025-07-21',345000.00,0.00,345000.00,18,NULL),(25,NULL,'2025-07-21',6970000.00,0.00,6970000.00,22,NULL),(26,NULL,'2025-07-22',3500.00,0.00,3500.00,21,NULL),(27,NULL,'2025-07-22',3500.00,0.00,3500.00,21,NULL),(28,NULL,'2025-07-22',3500.00,0.11,3496.15,21,NULL),(29,NULL,'2025-07-22',3500.00,123.00,3500.00,21,NULL),(30,NULL,'2025-07-21',3500.00,100.00,0.00,21,NULL),(31,NULL,'2025-07-21',3500.00,0.00,3500.00,21,NULL),(32,NULL,'2025-07-21',3500.00,0.00,3500.00,21,NULL),(33,NULL,'2025-07-21',3500.00,0.00,3500.00,21,NULL),(34,NULL,'2025-07-21',3500.00,0.00,3500.00,21,NULL),(35,NULL,'2025-07-21',348500.00,0.00,348500.00,20,NULL),(36,NULL,'2025-07-21',345000.00,0.00,345000.00,19,NULL),(37,NULL,'2025-07-21',345000.00,0.00,345000.00,18,NULL),(38,NULL,'2025-07-21',65000.00,0.00,65000.00,23,NULL),(39,NULL,'2025-07-21',15180000.00,0.00,15180000.00,24,NULL),(40,NULL,'2025-07-23',45000.00,0.00,45000.00,25,NULL),(41,NULL,'2025-07-23',3839000.00,0.00,3839000.00,26,NULL),(42,NULL,'2025-07-24',3500.00,0.00,3500.00,27,NULL);
/*!40000 ALTER TABLE `itemreceivenote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemreceivenote_has_item`
--

DROP TABLE IF EXISTS `itemreceivenote_has_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemreceivenote_has_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `itemreceivenote_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `purchaseprice` decimal(38,2) DEFAULT NULL,
  `orderqty` int DEFAULT NULL,
  `lineprice` decimal(38,2) DEFAULT NULL,
  `purchaseorder_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `itemreceivenote_id` (`itemreceivenote_id`),
  KEY `item_id` (`item_id`),
  KEY `FK7g6mjardhtsx53r0jjfllhlwr` (`purchaseorder_id`),
  CONSTRAINT `FK7g6mjardhtsx53r0jjfllhlwr` FOREIGN KEY (`purchaseorder_id`) REFERENCES `purchaseorder` (`id`),
  CONSTRAINT `itemreceivenote_has_item_ibfk_1` FOREIGN KEY (`itemreceivenote_id`) REFERENCES `itemreceivenote` (`id`),
  CONSTRAINT `itemreceivenote_has_item_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemreceivenote_has_item`
--

LOCK TABLES `itemreceivenote_has_item` WRITE;
/*!40000 ALTER TABLE `itemreceivenote_has_item` DISABLE KEYS */;
INSERT INTO `itemreceivenote_has_item` VALUES (38,25,4,3500.00,20,70000.00,NULL),(39,26,4,3500.00,1,3500.00,NULL),(40,27,4,3500.00,1,3500.00,NULL),(41,28,4,3500.00,1,3500.00,NULL),(42,29,4,3500.00,1,3500.00,NULL),(43,30,4,3500.00,1,3500.00,NULL),(44,31,4,3500.00,1,3500.00,NULL),(45,32,4,3500.00,1,3500.00,NULL),(46,33,4,3500.00,1,3500.00,NULL),(47,34,4,3500.00,1,3500.00,NULL),(49,35,4,3500.00,1,3500.00,NULL),(52,38,2,6500.00,10,65000.00,NULL),(56,41,9999,4000.00,11,44000.00,NULL),(57,42,4,3500.00,1,3500.00,NULL);
/*!40000 ALTER TABLE `itemreceivenote_has_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemstatus`
--

DROP TABLE IF EXISTS `itemstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemstatus` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemstatus`
--

LOCK TABLES `itemstatus` WRITE;
/*!40000 ALTER TABLE `itemstatus` DISABLE KEYS */;
INSERT INTO `itemstatus` VALUES (1,'Available'),(2,'Out of Stock');
/*!40000 ALTER TABLE `itemstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `id` int NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
INSERT INTO `module` VALUES (1,'Inventory'),(2,'Sales');
/*!40000 ALTER TABLE `module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymentmethod`
--

DROP TABLE IF EXISTS `paymentmethod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentmethod` (
  `id` int NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentmethod`
--

LOCK TABLES `paymentmethod` WRITE;
/*!40000 ALTER TABLE `paymentmethod` DISABLE KEYS */;
INSERT INTO `paymentmethod` VALUES (1,'Cash'),(2,'Bank Transfer');
/*!40000 ALTER TABLE `paymentmethod` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymentstatus`
--

DROP TABLE IF EXISTS `paymentstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentstatus` (
  `id` int NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentstatus`
--

LOCK TABLES `paymentstatus` WRITE;
/*!40000 ALTER TABLE `paymentstatus` DISABLE KEYS */;
INSERT INTO `paymentstatus` VALUES (1,'Paid'),(2,'Pending');
/*!40000 ALTER TABLE `paymentstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `porderstatus`
--

DROP TABLE IF EXISTS `porderstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `porderstatus` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `porderstatus`
--

LOCK TABLES `porderstatus` WRITE;
/*!40000 ALTER TABLE `porderstatus` DISABLE KEYS */;
INSERT INTO `porderstatus` VALUES (1,'Ordered'),(2,'Delivered'),(3,'Cancelled');
/*!40000 ALTER TABLE `porderstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchaseorder`
--

DROP TABLE IF EXISTS `purchaseorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchaseorder` (
  `id` int NOT NULL AUTO_INCREMENT,
  `purchaseordercode` varchar(255) DEFAULT NULL,
  `requireddate` date DEFAULT NULL,
  `totalamount` decimal(38,2) DEFAULT NULL,
  `supplier_id` int DEFAULT NULL,
  `porderstatus_id` int DEFAULT NULL,
  `irnstatus_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `porderstatus_id` (`porderstatus_id`),
  KEY `FKg8upipp8hmo9ctv03trcbsn2l` (`irnstatus_id`),
  CONSTRAINT `FKg8upipp8hmo9ctv03trcbsn2l` FOREIGN KEY (`irnstatus_id`) REFERENCES `irnstatus` (`id`),
  CONSTRAINT `purchaseorder_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`),
  CONSTRAINT `purchaseorder_ibfk_2` FOREIGN KEY (`porderstatus_id`) REFERENCES `porderstatus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchaseorder`
--

LOCK TABLES `purchaseorder` WRITE;
/*!40000 ALTER TABLE `purchaseorder` DISABLE KEYS */;
INSERT INTO `purchaseorder` VALUES (11,'PO1752824982124','2025-07-18',1790000.00,1,2,NULL),(12,'PO1752854293278','2025-07-18',4205000.00,9,2,NULL),(13,'PO1753017471543','2025-07-20',3105000.00,4,3,NULL),(14,'PO1753030979822','2025-07-20',1725000.00,1,3,NULL),(15,'PO1753031113644','2025-07-20',345000.00,1,3,NULL),(16,'PO1753110463969','2025-07-21',3485000.00,3,3,NULL),(17,'PO1753116038210','2025-07-21',345000.00,1,1,NULL),(18,'PO1753117463256','2025-07-21',345000.00,1,2,NULL),(19,'PO1753121460460','2025-07-21',345000.00,1,2,NULL),(20,'PO1753121497858','2025-07-21',348500.00,1,2,NULL),(21,'PO1753121690905','2025-07-21',3500.00,9,2,NULL),(22,'PO1753121781663','2025-07-21',6970000.00,9,3,NULL),(23,'PO1753126007329','2025-07-22',65000.00,1,2,NULL),(24,'PO1753200812567','2025-07-22',15180000.00,1,2,NULL),(25,'PO1753372981185','2025-07-24',45000.00,9,2,NULL),(26,'PO1753373728925','2025-07-24',3839000.00,9,2,NULL),(27,'PO1753448322401','2025-07-25',3500.00,1,2,NULL);
/*!40000 ALTER TABLE `purchaseorder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchaseorder_has_item`
--

DROP TABLE IF EXISTS `purchaseorder_has_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchaseorder_has_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `purchaseorder_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `purchaseprice` decimal(38,2) DEFAULT NULL,
  `orderedqty` int DEFAULT NULL,
  `lineprice` decimal(38,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchaseorder_id` (`purchaseorder_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `purchaseorder_has_item_ibfk_1` FOREIGN KEY (`purchaseorder_id`) REFERENCES `purchaseorder` (`id`),
  CONSTRAINT `purchaseorder_has_item_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchaseorder_has_item`
--

LOCK TABLES `purchaseorder_has_item` WRITE;
/*!40000 ALTER TABLE `purchaseorder_has_item` DISABLE KEYS */;
INSERT INTO `purchaseorder_has_item` VALUES (25,18,9999,345000.00,1,345000.00),(26,19,9999,345000.00,1,345000.00),(27,20,9999,345000.00,1,345000.00),(28,20,4,3500.00,1,3500.00),(29,21,4,3500.00,1,3500.00),(30,22,9999,345000.00,20,6900000.00),(31,22,4,3500.00,20,70000.00),(32,23,2,6500.00,10,65000.00),(33,24,9999,345000.00,44,15180000.00),(34,25,9999,45000.00,1,45000.00),(35,26,9999,345000.00,11,3795000.00),(36,26,9999,4000.00,11,44000.00),(37,27,4,3500.00,1,3500.00);
/*!40000 ALTER TABLE `purchaseorder_has_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `salesnumber` varchar(255) DEFAULT NULL,
  `total_amount` decimal(38,2) DEFAULT NULL,
  `paid_amount` decimal(38,2) DEFAULT NULL,
  `added_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `added_user` int DEFAULT NULL,
  `payment_type` varchar(255) DEFAULT NULL,
  `balance_amount` decimal(38,2) DEFAULT NULL,
  `discount` decimal(38,2) DEFAULT NULL,
  `subtotal` decimal(38,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `salesnumber` (`salesnumber`),
  KEY `sales_ibfk_1` (`added_user`),
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`added_user`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (13,'SAL001',NULL,NULL,'2025-07-19 17:33:28',9999,'Cash',365000.00,0.00,365000.00),(14,'SAL002',NULL,NULL,'2025-07-19 17:36:16',9999,'Cash',365000.00,0.00,365000.00),(15,'SAL003',NULL,NULL,'2025-07-19 17:38:04',9999,'Cash',7500.00,0.00,7500.00),(16,'SAL004',NULL,NULL,'2025-07-19 17:38:30',9999,'Cash',365000.00,0.00,365000.00),(17,'SAL005',365000.00,0.00,'2025-07-19 17:39:33',9999,'Cash',365000.00,0.00,365000.00),(18,'SAL006',365000.00,0.00,'2025-07-19 17:59:41',9999,'Cash',365000.00,0.00,365000.00),(19,'SAL007',365000.00,0.00,'2025-07-19 18:03:17',9999,'Cash',365000.00,0.00,365000.00),(20,'SAL008',365000.00,0.00,'2025-07-19 18:07:47',9999,'Cash',365000.00,0.00,365000.00),(21,'SAL009',365000.00,0.00,'2025-07-19 18:11:01',9999,'Cash',365000.00,0.00,365000.00),(22,'SAL010',365000.00,0.00,'2025-07-19 18:11:05',9999,'Cash',365000.00,0.00,365000.00),(23,'SAL011',365000.00,0.00,'2025-07-19 18:11:07',9999,'Cash',365000.00,0.00,365000.00),(24,'SAL012',365000.00,0.00,'2025-07-19 18:11:09',9999,'Cash',365000.00,0.00,365000.00),(25,'SAL013',365000.00,0.00,'2025-07-19 18:11:11',9999,'Cash',365000.00,0.00,365000.00),(26,'SAL014',365000.00,0.00,'2025-07-19 18:11:16',9999,'Cash',365000.00,0.00,365000.00),(27,'SAL015',365000.00,0.00,'2025-07-19 18:11:18',9999,'Cash',365000.00,0.00,365000.00),(28,'SAL016',365000.00,0.00,'2025-07-19 18:11:19',9999,'Cash',365000.00,0.00,365000.00),(29,'SAL017',365000.00,0.00,'2025-07-19 18:11:46',9999,'Cash',365000.00,0.00,365000.00),(30,'SAL018',365000.00,0.00,'2025-07-19 18:13:23',9999,'Cash',365000.00,0.00,365000.00),(31,'SAL019',365000.00,0.00,'2025-07-19 18:14:36',9999,'Cash',365000.00,0.00,365000.00),(32,'SAL020',365000.00,0.00,'2025-07-19 18:14:44',9999,'Cash',365000.00,0.00,365000.00),(33,'SAL021',365000.00,0.00,'2025-07-19 19:05:59',9999,'Cash',365000.00,0.00,365000.00),(34,'SAL022',365000.00,0.00,'2025-07-19 19:13:23',9999,'Cash',365000.00,0.00,365000.00),(35,'SAL023',NULL,NULL,'2025-07-19 22:38:43',9999,'Cash',NULL,NULL,NULL),(36,'SAL024',NULL,NULL,'2025-07-19 22:39:02',9999,'Cash',NULL,NULL,NULL),(37,'SAL025',NULL,NULL,'2025-07-19 22:43:46',9999,'Cash',900.00,88.00,7500.00),(38,'SAL026',NULL,NULL,'2025-07-19 22:46:04',9999,'Cash',2296.00,44.00,4100.00),(39,'SAL027',7500.00,0.00,'2025-07-19 22:47:02',9999,'Cash',NULL,0.00,7500.00),(40,'SAL028',4100.00,0.00,'2025-07-19 22:48:20',9999,'Cash',4100.00,0.00,4100.00),(41,'SAL029',7500.00,0.00,'2025-07-19 22:52:47',9999,'Cash',7500.00,0.00,7500.00),(42,'SAL030',7500.00,0.00,'2025-07-19 22:53:05',9999,'Cash',7500.00,0.00,7500.00),(43,'SAL031',7500.00,0.00,'2025-07-19 22:53:31',9999,'Cash',7500.00,0.00,7500.00),(44,'SAL032',7500.00,0.00,'2025-07-19 22:55:11',9999,'Cash',7500.00,0.00,7500.00),(45,'SAL033',7500.00,0.00,'2025-07-19 22:55:26',9999,'Cash',7500.00,0.00,7500.00),(46,'SAL034',7500.00,0.00,'2025-07-19 22:58:12',9999,'Cash',7500.00,0.00,7500.00),(47,'SAL035',7500.00,0.00,'2025-07-19 22:58:47',9999,'Cash',7500.00,0.00,7500.00),(48,'SAL036',4100.00,0.00,'2025-07-19 22:59:30',9999,'Cash',4100.00,0.00,4100.00),(49,'SAL037',7500.00,0.00,'2025-07-19 23:05:00',9999,'Cash',7500.00,0.00,7500.00),(50,'SAL038',1725.00,0.00,'2025-07-19 23:05:12',9999,'Cash',1725.00,77.00,7500.00),(51,'SAL039',21805.00,0.00,'2025-07-19 23:29:30',9999,'Cash',21805.00,11.00,24500.00),(52,'SAL040',24010.00,24010.00,'2025-07-19 23:36:11',9999,'Cash',0.00,2.00,24500.00),(53,'SAL041',7500.00,0.00,'2025-07-19 23:39:16',9999,'Cash',7500.00,0.00,7500.00),(54,'SAL042',24500.00,0.00,'2025-07-19 23:41:12',9999,'Cash',24500.00,0.00,24500.00),(55,'SAL043',24500.00,0.00,'2025-07-19 23:42:05',9999,'Cash',24500.00,0.00,24500.00),(56,'SAL044',24255.00,24255.00,'2025-07-19 23:42:16',9999,'Cash',0.00,1.00,24500.00),(57,'SAL045',23765.00,23765.00,'2025-07-19 23:42:43',9999,'Cash',0.00,3.00,24500.00),(58,'SAL046',24500.00,0.00,'2025-07-19 23:45:27',9999,'Cash',24500.00,0.00,24500.00),(59,'SAL047',24499.00,23935.00,'2025-07-20 00:03:39',9999,'Cash',564.00,1.00,24500.00),(60,'SAL048',64000.00,-32000.00,'2025-07-20 00:24:48',9999,'Cash',96000.00,0.00,64000.00),(61,'SAL049',64000.00,0.00,'2025-07-20 00:30:39',9999,'Cash',64000.00,0.00,64000.00),(62,'SAL050',39500.00,32000.00,'2025-07-20 00:31:35',9999,'Cash',7500.00,0.00,39500.00),(63,'SAL051',24500.00,24500.00,'2025-07-20 18:10:48',1,'Cash',0.00,0.00,24500.00),(64,'SAL052',24500.00,0.00,'2025-07-20 18:13:35',1,'Cash',24500.00,0.00,24500.00),(65,'SAL053',24500.00,0.00,'2025-07-20 18:13:46',1,'Cash',24500.00,0.00,24500.00),(66,'SAL054',24500.00,0.00,'2025-07-20 18:16:39',1,'Cash',24500.00,0.00,24500.00),(67,'SAL055',24500.00,0.00,'2025-07-20 18:34:03',1,'Cash',24500.00,0.00,24500.00),(68,'SAL056',32000.00,0.00,'2025-07-20 18:37:25',1,'Cash',32000.00,0.00,32000.00),(69,'SAL057',7500.00,0.00,'2025-07-20 18:38:27',1,'Cash',7500.00,0.00,7500.00),(70,'SAL058',164250.00,164250.00,'2025-07-21 16:43:45',1,'Cash',0.00,55.00,365000.00),(71,'SAL059',365000.00,0.00,'2025-07-21 16:44:17',1,'Cash',365000.00,0.00,365000.00),(72,'SAL060',365000.00,0.00,'2025-07-21 16:47:38',1,'Cash',365000.00,0.00,365000.00),(73,'SAL061',365000.00,0.00,'2025-07-21 16:49:49',1,'Cash',365000.00,0.00,365000.00),(74,'SAL062',0.00,0.00,'2025-07-21 16:56:25',1,'Cash',0.00,0.00,0.00),(75,'SAL063',365000.00,0.00,'2025-07-21 16:57:03',1,'Cash',365000.00,0.00,365000.00),(76,'SAL064',0.00,-365000.00,'2025-07-21 16:59:08',1,'Cash',365000.00,0.00,0.00),(77,'SAL065',365000.00,0.00,'2025-07-21 19:56:46',1,'Cash',365000.00,0.00,365000.00),(78,'SAL066',365000.00,0.00,'2025-07-21 20:14:41',9999,'Cash',365000.00,0.00,365000.00),(79,'SAL067',-10.00,-8000.00,'2025-07-24 21:51:50',1,'Cash',7990.00,10.00,0.00),(80,'SAL068',1509000.00,-365000.00,'2025-07-24 22:34:06',1,'Cash',1874000.00,0.00,1509000.00),(81,'SAL069',1825000.00,0.00,'2025-07-24 22:46:34',1,'Cash',1825000.00,0.00,1825000.00),(82,'SAL070',1460000.00,1460000.00,'2025-07-24 22:46:58',1,'Cash',0.00,0.00,1460000.00),(83,'SAL071',24500.00,0.00,'2025-07-24 23:07:02',1,'Cash',24500.00,0.00,24500.00),(84,'SAL072',50000.00,50000.00,'2025-07-25 13:45:45',1,'Cash',0.00,0.00,50000.00),(85,'SAL073',4100.00,4100.00,'2025-07-25 14:21:32',NULL,'Cash',0.00,0.00,4100.00),(86,'SAL074',4100.00,4100.00,'2025-07-25 15:23:02',NULL,'Cash',0.00,0.00,4100.00),(87,'SAL075',4100.00,0.00,'2025-07-25 15:23:27',NULL,'Cash',4100.00,0.00,4100.00),(88,'SAL076',4100.00,0.00,'2025-07-25 15:36:47',NULL,'Cash',4100.00,0.00,4100.00),(89,'SAL077',4100.00,0.00,'2025-07-25 16:09:31',NULL,'Cash',4100.00,0.00,4100.00),(90,'SAL078',4100.00,0.00,'2025-07-25 16:34:34',NULL,'Cash',4100.00,0.00,4100.00),(91,'SAL079',4100.00,0.00,'2025-07-25 16:46:03',NULL,'Cash',4100.00,0.00,4100.00),(92,'SAL080',4100.00,0.00,'2025-07-25 16:46:24',NULL,'Cash',4100.00,0.00,4100.00),(93,'SAL081',4100.00,0.00,'2025-07-25 16:51:20',2,'Cash',4100.00,0.00,4100.00),(94,'SAL082',4100.00,0.00,'2025-07-25 16:51:45',2,'Cash',4100.00,0.00,4100.00),(95,'SAL083',4100.00,0.00,'2025-07-25 17:04:39',2,'Cash',4100.00,0.00,4100.00),(96,'SAL084',16400.00,0.00,'2025-07-25 18:13:08',1,'Cash',16400.00,0.00,16400.00),(97,'SAL085',4100.00,0.00,'2025-07-25 18:13:43',1,'Cash',4100.00,0.00,4100.00),(98,'SAL086',20500.00,0.00,'2025-07-25 18:13:57',1,'Cash',20500.00,0.00,20500.00),(99,'SAL087',4100.00,0.00,'2025-07-25 18:14:33',1,'Cash',4100.00,0.00,4100.00),(100,'SAL088',12300.00,0.00,'2025-07-25 18:15:30',9999,'Cash',12300.00,0.00,12300.00),(101,'SAL089',4100.00,0.00,'2025-07-25 18:15:53',9999,'Cash',4100.00,0.00,4100.00),(102,'SAL090',8200.00,0.00,'2025-07-25 18:17:58',9999,'Cash',8200.00,0.00,8200.00),(103,'SAL091',16400.00,16400.00,'2025-07-25 18:28:19',9999,'Cash',0.00,0.00,16400.00);
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategory`
--

DROP TABLE IF EXISTS `subcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `subcategory_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategory`
--

LOCK TABLES `subcategory` WRITE;
/*!40000 ALTER TABLE `subcategory` DISABLE KEYS */;
INSERT INTO `subcategory` VALUES (1,'Mobile Phones',1),(9,'Mens Wear',4),(10,'Womens Wear',4),(11,'Mobile Accessories',1),(12,'Power Tools',7),(13,'Hand Tools',7),(14,'Rice',8),(16,'Mouse',1);
/*!40000 ALTER TABLE `subcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `id` int NOT NULL AUTO_INCREMENT,
  `suppliername` varchar(255) DEFAULT NULL,
  `suppliercontactno` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `supplierstatus_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `FKgchi005rwlgjth70iiy79kfxd` (`supplierstatus_id`),
  CONSTRAINT `FKgchi005rwlgjth70iiy79kfxd` FOREIGN KEY (`supplierstatus_id`) REFERENCES `supplierstatus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,'Global Fastenings Ltd','+94771234567','sales@globalfastenings.com',1),(3,'Apex Tools & Hardware','+94711234567','contact@apextools.lk',2),(4,'BuildPro Supplies','+94762223344','support@buildpro.lk',1),(9,'IronEdge Traders','+94779998888','hello@ironedge.store',1),(11,'testint','+94771234567','saless@globalfastenings.com',1);
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_has_item`
--

DROP TABLE IF EXISTS `supplier_has_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_has_item` (
  `item_id` int NOT NULL,
  `supplier_id` int NOT NULL,
  PRIMARY KEY (`item_id`,`supplier_id`),
  KEY `FK38v7ks0je3xdt87aineyv0ei` (`supplier_id`),
  CONSTRAINT `FK38v7ks0je3xdt87aineyv0ei` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`),
  CONSTRAINT `FK3gmjsebq2lcek1bybogadrlxk` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_has_item`
--

LOCK TABLES `supplier_has_item` WRITE;
/*!40000 ALTER TABLE `supplier_has_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplier_has_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplierstatus`
--

DROP TABLE IF EXISTS `supplierstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplierstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplierstatus`
--

LOCK TABLES `supplierstatus` WRITE;
/*!40000 ALTER TABLE `supplierstatus` DISABLE KEYS */;
INSERT INTO `supplierstatus` VALUES (1,'Approved'),(2,'Blacklisted');
/*!40000 ALTER TABLE `supplierstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  `addeddatetime` datetime DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `user_ibfk_1` (`employee_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','$2b$12$ekr4Ks.k.4Jnp3hz9PAbkOgakvezuQq64K1hY5s/k0i7LLPoG8IxG',1,NULL,1),(5,'bob','$2a$10$dgqgJpvel9ak3/votPzUBeuqNBRavt0pSe87Ojme2UG/uKcJniQLW',1,NULL,2);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'springbootdb'
--

--
-- Dumping routines for database 'springbootdb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-25 18:32:35
