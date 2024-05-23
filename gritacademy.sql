-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1:3306
-- Tid vid skapande: 23 maj 2024 kl 11:48
-- Serverversion: 8.3.0
-- PHP-version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `gritacademy`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `courses`
--

DROP TABLE IF EXISTS `courses`;
CREATE TABLE IF NOT EXISTS `courses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumpning av Data i tabell `courses`
--

INSERT INTO `courses` (`id`, `name`, `description`) VALUES
(27, 'FE23', 'Front end development'),
(28, 'Java22', 'Java development'),
(29, 'BE22', 'Back end development'),
(30, 'FU23', 'Fullstack development'),
(31, 'UX23', 'UX design');

-- --------------------------------------------------------

--
-- Tabellstruktur `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fName` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `lName` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `town` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumpning av Data i tabell `students`
--

INSERT INTO `students` (`id`, `fName`, `lName`, `town`) VALUES
(42, 'Emma', 'Andersson', 'Malmo'),
(43, 'Oscar', 'Johansson', 'Lund'),
(44, 'Sofia', 'Nilsson', 'Malmo'),
(45, 'Lucas', 'Karlsson', 'Trelleborg'),
(46, 'Elin', 'Pettersson', 'Vellinge'),
(47, 'John', 'Doe', 'Malmo'),
(48, 'Isabella', 'Berg', 'Staffanstorp'),
(49, 'David ', 'Eriksson', 'Helsingborg'),
(50, 'Julia', 'Svensson', 'Helsingborg'),
(51, 'Victor', 'Gustafsson', 'Lund'),
(53, 'Andrea', 'Jandergren', 'Malmo');

-- --------------------------------------------------------

--
-- Tabellstruktur `students_courses`
--

DROP TABLE IF EXISTS `students_courses`;
CREATE TABLE IF NOT EXISTS `students_courses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `students_id` bigint DEFAULT NULL,
  `courses_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `students_id` (`students_id`),
  KEY `courses_id` (`courses_id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumpning av Data i tabell `students_courses`
--

INSERT INTO `students_courses` (`id`, `students_id`, `courses_id`) VALUES
(43, 42, 27),
(44, 43, 27),
(45, 44, 27),
(46, 45, 28),
(47, 46, 28),
(48, 47, 28),
(49, 48, 29),
(50, 49, 29),
(51, 50, 30),
(52, 51, 30),
(53, 53, 31);

--
-- Restriktioner för dumpade tabeller
--

--
-- Restriktioner för tabell `students_courses`
--
ALTER TABLE `students_courses`
  ADD CONSTRAINT `students_courses_ibfk_1` FOREIGN KEY (`students_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `students_courses_ibfk_2` FOREIGN KEY (`courses_id`) REFERENCES `courses` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
