-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: ims_soft_db
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `targetId` varchar(50) DEFAULT NULL,
  `module` varchar(50) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `oldState` longtext,
  `newState` longtext,
  `changedBy` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'CAT-1767976466777','Category','CREATE',NULL,'{\"id\":\"CAT-1767976466777\",\"name\":\"Masusd\"}','Admin','2026-01-09 16:34:26'),(2,'P-356','Inventory','CREATE',NULL,'{\"id\":\"P-356\",\"name\":\"Mausd\",\"categoryId\":\"CAT-1767976466777\",\"costPrice\":1000,\"sellingPrice\":1000,\"openingStock\":100,\"currentStock\":100,\"image\":\"https://picsum.photos/seed/0.7059142769377836/400/400\"}','Admin','2026-01-09 16:34:43'),(3,'PUR-1767976527484','Purchase','STOCK_IN',NULL,'{\"id\":\"PUR-1767976527484\",\"productId\":\"P-356\",\"productName\":\"Mausd\",\"quantity\":10,\"purchasePrice\":1000,\"totalCost\":10000,\"supplierName\":\"\",\"purchaseDate\":\"2026-01-09\",\"createdBy\":\"Admin User\"}','Admin User','2026-01-09 16:35:27'),(4,'NC-0942','Order','CREATE',NULL,'{\"id\":\"NC-0942\",\"refNumbers\":{\"anjoli\":\"sdfg\",\"papiya\":\"\",\"mahabub\":\"\"},\"facebookLink\":\"http://localhost:3000/scan-order\",\"customer\":{\"name\":\"gdsfgdsfg\",\"phone\":\"017833077111\",\"platform\":\"Facebook\",\"profileName\":\"fdsg\",\"address\":{\"village\":\"\",\"union\":\"\",\"thana\":\"\",\"district\":\"Dhaka\"}},\"productId\":\"P-356\",\"productName\":\"Mausd\",\"quantity\":10,\"unitPrice\":\"1000.00\",\"subtotal\":10000,\"discount\":{\"type\":\"fixed\",\"value\":0,\"amount\":0,\"reason\":\"\"},\"delivery\":{\"type\":\"Inside Area\",\"charge\":60,\"status\":\"Pending\"},\"payment\":{\"status\":\"Unpaid\",\"method\":\"Cash on Delivery (COD)\",\"paidAmount\":0,\"dueAmount\":10060,\"transactionId\":\"\"},\"financials\":{\"netPayable\":10060,\"profit\":0},\"meta\":{\"orderDate\":\"2026-01-09\",\"proposedDeliveryDate\":\"\",\"customerRequiredDate\":\"\",\"receivedBy\":\"Admin User\",\"notes\":\"\",\"month\":1,\"year\":2026}}','Admin User','2026-01-09 16:42:30'),(5,'NC-0942','Financial','PAYMENT','{\"method\":\"Cash on Delivery (COD)\",\"status\":\"Unpaid\",\"dueAmount\":10060,\"paidAmount\":0,\"transactionId\":\"\"}','{\"method\":\"Cash on Delivery (COD)\",\"status\":\"Paid\",\"dueAmount\":0,\"paidAmount\":10060,\"transactionId\":\"\",\"history\":[{\"id\":\"PAY-1767976961696\",\"amount\":10060,\"method\":\"Cash on Delivery (COD)\",\"transactionId\":\"\",\"date\":\"2026-01-09T16:42:41.696Z\",\"receivedBy\":\"Admin User\"}]}','Admin User','2026-01-09 16:42:41'),(6,'NC-0942','Order','STATUS_CHANGE','{\"status\":\"Pending\"}','{\"status\":\"Delivered\"}','Admin User','2026-01-09 16:42:44'),(7,'NC-0942','Order','STATUS_CHANGE','{\"status\":\"Delivered\"}','{\"status\":\"Processing\"}',NULL,'2026-01-10 08:01:20'),(8,'NC-0942','Order','STATUS_CHANGE','{\"status\":\"Processing\"}','{\"status\":\"Delivered\"}',NULL,'2026-01-10 08:01:22'),(9,'NC-0942','Order','STATUS_CHANGE','{\"status\":\"Delivered\"}','{\"status\":\"Processing\"}',NULL,'2026-01-10 08:01:23'),(10,'NC-0942','Order','STATUS_CHANGE','{\"status\":\"Processing\"}','{\"status\":\"Delivered\"}',NULL,'2026-01-10 08:01:23'),(11,'NC-0942','Order','STATUS_CHANGE','{\"status\":\"Delivered\"}','{\"status\":\"Returned\"}',NULL,'2026-01-10 08:01:24'),(12,'NC-0942','Order','STATUS_CHANGE','{\"status\":\"Returned\"}','{\"status\":\"Cancelled\"}',NULL,'2026-01-10 08:01:25');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('CAT-1767976466777','Masusd');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` varchar(50) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `type` varchar(100) NOT NULL,
  `description` text,
  `date` date NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `income`
--

DROP TABLE IF EXISTS `income`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `income` (
  `id` varchar(36) NOT NULL,
  `source` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `income`
--

LOCK TABLES `income` WRITE;
/*!40000 ALTER TABLE `income` DISABLE KEYS */;
/*!40000 ALTER TABLE `income` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` varchar(36) NOT NULL,
  `order_id` varchar(36) NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(50) NOT NULL,
  `productId` varchar(50) DEFAULT NULL,
  `productName` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `unitPrice` decimal(12,2) DEFAULT '0.00',
  `subtotal` decimal(12,2) DEFAULT '0.00',
  `refNumbers` json DEFAULT NULL,
  `customer` json DEFAULT NULL,
  `discount` json DEFAULT NULL,
  `delivery` json DEFAULT NULL,
  `payment` json DEFAULT NULL,
  `financials` json DEFAULT NULL,
  `meta` json DEFAULT NULL,
  `orderDate` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('NC-0942','P-356','Mausd',10,1000.00,10000.00,'{\"anjoli\": \"sdfg\", \"papiya\": \"\", \"mahabub\": \"\"}','{\"name\": \"gdsfgdsfg\", \"phone\": \"017833077111\", \"address\": {\"thana\": \"\", \"union\": \"\", \"village\": \"\", \"district\": \"Dhaka\"}, \"platform\": \"Facebook\", \"profileName\": \"fdsg\"}','{\"type\": \"fixed\", \"value\": 0, \"amount\": 0, \"reason\": \"\"}','{\"type\": \"Inside Area\", \"charge\": 60, \"status\": \"Cancelled\"}','{\"method\": \"Cash on Delivery (COD)\", \"status\": \"Paid\", \"history\": [{\"id\": \"PAY-1767976961696\", \"date\": \"2026-01-09T16:42:41.696Z\", \"amount\": 10060, \"method\": \"Cash on Delivery (COD)\", \"receivedBy\": \"Admin User\", \"transactionId\": \"\"}], \"dueAmount\": 0, \"paidAmount\": 10060, \"transactionId\": \"\"}','{\"profit\": 0, \"netPayable\": 10060}','{\"year\": 2026, \"month\": 1, \"notes\": \"\", \"orderDate\": \"2026-01-09\", \"receivedBy\": \"Admin User\", \"customerRequiredDate\": \"\", \"proposedDeliveryDate\": \"\"}','2026-01-09');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `categoryId` varchar(50) DEFAULT NULL,
  `costPrice` decimal(12,2) DEFAULT '0.00',
  `sellingPrice` decimal(12,2) DEFAULT '0.00',
  `openingStock` int DEFAULT '0',
  `currentStock` int DEFAULT '0',
  `image` longtext,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('P-356','Mausd','CAT-1767976466777',1000.00,1000.00,100,110,'https://picsum.photos/seed/0.7059142769377836/400/400');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchases` (
  `id` varchar(50) NOT NULL,
  `productId` varchar(50) NOT NULL,
  `productName` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `purchasePrice` decimal(12,2) NOT NULL,
  `totalCost` decimal(15,2) NOT NULL,
  `supplierName` varchar(255) DEFAULT NULL,
  `purchaseDate` date NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  KEY `purchaseDate` (`purchaseDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

