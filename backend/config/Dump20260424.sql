CREATE DATABASE  IF NOT EXISTS `noh_hospital` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `noh_hospital`;
-- MySQL dump 10.13  Distrib 8.0.44, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: noh_hospital
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `doctor_id` int DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `patient_id` int DEFAULT NULL,
  `status` enum('pending','confirmed','in_progress','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `cancel_reason` text COLLATE utf8mb4_unicode_ci,
  `confirmed_at` datetime DEFAULT NULL,
  `confirmed_by` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Ghi chú từ staff',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `idx_appt_phone` (`phone`),
  KEY `idx_appt_date` (`appointment_date`),
  KEY `idx_appt_status` (`status`),
  KEY `idx_appt_patient_id` (`patient_id`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,'Nguyễn Văn An','0827762098','patient1@gmail.com','Khoa Tai thần kinh',5,'2026-03-09','08:30:00','Chảy máu mũi tái phát',1,'cancelled','Không có lý do',NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-14 09:01:38'),(2,'Trần Thị Bích','0326424888','patient2@gmail.com','Trung tâm Ung Bướu và Phẫu thuật Đầu-Cổ',15,'2026-04-10','15:30:00','Nghe kém dần 2 bên tai',2,'cancelled','Không có lý do',NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-14 09:01:36'),(3,'Lê Hoàng Cường','0826981320','patient3@gmail.com','Khoa Mũi Xoang',8,'2026-05-02','07:30:00','Đau họng kéo dài, khó nuốt, sốt nhẹ',3,'cancelled','Không có lý do',NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-14 09:01:33'),(4,'Phạm Thị Dung','0355844006','patient4@gmail.com','Khoa Tai Mũi Họng Trẻ em',2,'2026-04-19','15:00:00','Sưng hạch cổ bên phải',4,'cancelled','Không có lý do',NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-14 09:01:29'),(5,'Hoàng Văn Em','0792183948','patient5@gmail.com','Khoa Mũi Xoang',3,'2026-04-07','10:30:00','Đau họng kéo dài, khó nuốt, sốt nhẹ',5,'cancelled','Không có lý do',NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-14 09:01:31'),(6,'Vũ Thị Phương','0938730938','patient6@gmail.com','Trung tâm Ung Bướu và Phẫu thuật Đầu-Cổ',2,'2026-05-26','09:00:00','Đau họng kéo dài, khó nuốt, sốt nhẹ',6,'confirmed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(7,'Đỗ Minh Quang','0328479773','patient7@gmail.com','Khoa Tai',16,'2026-05-01','09:00:00','Khàn tiếng 2 tuần, không cải thiện',7,'completed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-14 09:18:39'),(8,'Bùi Thị Hoa','0782445084','patient8@gmail.com','Khoa Gây mê hồi sức',16,'2026-04-21','08:00:00','Viêm xoang tái phát nhiều đợt',8,'completed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-14 09:37:32'),(9,'Ngô Đức Hùng','0771134619','patient9@gmail.com','Khoa Phẫu thuật Tạo hình Thẩm Mỹ',19,'2026-03-11','15:00:00','Đau tai phải, chảy mủ tai',9,'confirmed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(10,'Dương Thị Kim','0395322332','patient10@gmail.com','Khoa Tai thần kinh',14,'2026-04-20','14:00:00','Chảy máu mũi tái phát',10,'confirmed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(11,'Lý Văn Long','0708064106','patient11@gmail.com','Khoa Mũi Xoang',13,'2026-05-29','07:30:00','Nghẹt mũi mạn tính, chảy dịch mũi sau',11,'confirmed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(12,'Trịnh Thị Mai','0375706823','patient12@gmail.com','Khoa Cấp cứu',19,'2026-05-02','14:30:00','Ngủ ngáy to, ngưng thở khi ngủ',12,'confirmed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(13,'Đinh Văn Nam','0838705046','patient13@gmail.com','Khoa Thính - Thanh học',6,'2026-05-25','08:30:00','Đau họng kéo dài, khó nuốt, sốt nhẹ',13,'completed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(14,'Cao Thị Oanh','0332844825','patient14@gmail.com','Khoa Tai',18,'2026-04-15','08:30:00','Ngủ ngáy to, ngưng thở khi ngủ',14,'completed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(15,'Tạ Văn Phong','0707571433','patient15@gmail.com','Khoa Tai Mũi Họng Trẻ em',12,'2026-03-31','14:00:00','Ho kéo dài, đau rát cổ họng',15,'completed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(16,'Hồ Thị Quỳnh','0325274650','patient16@gmail.com','Khoa Khám bệnh',20,'2026-05-03','14:00:00','Sưng hạch cổ bên phải',16,'completed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(17,'Lương Văn Rạng','0894267908','patient17@gmail.com','Trung tâm Ung Bướu và Phẫu thuật Đầu-Cổ',7,'2026-05-25','08:00:00','Ho kéo dài, đau rát cổ họng',17,'completed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(18,'Phan Thị Sương','0775212012','patient18@gmail.com','Khoa Khám bệnh',2,'2026-03-14','14:00:00','Khàn tiếng 2 tuần, không cải thiện',18,'completed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(19,'Chu Văn Thắng','0967549505','patient19@gmail.com','Khoa Họng - Thanh quản',7,'2026-03-31','08:00:00','Đau tai phải, chảy mủ tai',19,'completed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(20,'Mai Thị Uyên','0361745216','patient20@gmail.com','Trung tâm Ung Bướu và Phẫu thuật Đầu-Cổ',10,'2026-05-18','08:00:00','Khàn tiếng 2 tuần, không cải thiện',20,'completed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(21,'Nguyễn Đức Việt','0384830995','patient21@gmail.com','Khoa Tai Mũi Họng Trẻ em',17,'2026-04-01','09:00:00','Sưng hạch cổ bên phải',21,'completed',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-24 09:51:44'),(22,'Trần Thị Xuân','0868573389','patient22@gmail.com','Khoa Cấp cứu',4,'2026-05-21','10:00:00','Chảy máu mũi tái phát',22,'in_progress',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(23,'Lê Văn Yên','0587192459','patient23@gmail.com','Khoa Thính - Thanh học',15,'2026-05-10','09:30:00','Đau họng kéo dài, khó nuốt, sốt nhẹ',23,'in_progress',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(24,'Phạm Thị Ánh','0386443949','patient24@gmail.com','Khoa Tai',12,'2026-03-19','10:00:00','Sưng hạch cổ bên phải',24,'in_progress',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(25,'Hoàng Minh Bảo','0817106988','patient25@gmail.com','Khoa Khám bệnh',18,'2026-03-23','10:30:00','Nghẹt mũi mạn tính, chảy dịch mũi sau',25,'in_progress',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(26,'Nguyễn Văn An','0947048798','patient1@gmail.com','Trung tâm Ung Bướu và Phẫu thuật Đầu-Cổ',19,'2026-04-10','07:30:00','Nghe kém dần 2 bên tai',1,'cancelled',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(27,'Trần Thị Bích','0326917228','patient2@gmail.com','Khoa Nội soi',3,'2026-03-17','14:30:00','Ù tai trái, chóng mặt khi thay đổi tư thế',2,'cancelled',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(28,'Lê Hoàng Cường','0838073225','patient3@gmail.com','Khoa Tai thần kinh',8,'2026-03-27','14:00:00','Chóng mặt xoay tròn đột ngột',3,'cancelled',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(29,'Phạm Thị Dung','0587665972','patient4@gmail.com','Khoa Mũi Xoang',5,'2026-04-19','15:00:00','Viêm xoang tái phát nhiều đợt',4,'cancelled',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(30,'Hoàng Văn Em','0395055429','patient5@gmail.com','Khoa Khám bệnh',6,'2026-04-01','08:30:00','Ù tai trái, chóng mặt khi thay đổi tư thế',5,'cancelled',NULL,NULL,NULL,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(31,'Nguyễn Văn An','0373432737','patient1@gmail.com','khoa-tai',NULL,'2026-04-08',NULL,NULL,1,'cancelled','Bệnh nhân tự hủy','2026-04-14 15:33:24',1,NULL,'2026-04-14 08:18:15','2026-04-14 08:39:00'),(32,'Nguyễn Văn An','0373432737','patient1@gmail.com','Khoa Khám bệnh',9,'2026-04-10','09:30:00',NULL,1,'cancelled','Không có lý do',NULL,NULL,NULL,'2026-04-14 08:39:12','2026-04-14 09:01:26'),(33,'Nguyễn Văn An','0373432737','patient1@gmail.com','Khoa Tai thần kinh',3,'2026-04-16','09:30:00',NULL,1,'cancelled','Không có lý do',NULL,NULL,NULL,'2026-04-14 08:41:12','2026-04-14 09:01:24'),(34,'Nguyễn Văn An','0373432737','patient1@gmail.com','Khoa Phẫu thuật Tạo hình Thẩm Mỹ',16,'2026-04-16','09:00:00',NULL,1,'cancelled','Không có lý do',NULL,NULL,NULL,'2026-04-14 08:52:40','2026-04-14 09:01:21'),(35,'Nguyễn Văn An','0373432737','patient1@gmail.com','Khoa Tai Mũi Họng Trẻ em',NULL,'2026-04-24','09:30:00',NULL,1,'cancelled','Không có lý do',NULL,NULL,NULL,'2026-04-14 08:55:49','2026-04-14 09:01:18'),(36,'Nguyễn Văn An','0373432737','patient1@gmail.com','Khoa Tai thần kinh',8,'2026-04-18','09:30:00',NULL,1,'completed',NULL,'2026-04-14 16:46:15',1,NULL,'2026-04-14 09:46:06','2026-04-14 09:47:55'),(37,'Mai Nghiaa','0975842134','thunghiem@gmail.com','Khoa Tai',11,'2026-04-25','08:30:00','',NULL,'in_progress',NULL,'2026-04-24 15:41:16',1,NULL,'2026-04-24 04:58:40','2026-04-24 08:59:20'),(38,'Thử nghiệm','0985746375','phieu12131@gmail.com','Khoa Phẫu thuật Tạo hình Thẩm Mỹ',16,'2026-04-26','09:00:00','',NULL,'pending',NULL,NULL,NULL,NULL,'2026-04-24 09:08:05','2026-04-24 09:08:05'),(39,'ádasd','0975802159','nghia.mt1505@gmail.com','Khoa Họng - Thanh quản',17,'2026-04-25','08:30:00','',NULL,'pending',NULL,NULL,NULL,NULL,'2026-04-24 09:50:06','2026-04-24 09:50:06');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `replied_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contact_read` (`is_read`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES (1,'Nguyễn Văn Hải','hai.nv@gmail.com','0912345678','Hỏi về lịch khám','Tôi muốn hỏi lịch khám bác sĩ Phạm Tuấn Cảnh vào thứ 7 có không?',1,NULL,'2026-04-13 17:59:07'),(2,'Trần Thị Hồng','hong.tt@gmail.com','0987654321','Thắc mắc về bảo hiểm','Bệnh viện có nhận BHYT tuyến tỉnh không? Tôi ở Hải Phòng muốn lên khám.',0,NULL,'2026-04-13 17:59:07'),(3,'Lê Văn Tùng','tung.lv@gmail.com','0356789012','Xin kết quả xét nghiệm','Tôi khám ngày 10/3 mã bệnh nhân BN2026-0345, xin cho tôi kết quả xét nghiệm.',0,NULL,'2026-04-13 17:59:07'),(4,'Phạm Thị Nga','nga.pt@gmail.com','0823456789','Góp ý dịch vụ','Phòng khám rất sạch sẽ nhưng thời gian chờ hơi lâu. Mong BV cải thiện.',1,NULL,'2026-04-13 17:59:07'),(5,'Hoàng Minh Tuấn','tuan.hm@gmail.com','0765432198','Đặt lịch khám cho con','Con tôi 5 tuổi bị viêm amidan tái phát, muốn đặt lịch khám khoa TMH trẻ em.',0,NULL,'2026-04-13 17:59:07');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('lam-sang','can-lam-sang') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'lam-sang',
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `head_doctor` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_dept_type` (`type`),
  KEY `idx_dept_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Khoa Họng - Thanh quản','khoa-hong-thanh-quan','lam-sang','Khám chữa bệnh, điều trị bằng phương pháp nội khoa và ngoại khoa các bệnh lý vùng họng – thanh quản. Phẫu thuật nội soi họng thanh quản, cắt amidan, nạo VA.',NULL,'024.3825.3351',NULL,1,1,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(2,'Khoa Tai','khoa-tai','lam-sang','Khám, chữa bệnh chuyên sâu về tai, tai thần kinh, nền sọ ở tuyến cao nhất. Vi phẫu thuật tai, phẫu thuật cấy ốc tai điện tử.',NULL,'024.3825.3352',NULL,1,2,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(3,'Khoa Khám bệnh','khoa-kham-benh','lam-sang','Khám, chẩn đoán bệnh và tư vấn điều trị cho người bệnh. Tiếp nhận bệnh nhân ngoại trú và chuyển tuyến.',NULL,'024.3825.3353',NULL,1,3,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(4,'Khoa Gây mê hồi sức','khoa-gay-me-hoi-suc','lam-sang','Gây mê hồi sức cho các phẫu thuật cấp cứu chuyên khoa TMH. Hồi sức sau mổ và chăm sóc tích cực.',NULL,'024.3825.3354',NULL,1,4,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(5,'Khoa Cấp cứu','khoa-cap-cuu','lam-sang','Điều trị người bệnh nặng, nguy hiểm chức năng sống về TMH. Tiếp nhận và xử trí cấp cứu 24/7.',NULL,'024.3825.3355',NULL,1,5,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(6,'Trung tâm Ung Bướu và Phẫu thuật Đầu-Cổ','trung-tam-ung-buou-va-phau-thuat-dau-co','lam-sang','Điều trị bệnh lý TMH và chuyên sâu khối u đầu cổ. Phẫu thuật, xạ trị, hóa trị ung thư vùng đầu cổ.',NULL,'024.3825.3356',NULL,1,6,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(7,'Khoa Tai Mũi Họng Trẻ em','khoa-tai-mui-hong-tre-em','lam-sang','Khám và điều trị tất cả các bệnh lý chuyên khoa TMH trẻ em. Phẫu thuật nội soi cho trẻ nhỏ.',NULL,'024.3825.3357',NULL,1,7,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(8,'Khoa Tai thần kinh','khoa-tai-than-kinh','lam-sang','Khám chữa bệnh chủ yếu về tai, tai-thần kinh. Chẩn đoán và điều trị rối loạn tiền đình, ù tai.',NULL,'024.3825.3358',NULL,1,8,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(9,'Khoa Mũi Xoang','khoa-mui-xoang','lam-sang','Khám chẩn đoán, tư vấn và điều trị các bệnh lý về mũi xoang. Phẫu thuật nội soi mũi xoang.',NULL,'024.3825.3359',NULL,1,9,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(10,'Khoa Thính - Thanh học','khoa-thinh-thanh-hoc','lam-sang','Khám, chữa bệnh tai mũi họng và tiền đình. Đo thính lực, đánh giá chức năng nghe.',NULL,'024.3825.3360',NULL,1,10,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(11,'Khoa Phẫu thuật Tạo hình Thẩm Mỹ','khoa-phau-thuat-tao-hinh-tham-my','lam-sang','Khám và điều trị các trường hợp cần tạo hình, phẫu thuật thẩm mỹ vùng đầu mặt cổ.',NULL,'024.3825.3361',NULL,1,11,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(12,'Khoa Nội soi','khoa-noi-soi','lam-sang','Khám, chẩn đoán, điều trị bệnh về TMH bằng nội soi. Nội soi tai mũi họng, thanh quản.',NULL,'024.3825.3362',NULL,1,12,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(13,'Khoa Xét nghiệm Tổng hợp','khoa-xet-nghiem-tong-hop','can-lam-sang','Xét nghiệm về bệnh học, tế bào học. Xét nghiệm huyết học, sinh hoá, vi sinh.',NULL,'024.3825.3363',NULL,1,13,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(14,'Khoa Kiểm soát nhiễm khuẩn','khoa-kiem-soat-nhiem-khuan','can-lam-sang','Giám sát công tác kiểm soát nhiễm khuẩn trong toàn bệnh viện.',NULL,'024.3825.3364',NULL,1,14,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(15,'Khoa Chẩn đoán hình ảnh','khoa-chan-doan-hinh-anh','can-lam-sang','Thực hiện kỹ thuật chẩn đoán hình ảnh cho chuyên khoa. CT-Scanner, MRI, X-quang.',NULL,'024.3825.3365',NULL,1,15,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(16,'Khoa Dược','khoa-duoc','can-lam-sang','Tổ chức, triển khai hoạt động của Hội đồng thuốc và điều trị. Quản lý và cấp phát thuốc.',NULL,'024.3825.3366',NULL,1,16,'2026-04-13 17:59:06','2026-04-13 17:59:06'),(17,'Khoa Dinh dưỡng','khoa-dinh-duong','can-lam-sang','Tư vấn và điều trị bằng chế độ dinh dưỡng cho người bệnh nội trú và ngoại trú.',NULL,'024.3825.3367',NULL,1,17,'2026-04-13 17:59:06','2026-04-13 17:59:06');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_schedules`
--

DROP TABLE IF EXISTS `doctor_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `day_of_week` tinyint NOT NULL COMMENT '1=Mon, 7=Sun',
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `max_patients` int DEFAULT '20',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_schedule_doctor_day` (`doctor_id`,`day_of_week`),
  CONSTRAINT `doctor_schedules_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_schedules`
--

LOCK TABLES `doctor_schedules` WRITE;
/*!40000 ALTER TABLE `doctor_schedules` DISABLE KEYS */;
INSERT INTO `doctor_schedules` VALUES (1,1,3,'07:30:00','11:30:00',18,1),(2,1,3,'13:30:00','17:00:00',18,1),(3,1,6,'07:30:00','11:30:00',19,1),(4,1,6,'13:30:00','17:00:00',10,1),(5,1,5,'07:30:00','11:30:00',21,1),(6,1,5,'13:30:00','17:00:00',18,1),(7,2,2,'07:30:00','11:30:00',18,1),(8,2,2,'13:30:00','17:00:00',19,1),(9,2,1,'07:30:00','11:30:00',23,1),(10,2,1,'13:30:00','17:00:00',11,1),(11,2,5,'07:30:00','11:30:00',15,1),(12,3,6,'07:30:00','11:30:00',18,1),(13,3,4,'07:30:00','11:30:00',16,1),(14,4,6,'07:30:00','11:30:00',15,1),(15,4,6,'13:30:00','17:00:00',12,1),(16,4,3,'07:30:00','11:30:00',16,1),(17,4,2,'07:30:00','11:30:00',19,1),(18,4,2,'13:30:00','17:00:00',16,1),(19,4,4,'07:30:00','11:30:00',17,1),(20,4,5,'07:30:00','11:30:00',20,1),(21,5,5,'07:30:00','11:30:00',24,1),(22,5,5,'13:30:00','17:00:00',10,1),(23,5,2,'13:30:00','17:00:00',18,1),(24,5,1,'07:30:00','11:30:00',15,1),(25,5,4,'13:30:00','17:00:00',13,1),(26,5,3,'07:30:00','11:30:00',21,1),(27,6,2,'07:30:00','11:30:00',23,1),(28,6,2,'13:30:00','17:00:00',12,1),(29,6,1,'07:30:00','11:30:00',21,1),(30,6,4,'13:30:00','17:00:00',13,1),(31,7,3,'07:30:00','11:30:00',20,1),(32,7,3,'13:30:00','17:00:00',12,1),(33,7,2,'07:30:00','11:30:00',15,1),(34,7,2,'13:30:00','17:00:00',19,1),(35,7,6,'07:30:00','11:30:00',18,1),(36,7,6,'13:30:00','17:00:00',13,1),(37,8,4,'07:30:00','11:30:00',17,1),(38,8,5,'07:30:00','11:30:00',23,1),(39,8,5,'13:30:00','17:00:00',14,1),(40,8,1,'07:30:00','11:30:00',16,1),(41,8,1,'13:30:00','17:00:00',19,1),(42,9,4,'07:30:00','11:30:00',21,1),(43,9,4,'13:30:00','17:00:00',14,1),(44,9,6,'07:30:00','11:30:00',16,1),(45,10,1,'07:30:00','11:30:00',20,1),(46,10,1,'13:30:00','17:00:00',15,1),(47,10,3,'13:30:00','17:00:00',13,1),(48,10,2,'13:30:00','17:00:00',17,1),(49,10,4,'13:30:00','17:00:00',11,1),(50,11,1,'07:30:00','11:30:00',15,1),(51,11,3,'07:30:00','11:30:00',17,1),(52,11,4,'07:30:00','11:30:00',21,1),(53,11,4,'13:30:00','17:00:00',10,1),(54,11,5,'07:30:00','11:30:00',22,1),(55,12,4,'07:30:00','11:30:00',23,1),(56,12,5,'07:30:00','11:30:00',21,1),(57,12,5,'13:30:00','17:00:00',12,1),(58,12,3,'07:30:00','11:30:00',18,1),(59,13,1,'07:30:00','11:30:00',20,1),(60,13,1,'13:30:00','17:00:00',11,1),(61,13,5,'13:30:00','17:00:00',14,1),(62,13,2,'07:30:00','11:30:00',22,1),(63,13,2,'13:30:00','17:00:00',12,1),(64,13,6,'07:30:00','11:30:00',24,1),(65,13,6,'13:30:00','17:00:00',18,1),(66,14,3,'07:30:00','11:30:00',23,1),(67,14,3,'13:30:00','17:00:00',12,1),(68,14,4,'07:30:00','11:30:00',17,1),(69,14,5,'07:30:00','11:30:00',16,1),(70,15,3,'13:30:00','17:00:00',14,1),(71,15,4,'13:30:00','17:00:00',14,1),(72,15,2,'07:30:00','11:30:00',21,1),(73,15,2,'13:30:00','17:00:00',12,1),(74,16,6,'07:30:00','11:30:00',19,1),(75,16,4,'07:30:00','11:30:00',22,1),(76,16,4,'13:30:00','17:00:00',18,1),(77,16,1,'07:30:00','11:30:00',23,1),(78,16,1,'13:30:00','17:00:00',15,1),(79,16,2,'07:30:00','11:30:00',19,1),(80,16,2,'13:30:00','17:00:00',12,1),(81,16,5,'13:30:00','17:00:00',13,1),(82,17,1,'07:30:00','11:30:00',16,1),(83,17,2,'07:30:00','11:30:00',20,1),(84,17,2,'13:30:00','17:00:00',15,1),(85,17,3,'07:30:00','11:30:00',24,1),(86,18,5,'07:30:00','11:30:00',24,1),(87,18,5,'13:30:00','17:00:00',17,1),(88,18,6,'07:30:00','11:30:00',22,1),(89,18,2,'13:30:00','17:00:00',12,1),(90,19,5,'13:30:00','17:00:00',14,1),(91,19,6,'07:30:00','11:30:00',23,1),(92,19,6,'13:30:00','17:00:00',12,1),(93,20,6,'07:30:00','11:30:00',18,1),(94,20,3,'07:30:00','11:30:00',17,1),(95,20,3,'13:30:00','17:00:00',10,1),(96,20,4,'07:30:00','11:30:00',24,1),(97,20,4,'13:30:00','17:00:00',17,1);
/*!40000 ALTER TABLE `doctor_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'PGS-TS, BSCKII, etc.',
  `specialty` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experience` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `education` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_doctor_department` (`department_id`),
  KEY `idx_doctor_slug` (`slug`),
  CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,'PGS.TS. Phạm Tuấn Cảnh','pgsts-pham-tuan-canh','Phó Giáo sư - Tiến sĩ','Phẫu thuật tạo hình TMH',11,NULL,'30+ năm','Đại học Y Hà Nội',NULL,'pgsts.pham.tuan.canh@noh.vn','0855855469',0,1,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(2,'TTƯT.TS. Lê Anh Tuấn','ttutts-le-anh-tuan','Tiến sĩ - Bác sĩ Cao cấp','Tai Mũi Họng Trẻ em',7,NULL,'25+ năm','Đại học Y Hà Nội',NULL,'ttutts.le.anh.tuan@noh.vn','0836645398',0,2,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(3,'PGS.TS. Nguyễn Quang Trung','pgsts-nguyen-quang-trung','TS.BS','Ung bướu Đầu Cổ',8,'','20+ năm','Đại học Y Hà Nội','','pgsts.pham.tuan.canh@noh.vn','0123456123',1,3,'2026-04-13 17:59:06','2026-04-14 07:33:28'),(4,'BSCKII. Hà Minh Lợi','bsckii-ha-minh-loi','Bác sĩ Chuyên khoa II','Mũi Xoang',9,NULL,'18+ năm','Đại học Y Hà Nội',NULL,'bsckii.ha.minh.loi@noh.vn','0594897934',1,4,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(5,'TS.BS. Đào Đình Thi','tsbs-dao-dinh-thi','Tiến sĩ - Bác sĩ','Nội soi TMH',12,NULL,'15+ năm','Đại học Y Hà Nội',NULL,'tsbs.dao.dinh.thi@noh.vn','0395268126',1,5,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(6,'TTND, PGS.TS. Quách Thị Cần','ttnd-pgsts-quach-thi-can','Phó Giáo sư - Tiến sĩ','Cấp cứu TMH',5,NULL,'28+ năm','Đại học Y Hà Nội',NULL,'ttnd.pgsts.quach.thi.can@noh.vn','0774977902',1,6,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(7,'TS.BS. Trần Văn Hùng','tsbs-tran-van-hung','Tiến sĩ - Bác sĩ','Họng - Thanh quản',1,NULL,'16+ năm','Đại học Y Hà Nội',NULL,'tsbs.tran.van.hung@noh.vn','0704925192',1,7,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(8,'BSCKII. Nguyễn Thị Hương','bsckii-nguyen-thi-huong','Bác sĩ Chuyên khoa II','Tai thần kinh',8,NULL,'20+ năm','Đại học Y Hà Nội',NULL,'bsckii.nguyen.thi.huong@noh.vn','0814487578',1,8,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(9,'ThS.BS. Lê Minh Đức','thsbs-le-minh-duc','Thạc sĩ - Bác sĩ','Khám bệnh TMH',3,NULL,'10+ năm','Đại học Y Hà Nội',NULL,'thsbs.le.minh.duc@noh.vn','0934183112',1,9,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(10,'PGS.TS. Vũ Trung Kiên','pgsts-vu-trung-kien','Phó Giáo sư - Tiến sĩ','Gây mê hồi sức',4,NULL,'22+ năm','Đại học Y Hà Nội',NULL,'pgsts.vu.trung.kien@noh.vn','0842658302',1,10,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(11,'TS.BS. Hoàng Anh Tuấn','tsbs-hoang-anh-tuan','Tiến sĩ - Bác sĩ','Tai - Phẫu thuật tai',2,NULL,'14+ năm','Đại học Y Hà Nội',NULL,'tsbs.hoang.anh.tuan@noh.vn','0917092050',1,11,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(12,'BSCKII. Phạm Thị Lan','bsckii-pham-thi-lan','Bác sĩ Chuyên khoa II','Thính - Thanh học',10,NULL,'19+ năm','Đại học Y Hà Nội',NULL,'bsckii.pham.thi.lan@noh.vn','0842186478',1,12,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(13,'ThS.BS. Đỗ Văn Nam','thsbs-do-van-nam','Thạc sĩ - Bác sĩ','Nội soi mũi xoang',9,NULL,'8+ năm','Đại học Y Hà Nội',NULL,'thsbs.do.van.nam@noh.vn','0359274125',1,13,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(14,'TS.BS. Nguyễn Văn Bình','tsbs-nguyen-van-binh','Tiến sĩ - Bác sĩ','Ung thư thanh quản',6,NULL,'17+ năm','Đại học Y TP.HCM',NULL,'tsbs.nguyen.van.binh@noh.vn','0341809752',1,14,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(15,'BSCKI. Trần Thị Mai','bscki-tran-thi-mai','Bác sĩ Chuyên khoa I','TMH Trẻ em',7,NULL,'12+ năm','Đại học Y Hà Nội',NULL,'bscki.tran.thi.mai@noh.vn','0762242048',1,15,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(16,'ThS.BS. Lý Hoàng Long','thsbs-ly-hoang-long','Thạc sĩ - Bác sĩ','Phẫu thuật tạo hình mũi',11,NULL,'9+ năm','Đại học Y Hà Nội',NULL,'thsbs.ly.hoang.long@noh.vn','0821028818',1,16,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(17,'BSCKII. Vũ Đức Cường','bsckii-vu-duc-cuong','Bác sĩ Chuyên khoa II','Họng - Thanh quản',1,NULL,'21+ năm','Đại học Y Hà Nội',NULL,'bsckii.vu.duc.cuong@noh.vn','0397238140',1,17,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(18,'TS.BS. Phan Thanh Hải','tsbs-phan-thanh-hai','Tiến sĩ - Bác sĩ','Chẩn đoán hình ảnh TMH',15,NULL,'13+ năm','Đại học Y Hà Nội',NULL,'tsbs.phan.thanh.hai@noh.vn','0369533187',1,18,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(19,'ThS.BS. Nguyễn Hoàng Sơn','thsbs-nguyen-hoang-son','Thạc sĩ - Bác sĩ','Cấp cứu TMH',5,NULL,'11+ năm','Đại học Y Hà Nội',NULL,'thsbs.nguyen.hoang.son@noh.vn','0899990764',1,19,'2026-04-13 17:59:06','2026-04-14 07:32:26'),(20,'BSCKI. Đặng Thị Ngọc','bscki-dang-thi-ngoc','Bác sĩ Chuyên khoa I','Xét nghiệm TMH',13,NULL,'10+ năm','Đại học Y Hà Nội',NULL,'bscki.dang.thi.ngoc@noh.vn','0887273157',1,20,'2026-04-13 17:59:06','2026-04-14 07:32:26');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published_at` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_doc_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_records`
--

DROP TABLE IF EXISTS `medical_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointment_id` int DEFAULT NULL,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `symptoms` text COLLATE utf8mb4_unicode_ci,
  `diagnosis` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `treatment` text COLLATE utf8mb4_unicode_ci,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `follow_up_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `appointment_id` (`appointment_id`),
  KEY `idx_record_patient` (`patient_id`),
  KEY `idx_record_doctor` (`doctor_id`),
  CONSTRAINT `medical_records_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `medical_records_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `medical_records_ibfk_3` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_records`
--

LOCK TABLES `medical_records` WRITE;
/*!40000 ALTER TABLE `medical_records` DISABLE KEYS */;
INSERT INTO `medical_records` VALUES (1,13,13,9,'Đau họng kéo dài, khó nuốt, sốt nhẹ','Viêm amidan mãn tính','Kháng sinh + kháng viêm 7 ngày, tái khám','Bệnh nhân hợp tác tốt trong quá trình khám.',NULL,'2026-04-13 17:59:07'),(2,14,14,17,'Ù tai trái, chóng mặt khi thay đổi tư thế','Rối loạn tiền đình ngoại biên','Thuốc tiền đình + tập vật lý trị liệu','Bệnh nhân hợp tác tốt trong quá trình khám.','2026-06-30','2026-04-13 17:59:07'),(3,15,15,6,'Nghẹt mũi mạn tính, chảy dịch mũi sau','Viêm xoang mạn tính có polyp','Phẫu thuật nội soi mũi xoang (FESS)','Bệnh nhân hợp tác tốt trong quá trình khám.',NULL,'2026-04-13 17:59:07'),(4,16,16,14,'Khàn tiếng 2 tuần, không cải thiện','Viêm thanh quản cấp','Nghỉ ngơi giọng, uống thuốc kháng viêm','Bệnh nhân hợp tác tốt trong quá trình khám.','2026-06-18','2026-04-13 17:59:07'),(5,17,17,7,'Đau tai phải, chảy mủ tai','Viêm tai giữa mủ','Rửa tai, nhỏ kháng sinh tai, tái khám sau 2 tuần','Bệnh nhân hợp tác tốt trong quá trình khám.','2026-06-11','2026-04-13 17:59:07'),(6,18,18,10,'Nghe kém dần 2 bên tai','Nghe kém tiếp nhận 2 bên','Đo thính lực, tư vấn máy trợ thính','Bệnh nhân hợp tác tốt trong quá trình khám.',NULL,'2026-04-13 17:59:07'),(7,19,19,6,'Chảy máu mũi tái phát','Chảy máu mũi do lệch vách ngăn','Đốt điện cầm máu + nắn vách ngăn','Bệnh nhân hợp tác tốt trong quá trình khám.',NULL,'2026-04-13 17:59:07'),(8,20,20,7,'Ho kéo dài, đau rát cổ họng','Viêm họng hạt mãn tính','Thuốc xịt họng + kháng histamine','Bệnh nhân hợp tác tốt trong quá trình khám.',NULL,'2026-04-13 17:59:07'),(9,7,7,16,'sadsadasd','ádsad','','',NULL,'2026-04-14 09:10:53'),(10,8,8,16,'ưeqwe','qưeqwe','qưeqwe','qưewqe','2026-04-18','2026-04-14 09:37:29'),(11,36,1,8,'Dadu bung di ia','dau bung','uong thuoc la duoc','','2026-04-15','2026-04-14 09:47:53'),(12,21,21,17,'sdasd','czxczxc','ádasdas','đâsd',NULL,'2026-04-24 09:51:41');
/*!40000 ALTER TABLE `medical_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicines`
--

DROP TABLE IF EXISTS `medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active_ingredient` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `stock_quantity` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicines`
--

LOCK TABLES `medicines` WRITE;
/*!40000 ALTER TABLE `medicines` DISABLE KEYS */;
INSERT INTO `medicines` VALUES (1,'Amoxicillin 500mg','Amoxicillin','viên','Kháng sinh','',1,'2026-04-13 17:59:06','2026-04-14 09:47:53',180),(2,'Paracetamol 500mg','Paracetamol','viên','Giảm đau hạ sốt',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(3,'Ibuprofen 400mg','Ibuprofen','viên','Kháng viêm',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(4,'Cetirizine 10mg','Cetirizine','viên','Kháng dị ứng',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(5,'Omeprazole 20mg','Omeprazole','viên','Dạ dày',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(6,'Dexamethasone 0.5mg','Dexamethasone','viên','Corticoid',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(7,'Ofloxacin nhỏ tai 0.3%','Ofloxacin','lọ','Nhỏ tai',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(8,'Naphazoline nhỏ mũi','Naphazoline','lọ','Nhỏ mũi',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(9,'Clarithromycin 500mg','Clarithromycin','viên','Kháng sinh',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(10,'Prednisolone 5mg','Prednisolone','viên','Corticoid',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(11,'Xylometazoline 0.1%','Xylometazoline','lọ','Nhỏ mũi',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(12,'Loratadine 10mg','Loratadine','viên','Kháng dị ứng',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(13,'Fluticasone xịt mũi','Fluticasone','lọ','Corticoid xịt',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(14,'Ciprofloxacin nhỏ mắt 0.3%','Ciprofloxacin','lọ','Nhỏ mắt',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(15,'Vitamin C 500mg','Ascorbic acid','viên','Vitamin',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(16,'Cefuroxime 500mg','Cefuroxime','viên','Kháng sinh',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(17,'Methylprednisolone 16mg','Methylprednisolone','viên','Corticoid',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(18,'Montelukast 10mg','Montelukast','viên','Kháng dị ứng',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(19,'Betahistine 24mg','Betahistine','viên','Tiền đình',NULL,1,'2026-04-13 17:59:06','2026-04-14 09:32:52',200),(20,'Budesonide xịt mũi','Budesonide','lọ','Corticoid xịt',NULL,1,'2026-04-13 17:59:06','2026-04-24 09:51:41',199);
/*!40000 ALTER TABLE `medicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('su-kien','nghien-cuu','hop-tac','thong-bao','hoi-dap','tuyen-sinh') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'su-kien',
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `view_count` int DEFAULT '0',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_published` tinyint(1) DEFAULT '1',
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_news_category` (`category`),
  KEY `idx_news_published` (`is_published`,`published_at`),
  KEY `idx_news_slug` (`slug`),
  FULLTEXT KEY `idx_news_search` (`title`,`excerpt`,`content`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (38,'Hàng trăm bác sĩ ra quân, khám và sàng lọc miễn phí cho hơn 10.000 người','hang-tram-bac-si-ra-quan','su-kien','Hàng nghìn người đổ về phố đi bộ Trần Nhân Tông từ sáng sớm 5/4, nhiều công nghệ khám hiện đại, tư vấn dinh dưỡng cá thể hóa được triển khai ngay tại sự kiện.','<p>Hàng nghìn người đổ về phố đi bộ Trần Nhân Tông từ sáng sớm 5/4...</p>','/uploads/news/seed/hang-tram-bac-si-ra-quan-8d6b091385.jpg','Ban biên tập',0,1,1,'2026-04-07 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(39,'Người dân háo hức tham gia khám sức khỏe miễn phí, chuyên gia nhấn mạnh chủ động phòng bệnh','nguoi-dan-hao-hung-kham-suc-khoe','su-kien','Sáng ngày 5/4, hàng nghìn người dân đã đến tham gia chương trình khám sức khỏe miễn phí tại phố đi bộ.','<p>Sáng ngày 5/4, hàng nghìn người dân...</p>','/uploads/news/seed/nguoi-dan-hao-hung-kham-suc-khoe-005eee96d6.jpg','Ban biên tập',0,1,1,'2026-04-07 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(40,'Bệnh viện TMH TW khám, tư vấn miễn phí cho hàng trăm người dân tại Ngày hội \"Vì một Việt Nam khỏe mạnh\"','kham-tu-van-mien-phi-ngay-hoi','su-kien','Hưởng ứng Ngày Sức khỏe toàn dân 7/4, Bệnh viện TMH TW tham gia Ngày hội với nhiều hoạt động ý nghĩa.','<p>Hưởng ứng Ngày Sức khỏe toàn dân 7/4...</p>','/uploads/news/seed/kham-tu-van-mien-phi-ngay-hoi-ba49cc9faf.jpg','Ban biên tập',0,1,1,'2026-04-06 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(41,'Viêm tai giữa mãn tính: Cảnh báo biến chứng nguy hiểm và cách phòng tránh','viem-tai-giua-man-tinh','nghien-cuu','Viêm tai giữa mãn tính là tình trạng viêm niêm mạc hòm nhĩ và xương chũm kéo dài trên 12 tuần.','<p>Viêm tai giữa mãn tính là tình trạng...</p>','/uploads/news/seed/viem-tai-giua-man-tinh-538fec86f8.jpg','Ban biên tập',0,0,1,'2026-03-25 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(42,'Những hiểu lầm người Việt thường mắc phải về bệnh viêm xoang','hieu-lam-ve-viem-xoang','nghien-cuu','Viêm xoang là một trong những bệnh lý thường gặp trong chuyên khoa Tai Mũi Họng, chiếm khoảng 15% dân số.','<p>Viêm xoang là một trong những bệnh lý...</p>','/uploads/news/seed/hieu-lam-ve-viem-xoang-8d92f54313.jpg','Ban biên tập',0,0,1,'2026-03-20 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(43,'Thông báo tuyển sinh Lớp Điều dưỡng chuyên khoa Tai Mũi Họng khóa XIX năm 2026','thong-bao-tuyen-sinh-dieu-duong-khoa-xix-2026','tuyen-sinh','Thông báo tuyển sinh khóa điều dưỡng chuyên khoa Tai Mũi Họng.','<p>Ban Giám đốc Bệnh viện Tai Mũi Họng Trung ương thông báo tuyển sinh lớp Điều dưỡng chuyên khoa Tai Mũi Họng khóa XIX — năm 2026.</p>','/uploads/news/seed/thong-bao-tuyen-sinh-dieu-duong-khoa-xix-2026-cd65ccc54e.jpg','Ban biên tập',0,0,1,'2026-02-24 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(44,'THÔNG BÁO TUYỂN SINH LỚP TAI MŨI HỌNG CƠ BẢN KHÓA V (NĂM 2026)','thong-bao-tuyen-sinh-lop-tmh-co-ban-khoa-v-2026','tuyen-sinh','Tuyển sinh lớp Tai Mũi Họng cơ bản khóa V năm 2026.','<p>Thông báo tuyển sinh lớp khám và điều trị bệnh Tai Mũi Họng cơ bản Khóa V — năm 2026.</p>','/uploads/news/seed/thong-bao-tuyen-sinh-lop-tmh-co-ban-khoa-v-2026-fb6a4e5877.png','Ban biên tập',0,0,1,'2026-01-15 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(45,'Đơn xin học lớp khám và điều trị bệnh Tai Mũi Họng cơ bản Khóa V - năm 2023','don-xin-hoc-lop-kham-dieu-tri-tmh-khoa-v-2023','tuyen-sinh','Hướng dẫn và mẫu đơn xin học lớp TMH cơ bản.','<p>Đơn xin học lớp khám và điều trị bệnh Tai Mũi Họng cơ bản Khóa V — năm 2023.</p><p>- Tải file để xem chi tiết: <a href=\"/documents/mau-don-xin-hoc.doc\" download>Mau-don-xin-hoc.doc</a></p>','/uploads/news/seed/don-xin-hoc-lop-kham-dieu-tri-tmh-khoa-v-2023-208a5a2945.png','Ban biên tập',0,0,1,'2023-02-03 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(46,'THÔNG BÁO TUYỂN SINH LỚP TAI MŨI HỌNG CƠ BẢN KHÓA IV (NĂM 2025)','thong-bao-tuyen-sinh-lop-tmh-co-ban-khoa-iv-2025','tuyen-sinh','Thông báo tuyển sinh khóa IV năm 2025.','<p>Thông báo tuyển sinh lớp Tai Mũi Họng cơ bản khóa IV (năm 2025).</p>','/uploads/news/seed/thong-bao-tuyen-sinh-lop-tmh-co-ban-khoa-iv-2025-fb6a4e5877.png','Ban biên tập',0,0,1,'2025-08-10 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(47,'Thông báo \'Đào tạo liên tục cho cán bộ y tế chuyên ngành Tai Mũi Họng năm 2025\'','dao-tao-lien-tuc-can-bo-y-te-tmh-2025','tuyen-sinh','Chương trình đào tạo liên tục năm 2025.','<p>Đào tạo liên tục cho cán bộ y tế chuyên ngành Tai Mũi Họng năm 2025.</p>','/uploads/news/seed/dao-tao-lien-tuc-can-bo-y-te-tmh-2025-9564606985.jpg','Ban biên tập',0,0,1,'2025-05-20 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(48,'Thông báo tuyển sinh lớp Tai Mũi Họng nâng cao năm 2024','tuyen-sinh-lop-tmh-nang-cao-2024','tuyen-sinh','Lớp chuyên sâu dành cho bác sĩ đã qua lớp cơ bản.','<p>Tuyển sinh lớp Tai Mũi Họng nâng cao năm 2024.</p>','/uploads/news/seed/tuyen-sinh-lop-tmh-nang-cao-2024-376de32dce.jpg','Ban biên tập',0,0,1,'2024-11-02 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(49,'Cập nhật lịch khai giảng lớp TMH cơ bản khóa III','cap-nhat-lich-khai-giang-khoa-iii','tuyen-sinh','Thông báo lịch khai giảng mới.','<p>Cập nhật lịch khai giảng lớp TMH cơ bản khóa III.</p>','/uploads/news/seed/cap-nhat-lich-khai-giang-khoa-iii-208a5a2945.png','Ban biên tập',0,0,1,'2024-06-12 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(50,'Hướng dẫn hồ sơ đăng ký tuyển sinh các lớp đào tạo năm 2024','huong-dan-ho-so-tuyen-sinh-2024','tuyen-sinh','Danh mục giấy tờ và thời hạn nộp hồ sơ.','<p>Hướng dẫn chi tiết hồ sơ tuyển sinh năm 2024.</p>','/uploads/news/seed/huong-dan-ho-so-tuyen-sinh-2024-97b86d9e46.jpg','Ban biên tập',0,0,1,'2024-03-08 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(51,'Công bố kết quả tuyển sinh lớp TMH cơ bản khóa II — 2023','ket-qua-tuyen-sinh-khoa-ii-2023','tuyen-sinh','Danh sách trúng tuyển.','<p>Kết quả tuyển sinh lớp TMH cơ bản khóa II năm 2023.</p>','/uploads/news/seed/ket-qua-tuyen-sinh-khoa-ii-2023-3d04f07212.jpg','Ban biên tập',0,0,1,'2023-09-01 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(52,'Thông báo mức lệ phí và học phí các lớp đào tạo năm 2023','thong-bao-le-phi-hoc-phi-2023','tuyen-sinh','Biểu phí áp dụng từ tháng 5/2023.','<p>Thông báo học phí và lệ phí đào tạo năm 2023.</p>','/uploads/news/seed/thong-bao-le-phi-hoc-phi-2023-4812652def.jpg','Ban biên tập',0,0,1,'2023-04-18 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(53,'Lễ trao bằng tốt nghiệp lớp Tai Mũi Họng cơ bản khóa I','le-trao-bang-tot-nghiep-khoa-i','tuyen-sinh','Thông tin lễ trao bằng và danh sách học viên.','<p>Lễ trao bằng tốt nghiệp khóa I.</p>','/uploads/news/seed/le-trao-bang-tot-nghiep-khoa-i-bfd08740bb.jpg','Ban biên tập',0,0,1,'2022-12-15 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02'),(54,'Kế hoạch tuyển sinh các lớp đào tạo năm 2022','ke-hoach-tuyen-sinh-nam-2022','tuyen-sinh','Tổng quan các lớp mở trong năm.','<p>Kế hoạch tuyển sinh năm 2022.</p>','/uploads/news/seed/ke-hoach-tuyen-sinh-nam-2022-0cd40c595b.jpg','Ban biên tập',0,0,1,'2022-01-20 10:00:00','2026-04-24 10:48:02','2026-04-24 10:48:02');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `insurance_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_contact` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blood_type` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allergies` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,22,'1988-06-27','male','200 Kim Mã, Ba Đình, Hà Nội','DN49310242843',NULL,'B+','Sulfonamide','2026-04-13 17:59:07','2026-04-13 17:59:07'),(2,23,'1984-05-07','female','34 Lê Văn Lương, Thanh Xuân, Hà Nội','DN48769882989',NULL,'B-',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(3,24,'1994-04-01','male','Số 5 Ngõ 10 Thái Hà, Đống Đa, Hà Nội','DN43626615485',NULL,'A-',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(4,25,'1973-07-19','female','200 Kim Mã, Ba Đình, Hà Nội','DN43327271063',NULL,'B+','Không','2026-04-13 17:59:07','2026-04-13 17:59:07'),(5,26,'1962-11-03','male','200 Kim Mã, Ba Đình, Hà Nội','DN45462703076',NULL,'O+',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(6,27,'1997-02-04','female','Số 8 Nguyễn Trãi, Thanh Xuân, Hà Nội','DN45407705740',NULL,'AB+',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(7,28,'1983-03-17','male','120 Giải Phóng, Hai Bà Trưng, Hà Nội','DN42173127423',NULL,'A+',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(8,29,'1966-05-04','female','34 Lê Văn Lương, Thanh Xuân, Hà Nội','DN49482805209',NULL,'B-','Penicillin','2026-04-13 17:59:07','2026-04-13 17:59:07'),(9,30,'1967-06-21','male','56 Trần Phú, Ba Đình, Hà Nội','DN45510155430',NULL,'AB+',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(10,31,'1986-09-08','female','15 Phố Huế, Hai Bà Trưng, Hà Nội','DN46127077449',NULL,'AB-','Penicillin','2026-04-13 17:59:07','2026-04-13 17:59:07'),(11,32,'2005-10-15','male','90 Nguyễn Xiển, Thanh Xuân, Hà Nội','DN47013986480',NULL,'A+',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(12,33,'1966-01-22','female','200 Kim Mã, Ba Đình, Hà Nội','DN49953235355',NULL,'A-',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(13,34,'2005-02-25','male','56 Trần Phú, Ba Đình, Hà Nội','DN49232148096',NULL,'B+',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(14,35,'2009-05-25','female','34 Lê Văn Lương, Thanh Xuân, Hà Nội','DN46828298757',NULL,'B+','Aspirin','2026-04-13 17:59:07','2026-04-13 17:59:07'),(15,36,'1974-03-27','male','200 Kim Mã, Ba Đình, Hà Nội','DN42512367550',NULL,'AB+',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(16,37,'1973-02-04','female','34 Lê Văn Lương, Thanh Xuân, Hà Nội','DN44571363775',NULL,'O+',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(17,38,'1990-01-19','male','15 Phố Huế, Hai Bà Trưng, Hà Nội','DN49995749002',NULL,'A-',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(18,39,'1969-11-29','female','200 Kim Mã, Ba Đình, Hà Nội','DN46489365473',NULL,'A-',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(19,40,'1989-01-12','male','Số 8 Nguyễn Trãi, Thanh Xuân, Hà Nội','DN44156323788',NULL,'O+',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(20,41,'1991-01-18','female','56 Trần Phú, Ba Đình, Hà Nội','DN46629845302',NULL,'B-',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(21,42,'1969-08-22','male','90 Nguyễn Xiển, Thanh Xuân, Hà Nội','DN49217834718',NULL,'AB-',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(22,43,'1989-08-04','female','Số 5 Ngõ 10 Thái Hà, Đống Đa, Hà Nội','DN44313304055',NULL,'B+','Aspirin','2026-04-13 17:59:07','2026-04-13 17:59:07'),(23,44,'1983-05-27','male','78 Hoàng Quốc Việt, Cầu Giấy, Hà Nội','DN44959995716',NULL,'AB-','Penicillin','2026-04-13 17:59:07','2026-04-13 17:59:07'),(24,45,'2001-01-11','female','200 Kim Mã, Ba Đình, Hà Nội','DN47194016320',NULL,'O-',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(25,46,'1983-12-26','male','34 Lê Văn Lương, Thanh Xuân, Hà Nội','DN44913678139',NULL,'AB-',NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_id` int NOT NULL,
  `medicine_id` int NOT NULL,
  `quantity` int NOT NULL,
  `dosage` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration_days` int DEFAULT NULL,
  `instruction` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `medicine_id` (`medicine_id`),
  KEY `idx_prescription_record` (`record_id`),
  CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`record_id`) REFERENCES `medical_records` (`id`) ON DELETE CASCADE,
  CONSTRAINT `prescriptions_ibfk_2` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescriptions`
--

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;
INSERT INTO `prescriptions` VALUES (1,1,19,23,'1 viên x 3 lần/ngày',7,'Nhỏ tai sau khi rửa sạch','2026-04-13 17:59:07'),(2,1,13,20,'1 viên x 3 lần/ngày',9,'Uống với nhiều nước','2026-04-13 17:59:07'),(3,2,5,23,'1 xịt x 2 lần/ngày',11,'Uống sau ăn','2026-04-13 17:59:07'),(4,2,14,16,'1 viên x 3 lần/ngày',9,'Uống với nhiều nước','2026-04-13 17:59:07'),(5,2,9,5,'1 viên x 3 lần/ngày',8,'Uống trước ăn 30 phút','2026-04-13 17:59:07'),(6,3,5,9,'1 viên x 2 lần/ngày',11,'Uống sau ăn','2026-04-13 17:59:07'),(7,3,10,13,'1 viên x 3 lần/ngày',6,'Uống sau ăn','2026-04-13 17:59:07'),(8,4,14,22,'1 xịt x 2 lần/ngày',8,'Nhỏ tai sau khi rửa sạch','2026-04-13 17:59:07'),(9,4,20,24,'2 viên x 2 lần/ngày',7,'Nhỏ tai sau khi rửa sạch','2026-04-13 17:59:07'),(10,5,19,20,'1 viên x 3 lần/ngày',11,'Uống trước ăn 30 phút','2026-04-13 17:59:07'),(11,5,18,6,'1 lọ, nhỏ 2 giọt x 3 lần/ngày',7,'Uống sau ăn','2026-04-13 17:59:07'),(12,6,14,23,'2 viên x 2 lần/ngày',13,'Uống với nhiều nước','2026-04-13 17:59:07'),(13,6,2,21,'1 viên x 3 lần/ngày',10,'Xịt mũi sau khi rửa mũi','2026-04-13 17:59:07'),(14,6,8,17,'2 viên x 2 lần/ngày',12,'Xịt mũi sau khi rửa mũi','2026-04-13 17:59:07'),(15,7,7,8,'2 viên x 2 lần/ngày',10,'Uống sau ăn','2026-04-13 17:59:07'),(16,7,13,16,'1 lọ, nhỏ 2 giọt x 3 lần/ngày',7,'Uống sau ăn','2026-04-13 17:59:07'),(17,7,16,5,'2 viên x 2 lần/ngày',9,'Uống sau ăn','2026-04-13 17:59:07'),(18,8,1,13,'2 viên x 2 lần/ngày',8,'Uống với nhiều nước','2026-04-13 17:59:07'),(19,8,3,14,'1 viên x 2 lần/ngày',14,'Nhỏ tai sau khi rửa sạch','2026-04-13 17:59:07'),(20,8,16,15,'1 lọ, nhỏ 2 giọt x 3 lần/ngày',9,'Uống với nhiều nước','2026-04-13 17:59:07'),(21,10,1,40,'qưe',5,'qưeqwe','2026-04-14 09:37:29'),(22,11,1,20,'123',3,'wewqewq','2026-04-14 09:47:53'),(23,12,20,1,'2',1,'','2026-04-24 09:51:41');
/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzYxMDMxNjcsImV4cCI6MTc3NjcwNzk2N30.HL8tD6kkVvVIOEOWylrGXbBHwxDj4RPAcTiDHkkKb40','2026-04-21 00:59:27','2026-04-13 17:59:27'),(2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzYxNTA5NzMsImV4cCI6MTc3Njc1NTc3M30.7t9iBUIOwIFiLn_nUFenoB_Vsf4M7d7Gkhz_yDTkNdk','2026-04-21 14:16:13','2026-04-14 07:16:13'),(3,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzYxNTE3MzMsImV4cCI6MTc3Njc1NjUzM30.MwDk6kXVHh-IFMbm2qSIg2gY-DwwrN7vscZDmQQ-StQ','2026-04-21 14:28:54','2026-04-14 07:28:53'),(4,22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzc2MTUyNTg4LCJleHAiOjE3NzY3NTczODh9.6uWMtD5-P0jfgVisax81NSRx3tHPKWqJHUTjyX06K5A','2026-04-21 14:43:09','2026-04-14 07:43:08'),(8,22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzc2MTU2Njk4LCJleHAiOjE3NzY3NjE0OTh9.ZDedrpGfXfaXClvb2DxjUBvjcRW0cDFuAkLH4RMZcjY','2026-04-21 15:51:39','2026-04-14 08:51:38'),(10,17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzc2MTU3NjA4LCJleHAiOjE3NzY3NjI0MDh9.BzoIlwtqrNfcpFd2F4dj5tKW3GB9RetU3MMvji5YjPE','2026-04-21 16:06:48','2026-04-14 09:06:48'),(16,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzYxNTk0NzcsImV4cCI6MTc3Njc2NDI3N30.-ZDH1jHkaju7I9xb6UFTFGDNVGB4uqQjknBI_HtP-Ts','2026-04-21 16:37:58','2026-04-14 09:37:57'),(19,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzYxNjAwNDMsImV4cCI6MTc3Njc2NDg0M30.fD5t2frAMWqRyMGsLd9zcovoLRUNg1iqbxH9rh6yUds','2026-04-21 16:47:23','2026-04-14 09:47:23'),(20,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzYyNDQ5NDEsImV4cCI6MTc3Njg0OTc0MX0.HyvW3QhO8Ok7ljoatKmdSNFcwjpCjdic6jbBsDdo2so','2026-04-22 16:22:21','2026-04-15 09:22:21'),(21,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzcwMTY2NDAsImV4cCI6MTc3NzYyMTQ0MH0.lFtN_fn88ZsddGx7RkOkOINHC-oWEbYPe-kPt4yzW6U','2026-05-01 14:44:00','2026-04-24 07:44:00'),(22,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzcwMjAwNjEsImV4cCI6MTc3NzYyNDg2MX0.mi6Vw4g45R3fZ-YbhAPSkyHdHrHHaQrGx0fTqN2qHHE','2026-05-01 15:41:02','2026-04-24 08:41:01'),(27,17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzc3MDIyMTEyLCJleHAiOjE3Nzc2MjY5MTJ9.wilH-4BMZFSjPkKegKVMyRxMu6H_lKaCL8ZJT9N_SoQ','2026-05-01 16:15:13','2026-04-24 09:15:12'),(31,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzcwMjcyNzEsImV4cCI6MTc3NzYzMjA3MX0.waR_BxUDBSlEAdpahmxg84She-CwA5x0fIVPW4mJYqE','2026-05-01 17:41:12','2026-04-24 10:41:11');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('super_admin','admin','doctor','patient') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'patient',
  `full_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `doctor_id` (`doctor_id`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@noh.vn','$2b$12$33MKE8qHQW71yJtnZUyMiOkUZLkF4J.gUwau.lwJ9a5f53h3drfBG','super_admin','Quản trị viên hệ thống','0243853427',NULL,NULL,1,'2026-04-24 17:41:11','2026-04-13 17:59:07','2026-04-24 10:41:11'),(2,'pgsts.pham.tuan.canh@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','PGS.TS. Phạm Tuấn Cảnh','0855855469',NULL,1,0,NULL,'2026-04-13 17:59:07','2026-04-13 18:04:10'),(3,'ttutts.le.anh.tuan@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','TTƯT.TS. Lê Anh Tuấn','0836645398',NULL,2,0,NULL,'2026-04-13 17:59:07','2026-04-13 18:04:11'),(4,'pgsts.nguyen.quang.trung@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','PGS.TS. Nguyễn Quang Trung','0123456123','',3,1,NULL,'2026-04-13 17:59:07','2026-04-14 07:33:28'),(5,'bsckii.ha.minh.loi@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','BSCKII. Hà Minh Lợi','0594897934',NULL,4,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(6,'tsbs.dao.dinh.thi@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','TS.BS. Đào Đình Thi','0395268126',NULL,5,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(7,'ttnd.pgsts.quach.thi.can@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','TTND, PGS.TS. Quách Thị Cần','0774977902',NULL,6,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(8,'tsbs.tran.van.hung@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','TS.BS. Trần Văn Hùng','0704925192',NULL,7,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(9,'bsckii.nguyen.thi.huong@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','BSCKII. Nguyễn Thị Hương','0814487578',NULL,8,1,'2026-04-14 16:47:23','2026-04-13 17:59:07','2026-04-14 09:47:23'),(10,'thsbs.le.minh.duc@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','ThS.BS. Lê Minh Đức','0934183112',NULL,9,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(11,'pgsts.vu.trung.kien@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','PGS.TS. Vũ Trung Kiên','0842658302',NULL,10,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(12,'tsbs.hoang.anh.tuan@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','TS.BS. Hoàng Anh Tuấn','0917092050',NULL,11,1,'2026-04-24 15:42:12','2026-04-13 17:59:07','2026-04-24 08:42:12'),(13,'bsckii.pham.thi.lan@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','BSCKII. Phạm Thị Lan','0842186478',NULL,12,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(14,'thsbs.do.van.nam@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','ThS.BS. Đỗ Văn Nam','0359274125',NULL,13,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(15,'tsbs.nguyen.van.binh@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','TS.BS. Nguyễn Văn Bình','0341809752',NULL,14,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(16,'bscki.tran.thi.mai@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','BSCKI. Trần Thị Mai','0762242048',NULL,15,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(17,'thsbs.ly.hoang.long@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','ThS.BS. Lý Hoàng Long','0821028818',NULL,16,1,'2026-04-24 16:50:56','2026-04-13 17:59:07','2026-04-24 09:50:56'),(18,'bsckii.vu.duc.cuong@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','BSCKII. Vũ Đức Cường','0397238140',NULL,17,1,'2026-04-24 16:51:21','2026-04-13 17:59:07','2026-04-24 09:51:21'),(19,'tsbs.phan.thanh.hai@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','TS.BS. Phan Thanh Hải','0369533187',NULL,18,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(20,'thsbs.nguyen.hoang.son@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','ThS.BS. Nguyễn Hoàng Sơn','0899990764',NULL,19,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(21,'bscki.dang.thi.ngoc@noh.vn','$2b$12$SJw/9uFv4e4BXA/YAXZiau/WeuO.rtybiCccyYmu1btgsiW3VaZJG','doctor','BSCKI. Đặng Thị Ngọc','0887273157',NULL,20,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(22,'patient1@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Nguyễn Văn An','0373432737',NULL,NULL,1,'2026-04-14 16:45:40','2026-04-13 17:59:07','2026-04-14 09:45:40'),(23,'patient2@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Trần Thị Bích','0825603272',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(24,'patient3@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Lê Hoàng Cường','0992405235',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(25,'patient4@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Phạm Thị Dung','0992988136',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(26,'patient5@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Hoàng Văn Em','0835912660',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(27,'patient6@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Vũ Thị Phương','0562758672',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(28,'patient7@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Đỗ Minh Quang','0977890398',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(29,'patient8@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Bùi Thị Hoa','0833610549',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(30,'patient9@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Ngô Đức Hùng','0567172986',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(31,'patient10@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Dương Thị Kim','0981810938',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(32,'patient11@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Lý Văn Long','0933732384',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(33,'patient12@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Trịnh Thị Mai','0333393477',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(34,'patient13@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Đinh Văn Nam','0973216038',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(35,'patient14@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Cao Thị Oanh','0328235621',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(36,'patient15@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Tạ Văn Phong','0849006972',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(37,'patient16@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Hồ Thị Quỳnh','0398831783',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(38,'patient17@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Lương Văn Rạng','0944791445',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(39,'patient18@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Phan Thị Sương','0912109729',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(40,'patient19@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Chu Văn Thắng','0922420346',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(41,'patient20@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Mai Thị Uyên','0834952774',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(42,'patient21@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Nguyễn Đức Việt','0391305977',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(43,'patient22@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Trần Thị Xuân','0919252448',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(44,'patient23@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Lê Văn Yên','0995732466',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(45,'patient24@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Phạm Thị Ánh','0387429767',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(46,'patient25@gmail.com','$2b$12$fllBlwpQTIGMm3IXJBJsmOtC2bGT7hpDEFE2dzXJg2vkKa1Zi.zym','patient','Hoàng Minh Bảo','0343055557',NULL,NULL,1,NULL,'2026-04-13 17:59:07','2026-04-13 17:59:07'),(47,'nghia.mt1505@gmail.com','$2b$12$dPDvPDunOZ5A0WPZ1dnm9u.cNdRPd6JV1tK3Kp3TBM1OuFTEdI64y','admin','Mai Trung Nghĩa','123123123',NULL,NULL,1,'2026-04-14 16:35:55','2026-04-14 08:33:54','2026-04-14 09:35:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `youtube_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_featured` tinyint(1) DEFAULT '0',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'noh_hospital'
--

--
-- Dumping routines for database 'noh_hospital'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-24 18:14:46
