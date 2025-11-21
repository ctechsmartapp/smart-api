-- Delete existing database
DROP DATABASE IF EXISTS `smart-api-db`;

-- Create database
CREATE DATABASE `smart-api-db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- Switch to database
USE `smart-api-db`;

-- Users Table
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `firstname` VARCHAR(255) NOT NULL,
  `lastname` VARCHAR(255) NOT NULL,
  `role` TINYINT NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `otp_hash` VARCHAR(255),
  `otp_expiration` TIMESTAMP NULL
);

-- Consultants Table
CREATE TABLE `consultants` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `firstname` VARCHAR(255) NOT NULL,
  `lastname` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255),
  `legal_status` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT,
  FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
);

-- Submissions Table
CREATE TABLE `submissions` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `consultant_id` INT NOT NULL,
  `technology` VARCHAR(255) NOT NULL,
  `vendor` VARCHAR(255) NOT NULL,
  `client` VARCHAR(255) NOT NULL,
  `interview_date` DATETIME,
  `comments` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT  NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT NOT NULL,
  FOREIGN KEY (`consultant_id`) REFERENCES `consultants` (`id`) ON DELETE CASCADE
);
