-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: workbench_db
-- ------------------------------------------------------
-- Server version	8.0.31

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
-- Table structure for table `decision_trees`
--

DROP TABLE IF EXISTS `decision_trees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `decision_trees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `document_id` varchar(200) NOT NULL,
  `medical_guideline_id` varchar(255) NOT NULL,
  `logical_relation` varchar(255) DEFAULT NULL,
  `medical_guideline_body` text,
  `question` text,
  `category` varchar(30) DEFAULT NULL,
  `classification_type` varchar(100) DEFAULT NULL,
  `decision_tree_context` text NOT NULL,
  `generation_time` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `decision_trees`
--

LOCK TABLES `decision_trees` WRITE;
/*!40000 ALTER TABLE `decision_trees` DISABLE KEYS */;
INSERT INTO `decision_trees` VALUES (1,'DOC-2','mdg_1','ALL','Aflibercept may be indicated when ALL of the following are present:','','','indication','DOC-2_data.json','2026-09-09 05:08:01','2026-09-09 05:08:01'),(2,'DOC-2','mdg_1.2','ALL','No active intraocular inflammation','Is there documentation in the medical record that the patient has no active intraocular inflammation when aflibercept is being considered?','Explicit','indication','DOC-2_data.json','2026-09-09 05:08:01','2026-09-09 05:08:01'),(3,'DOC-2','mdg_1.3','ALL','No concurrent ocular or periocular infection','Is there documentation that the patient does not have a concurrent ocular or periocular infection?','Explicit','indication','DOC-2_data.json','2026-09-09 05:08:01','2026-09-09 05:08:01'),(4,'DOC-2','mdg_1.1','ANY','Clinical diagnosis of 1 or more of the following:','','','indication','DOC-2_data.json','2026-09-09 05:08:01','2026-09-09 05:08:01'),(5,'DOC-2','mdg_1.1.1','ANY','Diabetic macular edema','Is there documentation in the medical record of a clinical diagnosis of diabetic macular edema for which aflibercept may be indicated?','Explicit','indication','DOC-2_data.json','2026-09-09 05:08:01','2026-09-09 05:08:01'),(6,'DOC-2','mdg_1.1.2','ANY','Diabetic retinopathy','Is there documentation in the medical record of a clinical diagnosis of diabetic retinopathy that would support the use of aflibercept?','Explicit','indication','DOC-2_data.json','2026-09-09 05:08:01','2026-09-09 05:08:01'),(7,'DOC-2','mdg_1.1.3','ANY','Macular edema following central or branch retinal vein occlusion','Is there documentation of a clinical diagnosis of macular edema following central or branch retinal vein occlusion in the medical record?','Explicit','indication','DOC-2_data.json','2026-09-09 05:08:01','2026-09-09 05:08:01'),(8,'DOC-2','mdg_1.1.4','ANY','Metastatic colorectal cancer with progression of disease on initial therapy','Is there documentation that the patient has metastatic colorectal cancer with progression of disease on initial therapy and a clinical diagnosis supporting the use of aflibercept when all required criteria are present?','Explicit','indication','DOC-2_data.json','2026-09-09 05:08:01','2026-09-09 05:08:01'),(9,'DOC-2','mdg_1.1.5','ANY','Neovascular (wet, or exudative) age-related macular degeneration','Is there documentation that the patient has neovascular (wet or exudative) age-related macular degeneration and a clinical diagnosis supporting the use of aflibercept when all required criteria are present?','Explicit','indication','DOC-2_data.json','2026-09-09 05:08:01','2026-09-09 05:08:01'),(10,'DOC-2','mdg_1.1.6','ANY','Retinopathy of prematurity','Is there documentation in the medical record of a clinical diagnosis of retinopathy of prematurity for which aflibercept treatment is being considered?','Explicit','indication','DOC-2_data.json','2026-09-09 05:08:01','2026-09-09 05:08:01');
/*!40000 ALTER TABLE `decision_trees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `document_id` varchar(200) NOT NULL,
  `cpt_code` varchar(50) DEFAULT NULL,
  `document_type` varchar(50) DEFAULT NULL,
  `document_title` text,
  `retrieval_time` datetime DEFAULT NULL,
  `document_source` varchar(100) DEFAULT NULL,
  `document_path` varchar(200) DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  `updated_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_documents_document_id` (`document_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,'DOC-2','67028','MCG','AC - Aflibercept-A-0680','2026-09-09 04:50:52','upload-file','AC - Aflibercept.html','2026-09-09 10:20:51','2026-09-09 10:20:51');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_guidelines`
--

DROP TABLE IF EXISTS `medical_guidelines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_guidelines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `document_id` varchar(200) NOT NULL,
  `medical_guideline_id` varchar(255) NOT NULL,
  `medical_guideline_body` text NOT NULL,
  `medical_guideline_type` varchar(100) NOT NULL,
  `category` varchar(30) NOT NULL,
  `classification_type` varchar(100) NOT NULL,
  `extraction_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_medical_guidelines_medical_guideline_id` (`medical_guideline_id`),
  KEY `ix_medical_guidelines_document_id` (`document_id`),
  CONSTRAINT `medical_guidelines_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `documents` (`document_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_guidelines`
--

LOCK TABLES `medical_guidelines` WRITE;
/*!40000 ALTER TABLE `medical_guidelines` DISABLE KEYS */;
INSERT INTO `medical_guidelines` VALUES (1,'DOC-2','mdg_1.2','No active intraocular inflammation','regular','Explicit','indication','2026-09-09 04:51:32'),(2,'DOC-2','mdg_1.3','No concurrent ocular or periocular infection','regular','Explicit','indication','2026-09-09 04:51:32'),(3,'DOC-2','mdg_1.1.1','Diabetic macular edema','regular','Explicit','indication','2026-09-09 04:51:32'),(4,'DOC-2','mdg_1.1.2','Diabetic retinopathy','regular','Explicit','indication','2026-09-09 04:51:32'),(5,'DOC-2','mdg_1.1.3','Macular edema following central or branch retinal vein occlusion','regular','Explicit','indication','2026-09-09 04:51:32'),(6,'DOC-2','mdg_1.1.4','Metastatic colorectal cancer with progression of disease on initial therapy','regular','Explicit','indication','2026-09-09 04:51:32'),(7,'DOC-2','mdg_1.1.5','Neovascular (wet, or exudative) age-related macular degeneration','regular','Explicit','indication','2026-09-09 04:51:32'),(8,'DOC-2','mdg_1.1.6','Retinopathy of prematurity','regular','Explicit','indication','2026-09-09 04:51:32');
/*!40000 ALTER TABLE `medical_guidelines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_evaluation`
--

DROP TABLE IF EXISTS `question_evaluation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_evaluation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` varchar(100) NOT NULL,
  `document_id` varchar(200) NOT NULL,
  `relevancy` decimal(11,2) DEFAULT NULL,
  `relevancy_justification` text,
  `accuracy` int DEFAULT NULL,
  `accuracy_justification` text,
  `clarity` int DEFAULT NULL,
  `clarity_justification` text,
  `completeness` decimal(11,2) DEFAULT NULL,
  `completeness_justification` text,
  `confidence_score` decimal(11,2) DEFAULT NULL,
  `justifications_summary` text,
  `confidence_level` varchar(50) DEFAULT NULL,
  `evaluation_time` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `ix_question_evaluation_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_evaluation`
--

LOCK TABLES `question_evaluation` WRITE;
/*!40000 ALTER TABLE `question_evaluation` DISABLE KEYS */;
INSERT INTO `question_evaluation` VALUES (1,'Q_1','DOC-2',1.00,'The question directly asks about the presence or absence of active intraocular inflammation, which exactly matches the stated medical guideline \'No active intraocular inflammation\' and fits the clinical context of determining eligibility for aflibercept.',1,'The question uses correct medical terminology (\'active intraocular inflammation\') and appropriately focuses on documentation in the medical record, which is consistent with standard clinical and utilization review practices.',1,'The question is straightforward, specific, and interpretable in only one way: confirming whether the chart documents absence of active intraocular inflammation. There is no ambiguous or vague language.',0.75,'The question includes the key condition (no active intraocular inflammation) and specifies that it must be documented in the medical record, which is sufficient for this single criterion. However, it does not reference timing (e.g., current vs historical documentation) or specify acceptable forms of documentation, which could be relevant nuances in some guideline-based determinations.',0.94,'The question is well-constructed and clinically appropriate: it directly aligns with the guideline “No active intraocular inflammation,” uses correct medical terminology, and is clear and unambiguous in asking whether the chart documents absence of active intraocular inflammation. It includes the key requirement and the need for documentation in the medical record, but it does not address timing (current vs historical status) or define what forms of documentation are acceptable, which could matter in some guideline-based decisions.','High','2026-09-09 04:53:28'),(2,'Q_2','DOC-2',1.00,'The question directly addresses the exact exclusion criterion stated in the medical guideline (\'No concurrent ocular or periocular infection\') and fits the clinical context of determining whether aflibercept may be indicated when all listed conditions are met.',1,'The question uses correct medical terminology (\'ocular or periocular infection\') that matches the guideline language and accurately reflects the clinical requirement that such infections be absent.',1,'The question is straightforward, unambiguous, and can be interpreted in only one way: confirming documented absence of concurrent ocular or periocular infection.',0.75,'The question includes the key elements needed to assess the guideline criterion (presence or absence of concurrent ocular or periocular infection and the need for documentation). It could be slightly more complete by specifying timing (e.g., at the time of aflibercept administration) but is otherwise sufficient for guideline-based decision-making.',0.94,'The question is clear, accurate, and guideline-aligned: it directly addresses the exclusion criterion of “no concurrent ocular or periocular infection,” uses correct matching terminology, is unambiguous in asking to confirm documented absence of such infection, and includes the key elements needed to assess the criterion. It could be marginally improved by explicitly stating the timing (e.g., “at the time of aflibercept administration”), but it is otherwise sufficient for guideline-based decision-making.','High','2026-09-09 04:53:28'),(3,'Q_3','DOC-2',1.00,'The question directly addresses the presence of a clinical diagnosis of diabetic macular edema and links it to consideration of aflibercept treatment, which aligns precisely with the stated guideline and clinical context.',1,'The terminology used (clinical diagnosis, diabetic macular edema, aflibercept) is medically correct and consistent with current standards for documenting indication for anti-VEGF therapy in DME.',1,'The question is generally clear and interpretable, but the phrase \'for which aflibercept treatment is being considered\' could be read as either a current or future consideration and does not specify by whom, leaving minor room for interpretation.',0.75,'The question captures two key elements: documented diagnosis of DME and linkage to aflibercept consideration. However, it does not explicitly reference all required conditions under which aflibercept may be indicated (e.g., severity, prior treatments, visual acuity criteria), so it is not fully comprehensive for guideline-based decision-making.',0.88,'The question is medically accurate and clearly links a documented clinical diagnosis of diabetic macular edema to consideration of aflibercept, using appropriate terminology. It is generally clear but slightly ambiguous about who is considering treatment and whether this is a current or future plan. While it correctly addresses diagnosis and treatment linkage, it does not include all guideline-based criteria for aflibercept use (such as disease severity, prior therapies, or visual acuity requirements), so it is not fully comprehensive for treatment decision-making.','High','2026-09-09 04:53:28'),(4,'Q_4','DOC-2',1.00,'The question directly addresses the presence of a clinical diagnosis of diabetic retinopathy and links it to consideration of aflibercept treatment, which fits squarely within the stated guideline and clinical context about clinical diagnosis and indications for aflibercept.',1,'The terminology used—\"clinical diagnosis,\" \"diabetic retinopathy,\" and \"aflibercept treatment\"—is medically correct and consistent with current standards for documenting indications for anti-VEGF therapy in diabetic retinopathy.',1,'The question is mostly clear but slightly conflates two elements: documentation of diagnosis and the separate decision process of considering aflibercept. It could be interpreted as asking either about documentation alone or about both documentation and treatment intent, which introduces minor ambiguity.',0.75,'The question captures two key components: documented diagnosis of diabetic retinopathy and that aflibercept is being considered. However, it does not specify the required severity, laterality, or other clinical criteria that might be part of the full indication set (e.g., presence of DME, vision criteria), so it is not fully comprehensive for guideline-based decision-making.',0.88,'The question is medically accurate and aligned with guidelines, correctly linking a clinical diagnosis of diabetic retinopathy to consideration of aflibercept. However, it slightly blurs the line between documenting the diagnosis and deciding on treatment, creating minor ambiguity. It also omits important clinical details—such as severity, laterality, presence of diabetic macular edema, and vision criteria—so it does not fully capture all guideline-based indications for aflibercept.','High','2026-09-09 04:53:28'),(5,'Q_5','DOC-2',1.00,'The question directly asks about the presence of a clinical diagnosis of macular edema following central or branch retinal vein occlusion, which exactly matches the named guideline and the clinical context of establishing this diagnosis as a prerequisite.',1,'The terminology used—macular edema, central retinal vein occlusion, branch retinal vein occlusion, and documentation in the medical record—is medically correct and consistent with standard ophthalmologic and policy language.',1,'The question is straightforward, specific, and interpretable in only one way: it asks whether such a diagnosis is documented. There is no ambiguous or vague phrasing.',0.75,'The question includes the key condition (macular edema) and its etiologies (central or branch retinal vein occlusion) and specifies documentation in the medical record, which is sufficient to assess this criterion. However, it does not specify timing, laterality, or diagnostic method (e.g., clinical exam vs imaging), which could be relevant nuances in some guideline implementations.',0.94,'The question is clear, medically accurate, and directly aligned with the guideline: it asks whether there is a documented clinical diagnosis of macular edema due to central or branch retinal vein occlusion. It is specific and unambiguous, including the key condition, its causes, and the requirement for documentation in the medical record. The only missing nuances are details like timing, laterality, and diagnostic method, which might matter in some implementations but are not necessary to assess the basic criterion.','High','2026-09-09 04:53:28'),(6,'Q_6','DOC-2',1.00,'The question directly references metastatic colorectal cancer with progression on initial therapy and explicitly ties this to aflibercept use when all required criteria are present, which matches the stated guideline and clinical context.',1,'The terminology (metastatic colorectal cancer, progression of disease on initial therapy, clinical diagnosis, aflibercept) is medically correct and consistent with standard oncology and drug-coverage language, with no evident factual errors.',1,'The overall intent is clear—verifying documentation of diagnosis and criteria for aflibercept—but the phrase \'a clinical diagnosis supporting the use of aflibercept when all required criteria are present\' is somewhat convoluted and could be interpreted as either confirming diagnosis alone or diagnosis plus all criteria, making it slightly ambiguous.',0.75,'The question includes the key elements: metastatic colorectal cancer, progression on initial therapy, and the need for documentation supporting aflibercept use when criteria are met. However, it does not explicitly reference or enumerate the specific required criteria or the listed clinical diagnoses from the context, which would make the decision more fully specified.',0.88,'The statement is medically accurate and aligned with guidelines: it correctly links metastatic colorectal cancer with progression on initial therapy to aflibercept use. The terminology is appropriate and factually sound. However, the phrase “a clinical diagnosis supporting the use of aflibercept when all required criteria are present” is slightly ambiguous about whether it refers only to the diagnosis or to the diagnosis plus all criteria. The question also omits explicit mention of the specific required criteria or listed clinical diagnoses, so the decision framework is not fully spelled out, even though the key elements (metastatic colorectal cancer, progression on initial therapy, and documentation for aflibercept) are present.','High','2026-09-09 04:53:28'),(7,'Q_7','DOC-2',1.00,'The question directly addresses the presence of a clinical diagnosis of neovascular (wet or exudative) age-related macular degeneration and explicitly links it to potential indication for aflibercept, which is exactly the focus of the stated guideline and clinical context.',1,'The terminology used—neovascular (wet or exudative) age-related macular degeneration and aflibercept—is medically correct and consistent with current clinical standards and guideline language for this condition and its treatment.',1,'The question is generally clear and interpretable, but the phrase \'for which aflibercept may be indicated\' could be read either as a requirement to confirm indication criteria or simply as a general statement of potential use, introducing minor ambiguity.',0.50,'The question covers the key element of having a documented clinical diagnosis but does not explicitly address all required conditions under which aflibercept may be indicated (e.g., specific clinical findings or additional criteria implied by \'Aflibercept may be indicated when ALL of the following are present\'). It captures only one component of the full decision framework.',0.81,'The question is medically accurate and clearly focused on whether a patient has a documented diagnosis of neovascular (wet/exudative) AMD that could warrant aflibercept, using correct terminology aligned with guidelines. However, it is slightly ambiguous about whether it is merely noting potential use or requiring confirmation that all indication criteria are met, and it only addresses the presence of the diagnosis rather than the full set of conditions needed for aflibercept to be indicated.','High','2026-09-09 04:53:28'),(8,'Q_8','DOC-2',1.00,'The question directly addresses the presence of a clinical diagnosis of retinopathy of prematurity in the chart and links it to the consideration or use of aflibercept, which is explicitly within the stated guideline and clinical context.',1,'The terminology is correct (retinopathy of prematurity, aflibercept, clinical diagnosis, medical record) and reflects standard clinical and documentation practices consistent with current use of anti-VEGF agents in ROP.',1,'The question is generally clear and interpretable, but the phrase \'for which aflibercept is being considered or used\' could be read as either current consideration, planned use, or past use, leaving a small ambiguity in temporal scope.',0.75,'The question captures the key elements of diagnosis and linkage to aflibercept use, but it does not specify disease stage, severity, or other required criteria from the guideline (e.g., specific ROP zones or plus disease) that might be necessary for a full guideline-based decision.',0.88,'The question is clinically appropriate and uses correct terminology, clearly linking a documented diagnosis of retinopathy of prematurity in the medical record to the consideration or use of aflibercept. However, it is slightly ambiguous about timing (whether aflibercept is currently, previously, or prospectively used) and does not include important guideline-based details such as ROP stage, zone, or presence of plus disease that may be required for a complete, criteria-based decision.','High','2026-09-09 04:53:28');
/*!40000 ALTER TABLE `question_evaluation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions_generation`
--

DROP TABLE IF EXISTS `questions_generation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions_generation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `document_id` varchar(200) NOT NULL,
  `question_id` varchar(100) NOT NULL,
  `medical_guideline_id` varchar(255) NOT NULL,
  `medical_guideline_body` text NOT NULL,
  `question` text NOT NULL,
  `medical_guideline_type` varchar(100) NOT NULL,
  `category` varchar(30) NOT NULL,
  `classification_type` varchar(100) NOT NULL,
  `generation_time` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `ix_questions_generation_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions_generation`
--

LOCK TABLES `questions_generation` WRITE;
/*!40000 ALTER TABLE `questions_generation` DISABLE KEYS */;
INSERT INTO `questions_generation` VALUES (1,'DOC-2','Q_1','mdg_1.2','No active intraocular inflammation','Is there documentation in the medical record that the patient has no active intraocular inflammation?','regular','Explicit','indication','2026-09-09 04:53:28','2026-09-09 04:53:28','2026-09-09 04:53:28'),(2,'DOC-2','Q_2','mdg_1.3','No concurrent ocular or periocular infection','Is there documentation that the patient does not have a concurrent ocular or periocular infection?','regular','Explicit','indication','2026-09-09 04:53:28','2026-09-09 04:53:28','2026-09-09 04:53:28'),(3,'DOC-2','Q_3','mdg_1.1.1','Diabetic macular edema','Is there documentation in the medical record of a clinical diagnosis of diabetic macular edema for which aflibercept treatment is being considered?','regular','Explicit','indication','2026-09-09 04:53:28','2026-09-09 04:53:28','2026-09-09 04:53:28'),(4,'DOC-2','Q_4','mdg_1.1.2','Diabetic retinopathy','Is there documentation in the medical record of a clinical diagnosis of diabetic retinopathy for which aflibercept treatment is being considered?','regular','Explicit','indication','2026-09-09 04:53:28','2026-09-09 04:53:28','2026-09-09 04:53:28'),(5,'DOC-2','Q_5','mdg_1.1.3','Macular edema following central or branch retinal vein occlusion','Is there a clinical diagnosis of macular edema following central or branch retinal vein occlusion documented in the medical record?','regular','Explicit','indication','2026-09-09 04:53:28','2026-09-09 04:53:28','2026-09-09 04:53:28'),(6,'DOC-2','Q_6','mdg_1.1.4','Metastatic colorectal cancer with progression of disease on initial therapy','Is there documentation that the patient has metastatic colorectal cancer with progression of disease on initial therapy and a clinical diagnosis supporting the use of aflibercept when all required criteria are present?','regular','Explicit','indication','2026-09-09 04:53:28','2026-09-09 04:53:28','2026-09-09 04:53:28'),(7,'DOC-2','Q_7','mdg_1.1.5','Neovascular (wet, or exudative) age-related macular degeneration','Is there documentation that the patient has a clinical diagnosis of neovascular (wet or exudative) age-related macular degeneration for which aflibercept may be indicated?','regular','Explicit','indication','2026-09-09 04:53:28','2026-09-09 04:53:28','2026-09-09 04:53:28'),(8,'DOC-2','Q_8','mdg_1.1.6','Retinopathy of prematurity','Is there documentation in the medical record of a clinical diagnosis of retinopathy of prematurity for which aflibercept is being considered or used?','regular','Explicit','indication','2026-09-09 04:53:28','2026-09-09 04:53:28','2026-09-09 04:53:28');
/*!40000 ALTER TABLE `questions_generation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_tracker`
--

DROP TABLE IF EXISTS `task_tracker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_tracker` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cpt_code` varchar(50) DEFAULT NULL,
  `payer` varchar(100) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `document_id` varchar(200) NOT NULL,
  `document_type` varchar(200) DEFAULT NULL,
  `document_title` text,
  `due_date` date DEFAULT NULL,
  `priority` varchar(20) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `p_step` varchar(20) DEFAULT 'initial',
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `document_id` (`document_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_tracker`
--

LOCK TABLES `task_tracker` WRITE;
/*!40000 ALTER TABLE `task_tracker` DISABLE KEYS */;
INSERT INTO `task_tracker` VALUES (1,'74174','UHC','ALL','DOC-1','MCG','AC - AbdominalPelvic CT Angiography','2025-09-10','High','Not Started','initial','2025-09-24 02:16:13','2025-09-24 11:14:14'),(2,'67028','UHC','ALL','DOC-2','MCG','AC - Aflibercept-A-0680','2025-09-10','Medium','Complete','step_3','2025-09-24 02:16:13','2026-09-09 05:08:09'),(3,'67028','UHC','ALL','DOC-3','MCG','AC - Aflibercept-A-0195','2025-09-10','Medium','Not Started','initial','2025-09-24 02:16:13','2025-09-26 09:17:53'),(4,'15820-15823,21280,67900-67904','UHC','ALL','DOC-4','MCG','AC - Blepharoplasty, Canthoplasty, and Related Procedures','2025-09-10','High','Not Started','initial','2025-09-24 02:16:13','2025-09-25 20:53:00'),(5,'78608,78815,78816','UHC','ALL','DOC-5','MCG','AC - Brain Positron Emission Tomography (PET) and PET-CT - A-0096','2025-09-10','High','Not Started','initial','2025-09-24 02:16:13','2025-09-26 02:29:58'),(6,'72141-72142,72156','UHC','ALL','DOC-6','MCG','AC - Cervical Spine MRI-A-0057 (AC)','2025-09-10','High','Not Started','initial','2025-09-24 02:16:13','2025-09-26 01:00:28'),(7,'69930,92601–92604,92626-92627','UHC','ALL','DOC-7','MCG','AC - Cochlear Implant-A-0177 (AC)','2025-09-10','High','Not Started','initial','2025-09-24 02:16:13','2025-09-25 23:34:50'),(8,'95249-95251','UHC','ALL','DOC-8','MCG','AC - Continuous Glucose Monitoring-A-0126 (AC)','2025-09-10','Low','Not Started','initial','2025-09-24 02:16:13','2025-09-26 00:34:15'),(9,'94660','UHC','ALL','DOC-9','MCG','AC - Continuous Positive Airway Pressure (CPAP) Device-A-0431 (AC)','2025-09-10','Low','Not Started','initial','2025-09-24 02:16:13','2025-09-25 23:28:59'),(10,'96372,96401','UHC','ALL','DOC-10','MCG','AC - Denosumab-A-0644 (AC)','2025-09-10','Medium','Not Started','initial','2025-09-24 02:16:13','2025-09-25 11:38:14'),(11,'64490-64495','UHC','ALL','DOC-11','MCG','AC - Facet Joint Injection-A-0695 (AC)','2025-09-10','High','Not Started','initial','2025-09-24 02:16:13','2025-09-25 10:00:00'),(12,'64633-64636','UHC','ALL','DOC-12','MCG','AC - Facet Neurotomy-A-0218 (AC)','2025-09-10','High','Not Started','initial','2025-09-24 02:16:13','2025-09-24 12:55:46'),(13,'80426','UHC','ALL','DOC-13','MCG','AC - Gonadotropin-Releasing Hormone (GnRH) Agonists-A-0304 (AC)','2025-09-10','High','Not Started','initial','2025-09-24 02:16:13','2025-09-25 10:09:50'),(14,'704945','UHC','ALL','DOC-14','MCG','AC - Head CT Angiography (CTA)-A-0484 (AC)','2025-09-10','High','Not Started','initial','2025-09-24 02:39:13','2025-09-25 10:03:24'),(15,'70546','UHC','UT','DOC-15','MCG','AC - Head MR Angiography (MRA)-A-0033 (AC)','2025-09-10','High','Not Started','initial','2025-09-24 02:42:58','2025-09-24 20:53:35'),(16,'96365,96366,96372','UHC','ALL','DOC-16','MCG','AC - Immune Globulin (IVIG and SCIG)-A-0310 (AC)','2025-09-10','High','Not Started','initial','2025-09-24 02:44:09','2025-09-25 10:09:30'),(17,'63650,63685,63661,63663,63688','UHC','ALL','DOC-17','MCG','AC - Implanted Electrical Stimulator Spinal Cord-A-0243 (AC)','2025-09-10','High','Not Started','initial','2025-09-24 02:50:33','2025-09-24 20:24:35'),(18,'33285,33289,93298,93727','UHC','ALL','DOC-18','MCG','AC - Loop Recorder (Cardiac Event Monitor) Implantable-A-0122 (AC)','2025-09-10','High','Not Started','initial','2025-09-24 02:56:09','2025-09-25 10:10:36');
/*!40000 ALTER TABLE `task_tracker` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-09 11:25:10
