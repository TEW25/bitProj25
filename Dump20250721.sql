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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
INSERT INTO `brand` VALUES (1,'Samsung'),(3,'Apple'),(6,'Anker'),(7,'dbrand'),(8,'Bosch'),(9,'Makita'),(10,'DeWalt');
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
INSERT INTO `designation` VALUES (1,'Admin'),(2,'Manager'),(3,'Sales Rep');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'EMP001','Alice Perera','199012345V','Female','1990-03-05','0771234567','alice@example.com',1,1),(2,'EMP002','Bob Silva','198812345V','Male','1988-11-23','0719876543','bob@example.com',2,1),(3,'EMP003','sales rep name 1 ','228812345V','Male','1988-11-23','0719876543','bob@example.com',2,1),(4,'EMP0004','hello wrld','12345678','Male','2025-06-11','0712345678','daranii@gmail.com',1,1),(5,'EMP0006','cashier one','1111111111','Male','1999-02-09','0784480551','cas1@gmail.com',3,2);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `employeestatus` VALUES (1,'Working'),(2,'Resign'),(3,'Temporery Resign'),(4,'Deleted');
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,'INV001',1.00,31.00,1,2,NULL),(2,'INV002',0.00,10.00,2,1,NULL),(6,NULL,0.00,24.00,4,1,NULL),(7,NULL,3.00,10.00,3,1,NULL),(15,'INV1752854362989',1.00,10.00,6,1,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (1,'ITM0001','iPhone 15 Pro Max','6.70',15,100,365000.00,345000.00,1,3,1),(2,'ITM0002','Anker USB-C Fast Charger','0.20',30,150,7500.00,6500.00,1,6,11),(3,'ITM0003','Bosch Hammer Drill','13.00',10,30,24500.00,22500.00,1,8,12),(4,'ITM0004','DeWalt Adjustable Wrench','10 Inch',12,50,4100.00,3500.00,1,10,13),(6,'ITM0005','test itemggg','0.20',30,150,7500.00,6500.00,1,9,11),(11,'ITM0008','test itemgggfffff','0.20',30,150,7500.00,6500.00,1,7,9),(12,'ITM0066','test itemgggfffffqqq','0.20',30,150,7500.00,6500.00,1,3,12);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_has_sales`
--

LOCK TABLES `item_has_sales` WRITE;
/*!40000 ALTER TABLE `item_has_sales` DISABLE KEYS */;
INSERT INTO `item_has_sales` VALUES (14,1,13,365000.00,1.00,365000.00),(15,1,14,365000.00,1.00,365000.00),(16,2,15,7500.00,1.00,7500.00),(17,1,16,365000.00,1.00,365000.00),(18,1,17,365000.00,1.00,365000.00),(19,1,18,365000.00,1.00,365000.00),(20,1,19,365000.00,1.00,365000.00),(21,1,20,365000.00,1.00,365000.00),(22,1,21,365000.00,1.00,365000.00),(23,1,22,365000.00,1.00,365000.00),(24,1,23,365000.00,1.00,365000.00),(25,1,24,365000.00,1.00,365000.00),(26,1,25,365000.00,1.00,365000.00),(27,1,26,365000.00,1.00,365000.00),(28,1,27,365000.00,1.00,365000.00),(29,1,28,365000.00,1.00,365000.00),(30,1,29,365000.00,1.00,365000.00),(31,1,30,365000.00,1.00,365000.00),(32,1,31,365000.00,1.00,365000.00),(33,1,32,365000.00,1.00,365000.00),(34,1,33,365000.00,1.00,365000.00),(35,1,34,365000.00,1.00,365000.00),(36,1,35,365000.00,1.00,365000.00),(37,1,36,365000.00,2.00,730000.00),(38,2,37,7500.00,1.00,7500.00),(39,4,38,4100.00,1.00,4100.00),(40,6,39,7500.00,1.00,7500.00),(41,4,40,4100.00,1.00,4100.00),(42,2,41,7500.00,1.00,7500.00),(43,2,42,7500.00,1.00,7500.00),(44,2,43,7500.00,1.00,7500.00),(45,2,44,7500.00,1.00,7500.00),(46,2,45,7500.00,1.00,7500.00),(47,6,46,7500.00,1.00,7500.00),(48,6,47,7500.00,1.00,7500.00),(49,4,48,4100.00,1.00,4100.00),(50,2,49,7500.00,1.00,7500.00),(51,6,50,7500.00,1.00,7500.00),(52,3,51,24500.00,1.00,24500.00),(53,3,52,24500.00,1.00,24500.00),(54,6,53,7500.00,1.00,7500.00),(55,3,54,24500.00,1.00,24500.00),(56,3,55,24500.00,1.00,24500.00),(57,3,56,24500.00,1.00,24500.00),(58,3,57,24500.00,1.00,24500.00),(59,3,58,24500.00,1.00,24500.00),(60,3,59,24500.00,1.00,49000.00),(61,6,59,7500.00,0.00,7500.00),(62,3,60,24500.00,2.00,73500.00),(63,6,60,7500.00,2.00,22500.00),(64,3,61,24500.00,2.00,49000.00),(65,6,61,7500.00,2.00,15000.00),(66,3,62,24500.00,1.00,49000.00),(67,6,62,7500.00,2.00,15000.00),(68,3,63,24500.00,1.00,24500.00),(69,3,64,24500.00,1.00,24500.00),(70,3,65,24500.00,1.00,24500.00),(71,3,66,24500.00,1.00,24500.00),(72,3,67,24500.00,1.00,24500.00),(73,6,68,7500.00,1.00,7500.00),(74,3,68,24500.00,1.00,24500.00),(75,6,69,7500.00,1.00,7500.00),(76,1,70,365000.00,1.00,365000.00),(77,1,71,365000.00,1.00,365000.00),(78,1,72,365000.00,1.00,365000.00),(79,1,73,365000.00,1.00,365000.00),(80,1,74,365000.00,1.00,365000.00),(81,1,75,365000.00,1.00,365000.00),(82,1,76,365000.00,1.00,365000.00),(83,1,77,365000.00,1.00,365000.00),(84,1,78,365000.00,1.00,365000.00);
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemreceivenote`
--

LOCK TABLES `itemreceivenote` WRITE;
/*!40000 ALTER TABLE `itemreceivenote` DISABLE KEYS */;
INSERT INTO `itemreceivenote` VALUES (10,'IRN1752826232322','2025-07-18',1790000.00,0.00,1790000.00,11,1),(11,'IRN1752854362970','2025-07-18',4205000.00,0.00,4205000.00,12,1),(12,NULL,'2025-07-21',NULL,0.00,NULL,16,NULL),(13,NULL,'2025-07-21',NULL,0.00,NULL,16,NULL),(14,NULL,'2025-07-21',NULL,0.00,NULL,16,NULL),(15,NULL,'2025-07-21',NULL,0.00,NULL,16,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemreceivenote_has_item`
--

LOCK TABLES `itemreceivenote_has_item` WRITE;
/*!40000 ALTER TABLE `itemreceivenote_has_item` DISABLE KEYS */;
INSERT INTO `itemreceivenote_has_item` VALUES (15,10,6,6500.00,10,65000.00,NULL),(16,10,1,345000.00,5,1725000.00,NULL),(17,11,6,6500.00,10,65000.00,NULL),(18,11,1,345000.00,12,4140000.00,NULL),(19,12,1,345000.00,10,3450000.00,NULL),(20,12,4,3500.00,10,35000.00,NULL),(21,13,1,345000.00,10,3450000.00,NULL),(22,13,4,3500.00,10,35000.00,NULL),(23,14,1,345000.00,10,3450000.00,NULL),(24,14,4,3500.00,10,35000.00,NULL),(25,15,1,345000.00,10,3450000.00,NULL),(26,15,4,3500.00,10,35000.00,NULL);
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
-- Table structure for table `privilege`
--

DROP TABLE IF EXISTS `privilege`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `privilege` (
  `id` int NOT NULL,
  `slct` tinyint DEFAULT NULL,
  `inst` tinyint DEFAULT NULL,
  `updt` tinyint DEFAULT NULL,
  `dlt` tinyint DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `module_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `module_id` (`module_id`),
  CONSTRAINT `privilege_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `privilege_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `privilege`
--

LOCK TABLES `privilege` WRITE;
/*!40000 ALTER TABLE `privilege` DISABLE KEYS */;
INSERT INTO `privilege` VALUES (1,1,1,1,1,1,1),(2,1,1,0,0,2,2);
/*!40000 ALTER TABLE `privilege` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchaseorder`
--

LOCK TABLES `purchaseorder` WRITE;
/*!40000 ALTER TABLE `purchaseorder` DISABLE KEYS */;
INSERT INTO `purchaseorder` VALUES (11,'PO1752824982124','2025-07-18',1790000.00,1,2,NULL),(12,'PO1752854293278','2025-07-18',4205000.00,9,2,NULL),(13,'PO1753017471543','2025-07-20',3105000.00,4,3,NULL),(14,'PO1753030979822','2025-07-20',1725000.00,1,3,NULL),(15,'PO1753031113644','2025-07-20',345000.00,1,3,NULL),(16,'PO1753110463969','2025-07-21',3485000.00,3,1,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchaseorder_has_item`
--

LOCK TABLES `purchaseorder_has_item` WRITE;
/*!40000 ALTER TABLE `purchaseorder_has_item` DISABLE KEYS */;
INSERT INTO `purchaseorder_has_item` VALUES (15,11,6,6500.00,10,65000.00),(16,11,1,345000.00,5,1725000.00),(17,12,6,6500.00,10,65000.00),(18,12,1,345000.00,12,4140000.00),(19,13,1,345000.00,9,3105000.00),(20,14,1,345000.00,5,1725000.00),(21,15,1,345000.00,1,345000.00),(22,16,1,345000.00,10,3450000.00),(23,16,4,3500.00,10,35000.00);
/*!40000 ALTER TABLE `purchaseorder_has_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Admin'),(2,'Clerk');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (13,'SAL001',NULL,NULL,'2025-07-19 17:33:28',3,'Cash',365000.00,0.00,365000.00),(14,'SAL002',NULL,NULL,'2025-07-19 17:36:16',3,'Cash',365000.00,0.00,365000.00),(15,'SAL003',NULL,NULL,'2025-07-19 17:38:04',3,'Cash',7500.00,0.00,7500.00),(16,'SAL004',NULL,NULL,'2025-07-19 17:38:30',3,'Cash',365000.00,0.00,365000.00),(17,'SAL005',365000.00,0.00,'2025-07-19 17:39:33',3,'Cash',365000.00,0.00,365000.00),(18,'SAL006',365000.00,0.00,'2025-07-19 17:59:41',3,'Cash',365000.00,0.00,365000.00),(19,'SAL007',365000.00,0.00,'2025-07-19 18:03:17',3,'Cash',365000.00,0.00,365000.00),(20,'SAL008',365000.00,0.00,'2025-07-19 18:07:47',3,'Cash',365000.00,0.00,365000.00),(21,'SAL009',365000.00,0.00,'2025-07-19 18:11:01',3,'Cash',365000.00,0.00,365000.00),(22,'SAL010',365000.00,0.00,'2025-07-19 18:11:05',3,'Cash',365000.00,0.00,365000.00),(23,'SAL011',365000.00,0.00,'2025-07-19 18:11:07',3,'Cash',365000.00,0.00,365000.00),(24,'SAL012',365000.00,0.00,'2025-07-19 18:11:09',3,'Cash',365000.00,0.00,365000.00),(25,'SAL013',365000.00,0.00,'2025-07-19 18:11:11',3,'Cash',365000.00,0.00,365000.00),(26,'SAL014',365000.00,0.00,'2025-07-19 18:11:16',3,'Cash',365000.00,0.00,365000.00),(27,'SAL015',365000.00,0.00,'2025-07-19 18:11:18',3,'Cash',365000.00,0.00,365000.00),(28,'SAL016',365000.00,0.00,'2025-07-19 18:11:19',3,'Cash',365000.00,0.00,365000.00),(29,'SAL017',365000.00,0.00,'2025-07-19 18:11:46',3,'Cash',365000.00,0.00,365000.00),(30,'SAL018',365000.00,0.00,'2025-07-19 18:13:23',3,'Cash',365000.00,0.00,365000.00),(31,'SAL019',365000.00,0.00,'2025-07-19 18:14:36',3,'Cash',365000.00,0.00,365000.00),(32,'SAL020',365000.00,0.00,'2025-07-19 18:14:44',3,'Cash',365000.00,0.00,365000.00),(33,'SAL021',365000.00,0.00,'2025-07-19 19:05:59',3,'Cash',365000.00,0.00,365000.00),(34,'SAL022',365000.00,0.00,'2025-07-19 19:13:23',3,'Cash',365000.00,0.00,365000.00),(35,'SAL023',NULL,NULL,'2025-07-19 22:38:43',3,'Cash',NULL,NULL,NULL),(36,'SAL024',NULL,NULL,'2025-07-19 22:39:02',3,'Cash',NULL,NULL,NULL),(37,'SAL025',NULL,NULL,'2025-07-19 22:43:46',3,'Cash',900.00,88.00,7500.00),(38,'SAL026',NULL,NULL,'2025-07-19 22:46:04',3,'Cash',2296.00,44.00,4100.00),(39,'SAL027',7500.00,0.00,'2025-07-19 22:47:02',3,'Cash',NULL,0.00,7500.00),(40,'SAL028',4100.00,0.00,'2025-07-19 22:48:20',3,'Cash',4100.00,0.00,4100.00),(41,'SAL029',7500.00,0.00,'2025-07-19 22:52:47',3,'Cash',7500.00,0.00,7500.00),(42,'SAL030',7500.00,0.00,'2025-07-19 22:53:05',3,'Cash',7500.00,0.00,7500.00),(43,'SAL031',7500.00,0.00,'2025-07-19 22:53:31',3,'Cash',7500.00,0.00,7500.00),(44,'SAL032',7500.00,0.00,'2025-07-19 22:55:11',3,'Cash',7500.00,0.00,7500.00),(45,'SAL033',7500.00,0.00,'2025-07-19 22:55:26',3,'Cash',7500.00,0.00,7500.00),(46,'SAL034',7500.00,0.00,'2025-07-19 22:58:12',3,'Cash',7500.00,0.00,7500.00),(47,'SAL035',7500.00,0.00,'2025-07-19 22:58:47',3,'Cash',7500.00,0.00,7500.00),(48,'SAL036',4100.00,0.00,'2025-07-19 22:59:30',3,'Cash',4100.00,0.00,4100.00),(49,'SAL037',7500.00,0.00,'2025-07-19 23:05:00',3,'Cash',7500.00,0.00,7500.00),(50,'SAL038',1725.00,0.00,'2025-07-19 23:05:12',3,'Cash',1725.00,77.00,7500.00),(51,'SAL039',21805.00,0.00,'2025-07-19 23:29:30',3,'Cash',21805.00,11.00,24500.00),(52,'SAL040',24010.00,24010.00,'2025-07-19 23:36:11',3,'Cash',0.00,2.00,24500.00),(53,'SAL041',7500.00,0.00,'2025-07-19 23:39:16',3,'Cash',7500.00,0.00,7500.00),(54,'SAL042',24500.00,0.00,'2025-07-19 23:41:12',3,'Cash',24500.00,0.00,24500.00),(55,'SAL043',24500.00,0.00,'2025-07-19 23:42:05',3,'Cash',24500.00,0.00,24500.00),(56,'SAL044',24255.00,24255.00,'2025-07-19 23:42:16',3,'Cash',0.00,1.00,24500.00),(57,'SAL045',23765.00,23765.00,'2025-07-19 23:42:43',3,'Cash',0.00,3.00,24500.00),(58,'SAL046',24500.00,0.00,'2025-07-19 23:45:27',3,'Cash',24500.00,0.00,24500.00),(59,'SAL047',24499.00,23935.00,'2025-07-20 00:03:39',3,'Cash',564.00,1.00,24500.00),(60,'SAL048',64000.00,-32000.00,'2025-07-20 00:24:48',3,'Cash',96000.00,0.00,64000.00),(61,'SAL049',64000.00,0.00,'2025-07-20 00:30:39',3,'Cash',64000.00,0.00,64000.00),(62,'SAL050',39500.00,32000.00,'2025-07-20 00:31:35',3,'Cash',7500.00,0.00,39500.00),(63,'SAL051',24500.00,24500.00,'2025-07-20 18:10:48',3,'Cash',0.00,0.00,24500.00),(64,'SAL052',24500.00,0.00,'2025-07-20 18:13:35',3,'Cash',24500.00,0.00,24500.00),(65,'SAL053',24500.00,0.00,'2025-07-20 18:13:46',3,'Cash',24500.00,0.00,24500.00),(66,'SAL054',24500.00,0.00,'2025-07-20 18:16:39',3,'Cash',24500.00,0.00,24500.00),(67,'SAL055',24500.00,0.00,'2025-07-20 18:34:03',3,'Cash',24500.00,0.00,24500.00),(68,'SAL056',32000.00,0.00,'2025-07-20 18:37:25',3,'Cash',32000.00,0.00,32000.00),(69,'SAL057',7500.00,0.00,'2025-07-20 18:38:27',3,'Cash',7500.00,0.00,7500.00),(70,'SAL058',164250.00,164250.00,'2025-07-21 16:43:45',NULL,'Cash',0.00,55.00,365000.00),(71,'SAL059',365000.00,0.00,'2025-07-21 16:44:17',NULL,'Cash',365000.00,0.00,365000.00),(72,'SAL060',365000.00,0.00,'2025-07-21 16:47:38',NULL,'Cash',365000.00,0.00,365000.00),(73,'SAL061',365000.00,0.00,'2025-07-21 16:49:49',NULL,'Cash',365000.00,0.00,365000.00),(74,'SAL062',365000.00,0.00,'2025-07-21 16:56:25',NULL,'Cash',365000.00,0.00,365000.00),(75,'SAL063',365000.00,0.00,'2025-07-21 16:57:03',NULL,'Cash',365000.00,0.00,365000.00),(76,'SAL064',365000.00,0.00,'2025-07-21 16:59:08',1,'Cash',365000.00,0.00,365000.00),(77,'SAL065',365000.00,0.00,'2025-07-21 19:56:46',3,'Cash',365000.00,0.00,365000.00),(78,'SAL066',365000.00,0.00,'2025-07-21 20:14:41',3,'Cash',365000.00,0.00,365000.00);
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategory`
--

LOCK TABLES `subcategory` WRITE;
/*!40000 ALTER TABLE `subcategory` DISABLE KEYS */;
INSERT INTO `subcategory` VALUES (1,'Mobile Phones',1),(9,'Mens Wear',4),(10,'Womens Wear',4),(11,'Mobile Accessories',1),(12,'Power Tools',7),(13,'Hand Tools',7),(14,'Rice',8);
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,'Global Fastenings Ltd','+94771234567','sales@globalfastenings.com',1),(3,'Apex Tools & Hardware','+94711234567','contact@apextools.lk',2),(4,'BuildPro Supplies','+94762223344','support@buildpro.lk',1),(9,'IronEdge Traders','+94779998888','hello@ironedge.store',1);
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
  `email` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  `addeddatetime` datetime DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `user_ibfk_1` (`employee_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','12345','alice@example.com',1,NULL,1),(2,'bob','hashed_pass2','bob@example.com',1,'2025-07-10 02:00:54',2),(3,'cashierone','12345','sg23aal@herts.ac.uk',1,NULL,5);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_has_role`
--

DROP TABLE IF EXISTS `user_has_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_has_role` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_has_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_has_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_has_role`
--

LOCK TABLES `user_has_role` WRITE;
/*!40000 ALTER TABLE `user_has_role` DISABLE KEYS */;
INSERT INTO `user_has_role` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `user_has_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-21 21:11:07