LOCK TABLES `purchases` WRITE;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
INSERT INTO `purchases` VALUES ('PUR-1767976527484','P-356','Mausd',10,1000.00,10000.00,'','2026-01-09','Admin User','2026-01-09 16:35:27');
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'staff',
  `permissionsOverride` json DEFAULT NULL,
  `accessScope` json DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT '0',
  `status` varchar(20) DEFAULT 'active',
  `lastLoginAt` datetime DEFAULT NULL,
  `failedLoginAttempts` int DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `email_2` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('0b90e94c-ea8a-4595-bfd6-1fc96c4146db','testuser_1767978506821@example.com','$2b$10$KiHRHWgEhT146QaNW8FU2uM0natoJzwNmaetGoxzuCuqBTPdA/tey','Test','User','manager','[]','{\"stores\": [], \"warehouses\": []}',0,'active','2026-01-09 23:08:27',0,'2026-01-09 17:08:26','2026-01-09 17:08:27'),('103344e2-9ce5-4839-90b0-400b2efd45a7','mid_test_1767979780634@example.com','$2b$10$6E7TnnFY3voWQyH.Lh8HOOI8U0q4DgoHbhVzjo1.c7X3RVoy66Aeq','Mid','Test','admin','[]','{\"stores\": [], \"warehouses\": []}',0,'active','2026-01-09 23:29:40',0,'2026-01-09 17:29:40','2026-01-09 17:29:40'),('4319903c-7672-4e5e-a910-9b315decccc2','testuser_1767978906704@example.com','$2b$10$xaEJ0Zr5WGyIR.7LWWYASO6yevpaRDdUbdBm5xdk9Z6PyMAA3xcUS','Test','User','staff','[]','{\"stores\": [], \"warehouses\": []}',0,'active','2026-01-09 23:15:06',0,'2026-01-09 17:15:06','2026-01-09 17:15:06'),('8ed20a09-0021-4089-9468-8e8dcce32e15','masud@gmail.com','$2b$10$UZVrat7XnR006Xt3sPhv2ekj4TU7/fCuH/rhc9vYZoi2b9a145xRG','Masud','Pervez','Admin','[]','{\"stores\": [], \"warehouses\": []}',0,'active','2026-01-11 22:16:45',0,'2026-01-09 17:17:14','2026-01-11 16:16:45'),('a715dddb-79c4-47fd-a830-62b735af6be0','mid_test_1767979802653@example.com','$2b$10$RNOKfhmJ6OwgXE8qYu8HxuLWwJ9QQWHgcEjlWPIBHcgIp93AHa1da','Mid','Test','admin','[]','{\"stores\": [], \"warehouses\": []}',0,'active','2026-01-09 23:30:02',0,'2026-01-09 17:30:02','2026-01-09 17:30:02'),('b1021c20-6b74-4141-b0d2-fc8703aeba8e','mid_test_1767979826418@example.com','$2b$10$9IW/4fLaE.mahsPx2RKN1uPaZitnGYym.e4gGXD5sYzpBoxkvZwVW','Mid','Test','admin','[]','{\"stores\": [], \"warehouses\": []}',0,'active','2026-01-09 23:30:26',0,'2026-01-09 17:30:26','2026-01-09 17:30:26'),('db85a0bf-8dd3-46fd-90b5-4369c4657799','admin@gmail.com','$2b$10$p3KfxuOaIFfoFT6adLiWU.MgXpFhX2YrAPz0y.vnftTizKL0G2caO','Super ','Admin','staff','[]','{\"stores\": [], \"warehouses\": []}',0,'active','2026-01-11 22:10:53',0,'2026-01-11 16:10:40','2026-01-11 16:10:53');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-11 23:25:11
