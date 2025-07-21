/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: clink
-- ------------------------------------------------------
-- Server version	11.8.2-MariaDB

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
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `ID_Categoria` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Negocio` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_Categoria`,`ID_Negocio`),
  KEY `ID_Negocio` (`ID_Negocio`),
  CONSTRAINT `categoria_ibfk_1` FOREIGN KEY (`ID_Negocio`) REFERENCES `negocio` (`ID_Negocio`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `categoria` VALUES
(1,1,'Categoria_1'),
(1,2,'Categoria_1'),
(2,1,'Categoria_2'),
(2,2,'Categoria_2'),
(3,1,'Categoria_3'),
(3,2,'Categoria_3'),
(4,1,'Categoria_4'),
(4,2,'Categoria_4'),
(5,1,'Categoria_5'),
(5,2,'Categoria_5'),
(6,1,'Frituras'),
(7,1,'Cocina'),
(8,1,'menos'),
(9,1,'frituras');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `ID_Cliente` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Negocio` int(11) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID_Cliente`),
  KEY `ID_Negocio` (`ID_Negocio`),
  CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`ID_Negocio`) REFERENCES `negocio` (`ID_Negocio`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `cliente` VALUES
(1,2,'Virginia Luis Manuel Sierra','+99(5)0547168309'),
(2,1,'Cornelio Uriel Loera','1-012-856-1253'),
(3,2,'Raúl Abrego Ayala','(523)930-9273x768'),
(4,1,'Sr(a). Soledad Benavides','218-990-2850x3147'),
(5,2,'Dr. Fidel Ponce','891-651-0027'),
(6,1,'Omar Lucas Cabán','01533074217'),
(7,1,'Isabela Munguía Solorzano','671-571-7687x74664'),
(8,1,'Modesto Armendáriz Crespo','+05(4)1144916861'),
(9,2,'Gerónimo Homero Esquibel Sáenz','09592488554'),
(10,2,'Nadia Eugenio León','206-464-4951'),
(12,1,'rONLADINO','961531816'),
(13,1,'DVDDINO','961531816'),
(14,1,'Alexander Jiménez','9631421937'),
(15,1,'Juan Manuel Camacho Gómez','9612798816'),
(16,1,'Gabriel Samayoa','9612150544'),
(17,1,'Amorcito','9613645948'),
(18,1,'Gaby','9613142494');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `contiene`
--

DROP TABLE IF EXISTS `contiene`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contiene` (
  `ID_Venta` int(11) NOT NULL,
  `ID_Registro` int(11) NOT NULL,
  `Subtotal` decimal(10,5) DEFAULT NULL,
  `Cantidad` decimal(10,5) DEFAULT NULL,
  `Precio_Venta_Unitario` decimal(10,5) DEFAULT NULL,
  PRIMARY KEY (`ID_Venta`,`ID_Registro`),
  KEY `ID_Registro` (`ID_Registro`),
  CONSTRAINT `contiene_ibfk_1` FOREIGN KEY (`ID_Venta`) REFERENCES `venta` (`ID_Venta`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `contiene_ibfk_2` FOREIGN KEY (`ID_Registro`) REFERENCES `inventario` (`ID_Registro`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contiene`
--

LOCK TABLES `contiene` WRITE;
/*!40000 ALTER TABLE `contiene` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `contiene` VALUES
(1,3,93.75000,5.00000,18.75000),
(1,4,281.25000,15.00000,18.75000),
(11,3,NULL,5.00000,NULL),
(11,4,NULL,3.00000,NULL),
(12,3,37.50000,2.00000,18.75000),
(12,4,56.25000,3.00000,18.75000),
(16,3,37.50000,2.00000,18.75000),
(16,4,56.25000,3.00000,18.75000),
(17,3,37.50000,2.00000,18.75000),
(17,4,56.25000,3.00000,18.75000),
(18,3,37.50000,2.00000,18.75000),
(18,4,56.25000,3.00000,18.75000),
(20,3,NULL,2.00000,NULL),
(20,4,37.50000,2.00000,18.75000);
/*!40000 ALTER TABLE `contiene` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_contiene_ai
AFTER INSERT ON contiene
FOR EACH ROW
BEGIN
  DECLARE restante DECIMAL(19,4);
  DECLARE se DECIMAL(19,4);

  -- Tomamos la cantidad a restar y el stock actual de exhibición
  SET restante = NEW.Cantidad;
  SELECT Stock_Exhibicion
    INTO se
    FROM inventario
    WHERE ID_Registro = NEW.ID_Registro
    FOR UPDATE;

  IF se >= restante THEN
    -- Si hay suficiente en exhibición, resto todo ahí
    UPDATE inventario
      SET Stock_Exhibicion = se - restante
    WHERE ID_Registro = NEW.ID_Registro;
  ELSE
    -- Si se agota exhibición, lo pongo a 0 y resto el sobrante al almacén
    UPDATE inventario
      SET 
        Stock_Exhibicion = 0,
        Stock_Almacen = Stock_Almacen - (restante - se)
    WHERE ID_Registro = NEW.ID_Registro;
  END IF;
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
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_contiene_au
AFTER UPDATE ON contiene
FOR EACH ROW
BEGIN
  DECLARE diff DECIMAL(19,4);
  DECLARE se DECIMAL(19,4);
  -- Calculamos cuánto debemos restar (solo cuando la cantidad aumenta)
  SET diff = NEW.Cantidad - OLD.Cantidad;
  IF diff > 0 THEN
    SELECT Stock_Exhibicion
      INTO se
      FROM inventario
      WHERE ID_Registro = NEW.ID_Registro
      FOR UPDATE;

    IF se >= diff THEN
      -- Si hay suficiente en exhibición
      UPDATE inventario
        SET Stock_Exhibicion = se - diff
      WHERE ID_Registro = NEW.ID_Registro;
    ELSE
      -- Agotamos exhibición y resto el exceso al almacén
      UPDATE inventario
        SET 
          Stock_Exhibicion = 0,
          Stock_Almacen = Stock_Almacen - (diff - se)
      WHERE ID_Registro = NEW.ID_Registro;
    END IF;
  ELSE
    -- Si la cantidad disminuye (diff ≤ 0), devolvemos al exhibición
    UPDATE inventario
      SET Stock_Exhibicion = Stock_Exhibicion + ABS(diff)
    WHERE ID_Registro = NEW.ID_Registro;
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `corte_caja`
--

DROP TABLE IF EXISTS `corte_caja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `corte_caja` (
  `ID_Corte` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre_Usuario` varchar(50) DEFAULT NULL,
  `ID_Negocio` int(11) DEFAULT NULL,
  `Fecha_Inicio` date DEFAULT curdate(),
  `Fecha_Fin` date DEFAULT NULL,
  `Cantidad_inicial` decimal(10,5) DEFAULT NULL,
  `Total_Caja` decimal(10,5) DEFAULT NULL,
  PRIMARY KEY (`ID_Corte`),
  KEY `Nombre_Usuario` (`Nombre_Usuario`,`ID_Negocio`),
  CONSTRAINT `corte_caja_ibfk_1` FOREIGN KEY (`Nombre_Usuario`, `ID_Negocio`) REFERENCES `usuario` (`Nombre_Usuario`, `ID_Negocio`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `corte_caja`
--

LOCK TABLES `corte_caja` WRITE;
/*!40000 ALTER TABLE `corte_caja` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `corte_caja` VALUES
(1,'user_1_1',1,'2025-07-09','2025-07-09',NULL,0.00000),
(2,'user_2_1',2,'2025-07-03','2025-07-03',NULL,0.00000),
(3,'user_1_1',1,'2025-07-04','2025-07-04',NULL,0.00000),
(4,'user_2_1',2,'2025-07-01','2025-07-01',NULL,0.00000),
(5,'user_2_1',2,'2025-07-04','2025-07-04',NULL,0.00000),
(6,'user_2_1',2,'2025-07-06','2025-07-06',NULL,0.00000),
(7,'user_1_1',1,'2025-07-05','2025-07-05',NULL,0.00000),
(8,'user_2_1',2,'2025-07-02','2025-07-02',NULL,0.00000),
(9,'user_2_1',2,'2025-07-08','2025-07-08',NULL,0.00000),
(10,'user_1_1',1,'2025-07-04','2025-07-20',NULL,330.00000),
(11,'user_1_1',1,NULL,NULL,1000.50000,NULL),
(12,'user_1_1',1,'2025-07-20','2025-07-20',1000.50000,330.00000);
/*!40000 ALTER TABLE `corte_caja` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `envase`
--

DROP TABLE IF EXISTS `envase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `envase` (
  `ID_Envase` int(11) NOT NULL AUTO_INCREMENT,
  `Tipo` varchar(50) DEFAULT NULL,
  `ID_Negocio` int(11) NOT NULL,
  PRIMARY KEY (`ID_Envase`,`ID_Negocio`),
  KEY `ID_Negocio` (`ID_Negocio`),
  CONSTRAINT `envase_ibfk_1` FOREIGN KEY (`ID_Negocio`) REFERENCES `negocio` (`ID_Negocio`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `envase`
--

LOCK TABLES `envase` WRITE;
/*!40000 ALTER TABLE `envase` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `envase` VALUES
(1,'Envase_1',1),
(1,'Envase_1',2),
(2,'Envase_2',1),
(2,'Envase_2',2),
(3,'Envase_3',1),
(3,'Envase_3',2),
(4,'Envase_4',1),
(4,'Envase_4',2),
(5,'Envase_5',1),
(5,'Envase_5',2),
(6,'Bolsa',1),
(7,'Rollo',1),
(8,'tampoco',1),
(9,'bolsa',1);
/*!40000 ALTER TABLE `envase` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `ID_Registro` int(11) NOT NULL AUTO_INCREMENT,
  `Codigo_Prod` varchar(20) DEFAULT NULL,
  `ID_Negocio` int(11) DEFAULT NULL,
  `Nombre_Usuario` varchar(50) DEFAULT NULL,
  `Stock_Almacen` int(11) DEFAULT NULL,
  `Stock_Exhibicion` int(11) DEFAULT NULL,
  `Stock_Min` int(11) DEFAULT NULL,
  `Fecha_CAD` date DEFAULT NULL,
  `Precio_Compra` decimal(10,5) DEFAULT NULL,
  `Fecha_Entrada` datetime DEFAULT current_timestamp(),
  `Fecha_Salida` datetime DEFAULT NULL,
  `Margen_Ganancia` decimal(10,5) DEFAULT NULL,
  PRIMARY KEY (`ID_Registro`),
  KEY `Nombre_Usuario` (`Nombre_Usuario`,`ID_Negocio`),
  KEY `inventario_ibfk_1` (`Codigo_Prod`,`ID_Negocio`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`Codigo_Prod`, `ID_Negocio`) REFERENCES `producto` (`Codigo_Prod`, `ID_Negocio`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inventario_ibfk_2` FOREIGN KEY (`Nombre_Usuario`, `ID_Negocio`) REFERENCES `usuario` (`Nombre_Usuario`, `ID_Negocio`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_stock_nonneg` CHECK (`Stock_Exhibicion` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `inventario` VALUES
(3,'1234567',1,'user_1_1',43,0,5,'2023-12-30',15.00000,'2023-01-15 00:00:00',NULL,25.00000),
(4,'12345678945',1,'user_1_1',40,0,5,'2023-10-15',15.00000,'2023-01-15 00:00:00',NULL,25.00000);
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_actualiza_precio_venta_insert
AFTER INSERT ON Inventario
FOR EACH ROW
BEGIN
  UPDATE Producto
  SET Precio_Venta_Actual = NEW.Precio_Compra * (1 + NEW.Margen_Ganancia / 100)
  WHERE Codigo_Prod = NEW.Codigo_Prod AND ID_Negocio = NEW.ID_Negocio;
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
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_actualiza_precio_venta_update
AFTER UPDATE ON Inventario
FOR EACH ROW
BEGIN
  UPDATE Producto
  SET Precio_Venta_Actual = NEW.Precio_Compra * (1 + NEW.Margen_Ganancia / 100)
  WHERE Codigo_Prod = NEW.Codigo_Prod AND ID_Negocio = NEW.ID_Negocio;
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
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_actualiza_fecha_salida
AFTER UPDATE ON Inventario
FOR EACH ROW
BEGIN
  IF NEW.Stock_Almacen = 0 AND NEW.Stock_Exhibicion = 0 AND OLD.Fecha_Salida IS NULL THEN
    UPDATE Inventario
    SET Fecha_Salida = NOW()
    WHERE ID_Registro = NEW.ID_Registro;
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `marca`
--

DROP TABLE IF EXISTS `marca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `marca` (
  `ID_Marca` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) DEFAULT NULL,
  `ID_Negocio` int(11) NOT NULL,
  PRIMARY KEY (`ID_Marca`,`ID_Negocio`),
  KEY `ID_Negocio` (`ID_Negocio`),
  CONSTRAINT `marca_ibfk_1` FOREIGN KEY (`ID_Negocio`) REFERENCES `negocio` (`ID_Negocio`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marca`
--

LOCK TABLES `marca` WRITE;
/*!40000 ALTER TABLE `marca` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `marca` VALUES
(1,'Marca_1',1),
(1,'Marca_1',2),
(2,'Marca_2',1),
(2,'Marca_2',2),
(3,'Marca_3',1),
(3,'Marca_3',2),
(4,'Marca_4',1),
(4,'Marca_4',2),
(5,'Marca_5',1),
(5,'Marca_5',2),
(6,'Sabritas',1),
(7,'Moctezuma',1),
(8,'nose',1);
/*!40000 ALTER TABLE `marca` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `negocio`
--

DROP TABLE IF EXISTS `negocio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `negocio` (
  `ID_Negocio` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre_negocio` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_Negocio`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `negocio`
--

LOCK TABLES `negocio` WRITE;
/*!40000 ALTER TABLE `negocio` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `negocio` VALUES
(1,'Negocio_1'),
(2,'Negocio_2'),
(3,'Mi Negocio de Prueba'),
(4,'Negocio4');
/*!40000 ALTER TABLE `negocio` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `Codigo_Prod` varchar(20) NOT NULL,
  `ID_Negocio` int(11) NOT NULL,
  `ID_Envase` int(11) DEFAULT NULL,
  `ID_Marca` int(11) DEFAULT NULL,
  `ID_Categoria` int(11) DEFAULT NULL,
  `Producto` varchar(100) DEFAULT NULL,
  `Variedad` varchar(100) DEFAULT NULL,
  `Cont_Neto` varchar(50) DEFAULT NULL,
  `Medida` varchar(20) DEFAULT NULL,
  `Precio_Venta_Actual` decimal(10,5) DEFAULT NULL,
  PRIMARY KEY (`Codigo_Prod`,`ID_Negocio`),
  KEY `ID_Negocio` (`ID_Negocio`),
  KEY `ID_Envase` (`ID_Envase`,`ID_Negocio`),
  KEY `ID_Marca` (`ID_Marca`,`ID_Negocio`),
  KEY `ID_Categoria` (`ID_Categoria`,`ID_Negocio`),
  CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`ID_Negocio`) REFERENCES `negocio` (`ID_Negocio`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`ID_Envase`, `ID_Negocio`) REFERENCES `envase` (`ID_Envase`, `ID_Negocio`),
  CONSTRAINT `producto_ibfk_3` FOREIGN KEY (`ID_Marca`, `ID_Negocio`) REFERENCES `marca` (`ID_Marca`, `ID_Negocio`),
  CONSTRAINT `producto_ibfk_4` FOREIGN KEY (`ID_Categoria`, `ID_Negocio`) REFERENCES `categoria` (`ID_Categoria`, `ID_Negocio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `producto` VALUES
('00000000601',1,8,8,8,'ProductoPrueba','Uypadre','500.0','m',34.50000),
('1234567',1,9,6,9,'Ruffles MegaCrunch','Jalapeño','45.0','kg',20.00000),
('12345678945',1,2,1,3,'Coca Cola 600ml','Regular','600.0','Ml',18.75000),
('8731831',1,1,7,7,'Pimienta','Negra gorda','50.0','g',10.00000),
('PROD-001',1,2,1,3,'Coca Cola 500ml','Regular','500.0','ml',21.00000);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `ID_Ticket` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Venta` int(11) NOT NULL,
  `ID_Negocio` int(11) NOT NULL,
  `URL` varchar(255) NOT NULL,
  PRIMARY KEY (`ID_Ticket`),
  UNIQUE KEY `ID_Venta` (`ID_Venta`),
  KEY `ID_Negocio` (`ID_Negocio`),
  CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`ID_Venta`) REFERENCES `venta` (`ID_Venta`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`ID_Negocio`) REFERENCES `negocio` (`ID_Negocio`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `ticket` VALUES
(1,20,1,'https://clinktickets.s3.amazonaws.com/tickets%2Fticket_1_20250719_211441.pdf');
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `Nombre_Usuario` varchar(50) NOT NULL,
  `ID_Negocio` int(11) NOT NULL,
  `crea_Nombre_Usuario` varchar(50) DEFAULT NULL,
  `Correo` varchar(100) DEFAULT NULL,
  `Rol` enum('Admin','Empleado') NOT NULL,
  `Contrasena` varchar(100) DEFAULT NULL,
  `Calle` varchar(100) DEFAULT NULL,
  `Colonia` varchar(100) DEFAULT NULL,
  `Codigo_Postal` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`Nombre_Usuario`,`ID_Negocio`),
  KEY `ID_Negocio` (`ID_Negocio`),
  KEY `crea_Nombre_Usuario` (`crea_Nombre_Usuario`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`ID_Negocio`) REFERENCES `negocio` (`ID_Negocio`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`crea_Nombre_Usuario`) REFERENCES `usuario` (`Nombre_Usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `usuario` VALUES
('1221',1,NULL,'vadvadv','Empleado','vdbrw','advadv','dvadvrq','2387'),
('Juanito alcachofa',1,'user_1_1','anona@gmail.com','Admin','advadvadv','4ta Pte.','Terán','29050'),
('nuevo_empleado',1,'user_1_1','vadvadv','Empleado','vdbrw','advadv','dvadvrq','2387'),
('pruebaxd',1,NULL,'vadvadv','Empleado','vdbrw','advadv','dvadvrq','2387'),
('user_1_1',1,'user_1_1','mfeliciano@sepulveda.info','Admin','K&hM9ECvN5','Corredor Oaxaca','San Leonel de la Montaña','36154'),
('user_1_2',1,'user_1_2','olivodolores@yahoo.com','Admin','*b3HJ6oy$3','Andador Guanajuato','San Itzel de la Montaña','66580-8695'),
('user_2_1',2,'user_2_1','aldolugo@santacruz-almanza.org','Admin','Q19%2hFs+8','Continuación Sur Bétancourt','Vieja Bélgica','68407-0470'),
('user_2_2',2,'user_2_2','espinosaraquel@velazquez.info','Admin','k*2SVryko(','Retorno San Luis Potosí','Vieja Micronesia','43250'),
('vdda',1,'user_1_1','vadvadv','Empleado','vdbrw','advadv','dvadvrq','2387'),
('wqq1',1,NULL,'vadvadv','Empleado','vdbrw','advadv','dvadvrq','2387');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `venta`
--

DROP TABLE IF EXISTS `venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `venta` (
  `ID_Venta` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Cliente` int(11) DEFAULT NULL,
  `ID_Corte` int(11) DEFAULT NULL,
  `Nombre_Usuario` varchar(50) DEFAULT NULL,
  `ID_Negocio` int(11) DEFAULT NULL,
  `Fecha_Venta` datetime DEFAULT current_timestamp(),
  `Total` decimal(10,5) DEFAULT NULL,
  PRIMARY KEY (`ID_Venta`),
  KEY `ID_Corte` (`ID_Corte`),
  KEY `venta_ibfk_3` (`Nombre_Usuario`,`ID_Negocio`),
  KEY `venta_ibfk_1` (`ID_Cliente`),
  CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`ID_Cliente`) REFERENCES `cliente` (`ID_Cliente`) ON UPDATE CASCADE,
  CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`ID_Corte`) REFERENCES `corte_caja` (`ID_Corte`),
  CONSTRAINT `venta_ibfk_3` FOREIGN KEY (`Nombre_Usuario`, `ID_Negocio`) REFERENCES `usuario` (`Nombre_Usuario`, `ID_Negocio`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta`
--

LOCK TABLES `venta` WRITE;
/*!40000 ALTER TABLE `venta` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `venta` VALUES
(1,7,1,'user_1_1',1,'2025-07-11 15:09:47',48.75000),
(4,4,1,'user_1_1',1,'2025-07-11 15:09:47',48.75000),
(6,2,1,'user_1_1',1,'2025-07-11 15:09:47',97.50000),
(7,2,1,'user_1_1',1,'2025-07-11 15:09:47',48.75000),
(10,7,1,'user_1_1',1,'2025-07-11 15:09:47',48.75000),
(11,NULL,NULL,'user_1_1',1,'2025-07-18 02:24:42',0.00000),
(12,NULL,NULL,'user_1_1',1,'2025-07-18 23:00:20',NULL),
(16,NULL,NULL,'user_1_1',1,'2025-07-18 23:21:30',NULL),
(17,NULL,NULL,'user_1_1',1,'2025-07-18 23:23:30',NULL),
(18,3,NULL,'user_1_1',1,'2025-07-18 23:26:25',NULL),
(20,NULL,NULL,'user_1_1',1,'2025-07-19 11:02:27',37.50000);
/*!40000 ALTER TABLE `venta` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-07-20 19:50:46
