-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 01, 2025 at 03:06 PM
-- Server version: 8.0.42-0ubuntu0.20.04.1
-- PHP Version: 7.4.3-4ubuntu2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `online_examination_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins_tbl`
--

CREATE TABLE `admins_tbl` (
  `admin_id` int NOT NULL COMMENT 'Unique ID for Admin',
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) NOT NULL COMMENT 'Hashed password',
  `email` varchar(100) NOT NULL COMMENT 'Admin email',
  `address` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Enter Address',
  `dob` date NOT NULL DEFAULT '1000-01-01',
  `mobile_number` varchar(10) NOT NULL,
  `aadhar_number` varchar(15) NOT NULL,
  `designation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Enter Designation',
  `organization_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Enter Organization Name',
  `gender` varchar(6) NOT NULL,
  `years_of_experience` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `field_of_speciality` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Enter your specialization',
  `total_views` int NOT NULL DEFAULT '0',
  `role` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Update timestamp',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 False, 1 True'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `admins_tbl`:
--

-- --------------------------------------------------------

--
-- Table structure for table `assessed_exam_tbl`
--

CREATE TABLE `assessed_exam_tbl` (
  `assessed_exam_id` int NOT NULL,
  `exam_id` int NOT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `assessed_exam_tbl`:
--   `exam_id`
--       `exam_tbl` -> `exam_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `batches_tbl`
--

CREATE TABLE `batches_tbl` (
  `batch_id` int NOT NULL COMMENT 'Unique ID for batch',
  `batch_name` varchar(100) NOT NULL COMMENT 'Name of the batch',
  `created_by` int NOT NULL COMMENT 'Stores the Id of the Admin',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `batches_tbl`:
--   `created_by`
--       `admins_tbl` -> `admin_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `batch_students_tbl`
--

CREATE TABLE `batch_students_tbl` (
  `id` int NOT NULL COMMENT 'Unique ID for mapping',
  `batch_id` int NOT NULL COMMENT 'Batch ID',
  `student_id` int NOT NULL COMMENT 'Student ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `batch_students_tbl`:
--   `batch_id`
--       `batches_tbl` -> `batch_id`
--   `student_id`
--       `students_tbl` -> `student_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `category_tbl`
--

CREATE TABLE `category_tbl` (
  `category_id` int NOT NULL COMMENT 'Unique ID for category',
  `category_name` varchar(100) NOT NULL COMMENT 'Name of category',
  `created_by` int NOT NULL COMMENT 'Stores the Id of the Admin',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `category_tbl`:
--   `created_by`
--       `admins_tbl` -> `admin_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `exam_activity_logs_tbl`
--

CREATE TABLE `exam_activity_logs_tbl` (
  `log_id` int NOT NULL COMMENT 'Unique log ID',
  `student_id` int NOT NULL COMMENT 'Student taking the exam',
  `exam_id` int NOT NULL COMMENT 'Exam in progress',
  `action_type` varchar(50) NOT NULL COMMENT 'Type of action (Tab Switch, Copy, Inactivity)',
  `action_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp of action'
) ;

--
-- RELATIONSHIPS FOR TABLE `exam_activity_logs_tbl`:
--   `student_id`
--       `students_tbl` -> `student_id`
--   `exam_id`
--       `exam_tbl` -> `exam_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `exam_attempts_tbl`
--

CREATE TABLE `exam_attempts_tbl` (
  `attempt_id` int NOT NULL COMMENT 'Unique ID for exam attempt',
  `student_id` int NOT NULL COMMENT 'Student taking the exam',
  `exam_id` int NOT NULL COMMENT 'Associated exam',
  `attempt_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Attempt timestamp',
  `submission_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `exam_attempts_tbl`:
--   `student_id`
--       `students_tbl` -> `student_id`
--   `exam_id`
--       `exam_tbl` -> `exam_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `exam_batches_tbl`
--

CREATE TABLE `exam_batches_tbl` (
  `id` int NOT NULL COMMENT 'Unique ID for mapping',
  `exam_id` int NOT NULL COMMENT 'Exam ID',
  `batch_id` int NOT NULL COMMENT 'Batch ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `exam_batches_tbl`:
--   `exam_id`
--       `exam_tbl` -> `exam_id`
--   `batch_id`
--       `batches_tbl` -> `batch_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `exam_questions_tbl`
--

CREATE TABLE `exam_questions_tbl` (
  `id` int NOT NULL COMMENT 'Unique ID for mapping',
  `exam_id` int NOT NULL COMMENT 'Associated exam',
  `question_id` int NOT NULL COMMENT 'Question assigned to the exam',
  `marks` int NOT NULL COMMENT 'Marks assigned to this question in this exam',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `exam_questions_tbl`:
--   `exam_id`
--       `exam_tbl` -> `exam_id`
--   `question_id`
--       `question_tbl` -> `question_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `exam_results_tbl`
--

CREATE TABLE `exam_results_tbl` (
  `result_id` int NOT NULL COMMENT 'Unique ID for exam result',
  `attempt_id` int NOT NULL,
  `obtained_marks` float NOT NULL COMMENT 'Marks obtained by the student',
  `result_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Result timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `exam_results_tbl`:
--

-- --------------------------------------------------------

--
-- Table structure for table `exam_student_tbl`
--

CREATE TABLE `exam_student_tbl` (
  `exam_student_id` int NOT NULL,
  `exam_id` int NOT NULL,
  `student_id` int NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `exam_student_tbl`:
--   `student_id`
--       `students_tbl` -> `student_id`
--   `exam_id`
--       `exam_tbl` -> `exam_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `exam_tbl`
--

CREATE TABLE `exam_tbl` (
  `exam_id` int NOT NULL COMMENT 'Unique ID for exam',
  `exam_name` varchar(100) NOT NULL COMMENT 'Exam title',
  `exam_description` varchar(100) NOT NULL,
  `duration` int DEFAULT NULL COMMENT 'Duration in minutes',
  `total_marks` int DEFAULT NULL COMMENT 'Total marks',
  `passing_marks` int DEFAULT NULL,
  `exam_start_datetime` datetime DEFAULT NULL COMMENT 'Scheduled exam date',
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  `exam_end_datetime` datetime DEFAULT NULL,
  `is_setup_done` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `exam_tbl`:
--

-- --------------------------------------------------------

--
-- Table structure for table `forgot_pass_tbl`
--

CREATE TABLE `forgot_pass_tbl` (
  `forgot_pass_id` int NOT NULL,
  `jwt_token` varchar(1255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `forgot_pass_tbl`:
--

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts_tbl`
--

CREATE TABLE `login_attempts_tbl` (
  `attempt_id` int NOT NULL,
  `student_id` int NOT NULL,
  `attempt_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `success` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `login_attempts_tbl`:
--   `student_id`
--       `students_tbl` -> `student_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `log_history_tbl`
--

CREATE TABLE `log_history_tbl` (
  `id` int NOT NULL,
  `student_id` int NOT NULL,
  `is_login` tinyint(1) NOT NULL DEFAULT '0',
  `login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `logout_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `log_history_tbl`:
--   `student_id`
--       `students_tbl` -> `student_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `mcq_answers_tbl`
--

CREATE TABLE `mcq_answers_tbl` (
  `answer_id` int NOT NULL COMMENT 'Unique ID for answer',
  `question_id` int NOT NULL COMMENT 'Associated question',
  `answer_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'Answer text',
  `is_correct` tinyint(1) DEFAULT '0' COMMENT 'TRUE = Correct answer, FALSE = Incorrect'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `mcq_answers_tbl`:
--   `question_id`
--       `question_tbl` -> `question_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `notifications_tbl`
--

CREATE TABLE `notifications_tbl` (
  `notification_id` int NOT NULL COMMENT 'Unique ID for notification',
  `admin_id` int NOT NULL COMMENT 'Admin sending the notification',
  `batch_id` int DEFAULT NULL COMMENT 'Batch receiving the notification (NULL if for all)',
  `student_id` int DEFAULT NULL COMMENT 'Specific student receiving the notification (NULL if for batch)',
  `message` text NOT NULL COMMENT 'Notification content',
  `notification_type` varchar(20) NOT NULL COMMENT 'Type of notification',
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp of notification',
  `is_read` tinyint(1) DEFAULT '0'
) ;

--
-- RELATIONSHIPS FOR TABLE `notifications_tbl`:
--   `admin_id`
--       `admins_tbl` -> `admin_id`
--   `batch_id`
--       `batches_tbl` -> `batch_id`
--   `student_id`
--       `students_tbl` -> `student_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `plagiarism_reports_tbl`
--

CREATE TABLE `plagiarism_reports_tbl` (
  `report_id` int NOT NULL COMMENT 'Unique report ID',
  `student_id` int NOT NULL COMMENT 'Student whose answer is flagged',
  `exam_id` int NOT NULL COMMENT 'Exam in which plagiarism is detected',
  `question_id` int NOT NULL COMMENT 'Question for which plagiarism is detected',
  `detected_match` int NOT NULL COMMENT 'Another student’s submission that matches',
  `plagiarism_score` decimal(5,2) NOT NULL COMMENT 'Plagiarism percentage (0-100%)',
  `report_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp of detection'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `plagiarism_reports_tbl`:
--   `student_id`
--       `students_tbl` -> `student_id`
--   `exam_id`
--       `exam_tbl` -> `exam_id`
--   `question_id`
--       `question_tbl` -> `question_id`
--   `detected_match`
--       `exam_results_tbl` -> `result_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `question_tbl`
--

CREATE TABLE `question_tbl` (
  `question_id` int NOT NULL COMMENT 'Unique ID for each question',
  `category_id` int NOT NULL COMMENT 'Associated category',
  `question_text` text NOT NULL COMMENT 'Actual question text',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `question_type` varchar(20) NOT NULL COMMENT 'Type of question',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp'
) ;

--
-- RELATIONSHIPS FOR TABLE `question_tbl`:
--   `category_id`
--       `category_tbl` -> `category_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `sessions`:
--

-- --------------------------------------------------------

--
-- Table structure for table `students_tbl`
--

CREATE TABLE `students_tbl` (
  `student_id` int NOT NULL COMMENT 'Unique ID for Student',
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL COMMENT 'Student email',
  `mobile_no` varchar(10) NOT NULL,
  `password` varchar(255) NOT NULL COMMENT 'Hashed password',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update timestamp',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `students_tbl`:
--

-- --------------------------------------------------------

--
-- Table structure for table `student_ans_tbl`
--

CREATE TABLE `student_ans_tbl` (
  `student_ans_id` int NOT NULL,
  `student_id` int NOT NULL,
  `exam_id` int NOT NULL,
  `question_id` int NOT NULL,
  `answer_txt` varchar(1255) NOT NULL,
  `obtained_mark` float NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `student_ans_tbl`:
--

-- --------------------------------------------------------

--
-- Table structure for table `student_recording_tbl`
--

CREATE TABLE `student_recording_tbl` (
  `student_recording_id` int NOT NULL,
  `exam_id` int NOT NULL,
  `student_id` int NOT NULL,
  `recording_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `student_recording_tbl`:
--

-- --------------------------------------------------------

--
-- Table structure for table `user_token`
--

CREATE TABLE `user_token` (
  `id` int NOT NULL,
  `student_id` int NOT NULL,
  `jwt_token` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- RELATIONSHIPS FOR TABLE `user_token`:
--   `student_id`
--       `students_tbl` -> `student_id`
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins_tbl`
--
ALTER TABLE `admins_tbl`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `assessed_exam_tbl`
--
ALTER TABLE `assessed_exam_tbl`
  ADD PRIMARY KEY (`assessed_exam_id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `batches_tbl`
--
ALTER TABLE `batches_tbl`
  ADD PRIMARY KEY (`batch_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `batch_students_tbl`
--
ALTER TABLE `batch_students_tbl`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `batch_id` (`batch_id`,`student_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `category_tbl`
--
ALTER TABLE `category_tbl`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `unique_category_name_admin` (`category_name`,`created_by`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `exam_activity_logs_tbl`
--
ALTER TABLE `exam_activity_logs_tbl`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `exam_attempts_tbl`
--
ALTER TABLE `exam_attempts_tbl`
  ADD PRIMARY KEY (`attempt_id`),
  ADD UNIQUE KEY `student_id` (`student_id`,`exam_id`) COMMENT 'Prevents duplicate exam attempts',
  ADD KEY `idx_exam_id` (`exam_id`);

--
-- Indexes for table `exam_batches_tbl`
--
ALTER TABLE `exam_batches_tbl`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `exam_id` (`exam_id`,`batch_id`),
  ADD KEY `batch_id` (`batch_id`);

--
-- Indexes for table `exam_questions_tbl`
--
ALTER TABLE `exam_questions_tbl`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `exam_id` (`exam_id`,`question_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `exam_results_tbl`
--
ALTER TABLE `exam_results_tbl`
  ADD PRIMARY KEY (`result_id`);

--
-- Indexes for table `exam_student_tbl`
--
ALTER TABLE `exam_student_tbl`
  ADD PRIMARY KEY (`exam_student_id`),
  ADD UNIQUE KEY `unique1` (`exam_id`,`student_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `exam_tbl`
--
ALTER TABLE `exam_tbl`
  ADD PRIMARY KEY (`exam_id`),
  ADD KEY `idx_exam_date` (`exam_start_datetime`);

--
-- Indexes for table `forgot_pass_tbl`
--
ALTER TABLE `forgot_pass_tbl`
  ADD PRIMARY KEY (`forgot_pass_id`);

--
-- Indexes for table `login_attempts_tbl`
--
ALTER TABLE `login_attempts_tbl`
  ADD PRIMARY KEY (`attempt_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `log_history_tbl`
--
ALTER TABLE `log_history_tbl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `mcq_answers_tbl`
--
ALTER TABLE `mcq_answers_tbl`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `notifications_tbl`
--
ALTER TABLE `notifications_tbl`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `admin_id` (`admin_id`),
  ADD KEY `batch_id` (`batch_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `plagiarism_reports_tbl`
--
ALTER TABLE `plagiarism_reports_tbl`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `exam_id` (`exam_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `detected_match` (`detected_match`);

--
-- Indexes for table `question_tbl`
--
ALTER TABLE `question_tbl`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `idx_category_id` (`category_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `students_tbl`
--
ALTER TABLE `students_tbl`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_student_email` (`email`);

--
-- Indexes for table `student_ans_tbl`
--
ALTER TABLE `student_ans_tbl`
  ADD PRIMARY KEY (`student_ans_id`);

--
-- Indexes for table `student_recording_tbl`
--
ALTER TABLE `student_recording_tbl`
  ADD PRIMARY KEY (`student_recording_id`);

--
-- Indexes for table `user_token`
--
ALTER TABLE `user_token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins_tbl`
--
ALTER TABLE `admins_tbl`
  MODIFY `admin_id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique ID for Admin';

--
-- AUTO_INCREMENT for table `assessed_exam_tbl`
--
ALTER TABLE `assessed_exam_tbl`
  MODIFY `assessed_exam_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `batches_tbl`
--
ALTER TABLE `batches_tbl`
  MODIFY `batch_id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique ID for batch';

--
-- AUTO_INCREMENT for table `batch_students_tbl`
--
ALTER TABLE `batch_students_tbl`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique ID for mapping';

--
-- AUTO_INCREMENT for table `category_tbl`
--
ALTER TABLE `category_tbl`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique ID for category';

--
-- AUTO_INCREMENT for table `exam_activity_logs_tbl`
--
ALTER TABLE `exam_activity_logs_tbl`
  MODIFY `log_id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique log ID';

--
-- AUTO_INCREMENT for table `exam_attempts_tbl`
--
ALTER TABLE `exam_attempts_tbl`
  MODIFY `attempt_id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique ID for exam attempt';

--
-- AUTO_INCREMENT for table `exam_batches_tbl`
--
ALTER TABLE `exam_batches_tbl`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique ID for mapping';

--
-- AUTO_INCREMENT for table `exam_questions_tbl`
--
ALTER TABLE `exam_questions_tbl`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique ID for mapping';

--
-- AUTO_INCREMENT for table `exam_results_tbl`
--
ALTER TABLE `exam_results_tbl`
  MODIFY `result_id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique ID for exam result';

--
-- AUTO_INCREMENT for table `exam_student_tbl`
--
ALTER TABLE `exam_student_tbl`
  MODIFY `exam_student_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exam_tbl`
--
ALTER TABLE `exam_tbl`
  MODIFY `exam_id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique ID for exam';

--
-- AUTO_INCREMENT for table `forgot_pass_tbl`
--
ALTER TABLE `forgot_pass_tbl`
  MODIFY `forgot_pass_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_attempts_tbl`
--
ALTER TABLE `login_attempts_tbl`
  MODIFY `attempt_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log_history_tbl`
--
ALTER TABLE `log_history_tbl`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mcq_answers_tbl`
--
ALTER TABLE `mcq_answers_tbl`
  MODIFY `answer_id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique ID for answer';

--
-- AUTO_INCREMENT for table `notifications_tbl`
--
ALTER TABLE `notifications_tbl`
  MODIFY `notification_id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique ID for notification';

--
-- AUTO_INCREMENT for table `plagiarism_reports_tbl`
--
ALTER TABLE `plagiarism_reports_tbl`
  MODIFY `report_id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique report ID';

--
-- AUTO_INCREMENT for table `question_tbl`
--
ALTER TABLE `question_tbl`
  MODIFY `question_id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique ID for each question';

--
-- AUTO_INCREMENT for table `students_tbl`
--
ALTER TABLE `students_tbl`
  MODIFY `student_id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique ID for Student';

--
-- AUTO_INCREMENT for table `student_ans_tbl`
--
ALTER TABLE `student_ans_tbl`
  MODIFY `student_ans_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_recording_tbl`
--
ALTER TABLE `student_recording_tbl`
  MODIFY `student_recording_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_token`
--
ALTER TABLE `user_token`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assessed_exam_tbl`
--
ALTER TABLE `assessed_exam_tbl`
  ADD CONSTRAINT `assessed_exam_tbl_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exam_tbl` (`exam_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `batches_tbl`
--
ALTER TABLE `batches_tbl`
  ADD CONSTRAINT `batches_tbl_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admins_tbl` (`admin_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `batch_students_tbl`
--
ALTER TABLE `batch_students_tbl`
  ADD CONSTRAINT `batch_students_tbl_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `batches_tbl` (`batch_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `batch_students_tbl_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students_tbl` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `category_tbl`
--
ALTER TABLE `category_tbl`
  ADD CONSTRAINT `category_tbl_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admins_tbl` (`admin_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `exam_activity_logs_tbl`
--
ALTER TABLE `exam_activity_logs_tbl`
  ADD CONSTRAINT `exam_activity_logs_tbl_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students_tbl` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exam_activity_logs_tbl_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exam_tbl` (`exam_id`) ON DELETE CASCADE;

--
-- Constraints for table `exam_attempts_tbl`
--
ALTER TABLE `exam_attempts_tbl`
  ADD CONSTRAINT `exam_attempts_tbl_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students_tbl` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exam_attempts_tbl_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exam_tbl` (`exam_id`) ON DELETE CASCADE;

--
-- Constraints for table `exam_batches_tbl`
--
ALTER TABLE `exam_batches_tbl`
  ADD CONSTRAINT `exam_batches_tbl_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exam_tbl` (`exam_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exam_batches_tbl_ibfk_2` FOREIGN KEY (`batch_id`) REFERENCES `batches_tbl` (`batch_id`) ON DELETE CASCADE;

--
-- Constraints for table `exam_questions_tbl`
--
ALTER TABLE `exam_questions_tbl`
  ADD CONSTRAINT `exam_questions_tbl_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exam_tbl` (`exam_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exam_questions_tbl_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question_tbl` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `exam_student_tbl`
--
ALTER TABLE `exam_student_tbl`
  ADD CONSTRAINT `exam_student_tbl_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students_tbl` (`student_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `exam_student_tbl_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exam_tbl` (`exam_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `login_attempts_tbl`
--
ALTER TABLE `login_attempts_tbl`
  ADD CONSTRAINT `login_attempts_tbl_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students_tbl` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `log_history_tbl`
--
ALTER TABLE `log_history_tbl`
  ADD CONSTRAINT `log_history_tbl_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students_tbl` (`student_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `mcq_answers_tbl`
--
ALTER TABLE `mcq_answers_tbl`
  ADD CONSTRAINT `mcq_answers_tbl_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `question_tbl` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications_tbl`
--
ALTER TABLE `notifications_tbl`
  ADD CONSTRAINT `notifications_tbl_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins_tbl` (`admin_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_tbl_ibfk_2` FOREIGN KEY (`batch_id`) REFERENCES `batches_tbl` (`batch_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_tbl_ibfk_3` FOREIGN KEY (`student_id`) REFERENCES `students_tbl` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `plagiarism_reports_tbl`
--
ALTER TABLE `plagiarism_reports_tbl`
  ADD CONSTRAINT `plagiarism_reports_tbl_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students_tbl` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `plagiarism_reports_tbl_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exam_tbl` (`exam_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `plagiarism_reports_tbl_ibfk_3` FOREIGN KEY (`question_id`) REFERENCES `question_tbl` (`question_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `plagiarism_reports_tbl_ibfk_4` FOREIGN KEY (`detected_match`) REFERENCES `exam_results_tbl` (`result_id`) ON DELETE CASCADE;

--
-- Constraints for table `question_tbl`
--
ALTER TABLE `question_tbl`
  ADD CONSTRAINT `question_tbl_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category_tbl` (`category_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_token`
--
ALTER TABLE `user_token`
  ADD CONSTRAINT `user_token_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students_tbl` (`student_id`) ON DELETE CASCADE ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
