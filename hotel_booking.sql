-- MySQL dump 10.13  Distrib 9.2.0, for Win64 (x86_64)
--
-- Host: localhost    Database: hotel_booking
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `bookingId` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `roomId` int DEFAULT NULL,
  `checkInDate` date NOT NULL,
  `checkOutDate` date NOT NULL,
  `status` enum('Pending','Confirmed','Cancelled') DEFAULT 'Pending',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`bookingId`),
  KEY `userId` (`userId`),
  KEY `roomId` (`roomId`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`roomId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (15,7,1,'2024-10-20','2024-10-25','Confirmed','2025-03-14 18:48:01'),(34,4,1,'2025-08-12','2025-08-15','Confirmed','2025-03-25 18:52:10'),(35,4,1,'2025-08-12','2025-08-15','Confirmed','2025-03-27 13:51:58'),(38,4,1,'2024-12-11','2024-12-14','Confirmed','2025-03-31 16:01:47'),(39,4,1,'2025-06-12','2025-06-14','Confirmed','2025-03-31 16:59:07'),(40,4,1,'2025-04-28','2025-04-30','Confirmed','2025-04-07 17:29:33'),(41,4,3,'2025-04-08','2025-04-10','Confirmed','2025-04-08 05:54:28'),(42,4,6,'2025-04-10','2025-04-12','Confirmed','2025-04-09 10:10:21'),(43,14,3,'2025-06-20','2025-07-31','Confirmed','2025-04-14 22:24:37'),(44,15,3,'2025-04-25','2025-04-30','Confirmed','2025-04-19 14:36:42');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `roomId` int NOT NULL AUTO_INCREMENT,
  `roomType` enum('Single','Double','Suite') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `availability` tinyint(1) DEFAULT '1',
  `description` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`roomId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'Single',75.00,1,'Cozy single room with a sea view','2025-02-23 18:31:57'),(3,'Suite',210.00,1,'Luxury suite with private Jacuzzi','2025-02-23 18:31:57'),(4,'Single',100.00,1,'Cozy single room on the 2nd floor','2025-03-19 00:10:58'),(5,'Single',100.00,1,'Cozy single room on the 3rd floor','2025-03-19 00:10:58'),(6,'Double',180.00,1,'Spacious double room with ocean view','2025-03-19 00:10:58'),(7,'Double',180.00,1,'Spacious double room with a garden view','2025-03-19 00:10:58');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('guest','admin') NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'AdminUser','admin@example.com','$2b$10$7PHOOKgmysj.j9LxvigL8Oo9.a8B6gh.DnbFpqfHUbwjBvBn9Cele','admin'),(4,'testuser','testuser@example.com','$2b$10$Q9fhZjobCaVRsTzynwi9QuodmDffUEEcMXcHlUCsUSNxPbBGeg7..','guest'),(6,'JackHitch','jack@example.com','$2b$10$YsXkwRmspdt6bYYBD5oTRevTt/blayyq9UJuJRvhW4LBPY7lUO8GO','guest'),(7,'AbiSmith','AbiSmith@example.com','$2b$10$U4WVmryQcJMi3dGonqfW3u/uHNV.crq6mYKQnetsTMblIe8dgZcWO','guest'),(8,'Joshy','JoshyRobberts@example.com','$2b$10$XaIZV0gBWxdy41qQhT1BfOoWKW2eMBK/PM44Lgm0HNuGcUrTIdqt6','guest'),(9,'Auggie','AuggieMel@example.com','$2b$10$2tyhN26YMW25Uemc6VVeYOZYeqR0Np7DwELG7G6SA0Wdc/46ScrKy','guest'),(10,'tom','tom@example.com','$2b$10$.xIRxEffVFZ2OHeBmzUywuNTOhMVbFYPoOdMsP6JdlQOZc1CZ.skC','guest'),(11,'haz','haz@example.com','$2b$10$jVwP26/ac58/5uz33G6uCu/97vLVOll6bRjJJabZo9lTUmq9/nUTm','guest'),(12,'Ceyda','ceyda@example.com','$2b$10$Fl4IVY2zHqqNSvCHSda1LuG8DuEOAZFgVJKCOM7tU5VFE.tOMhW0y','guest'),(13,'Susan','Susan@example.com','$2b$10$QYTHcW8oy3Xh/9giprrl6.nlVdX81SkBkl4b/DEavyiqrGL0Ru0JS','guest'),(14,'Auguste Mockute','aug@gmail.com','$2b$10$zVyd07dvUDrnx9y4HO8Ke.blTn7919BrFPxsrxryBLSClMiqLfp8C','guest'),(15,'Hope','hope123@bing.com','$2b$10$fMJ2BkUh7yyx.6tAb/Jwl.vMJDHnQrZhIqe1odMN5LOD97tpZbu4.','guest');
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

-- Dump completed on 2025-04-30  4:06:32
