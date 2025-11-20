-- MySQL Workbench Forward Engineering (Cleaned & Fixed)

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema frivilligOrg
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `frivilligOrg`;
CREATE SCHEMA IF NOT EXISTS `frivilligOrg` DEFAULT CHARACTER SET utf8;
USE `frivilligOrg`;

-- -----------------------------------------------------
-- Table Brukere
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Brukere`;

CREATE TABLE `Brukere` (
  `brukernavn` VARCHAR(15) NOT NULL,
  `passord` VARCHAR(60),
  `email` VARCHAR(30),
  `visningsnavn` VARCHAR(20),
  PRIMARY KEY (`brukernavn`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table Arrangementer
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Arrangementer`;

CREATE TABLE `Arrangementer` (
  `arrangementID` INT NOT NULL AUTO_INCREMENT,
  `innhold` TEXT,
  `tittel` VARCHAR(45),
  `start` DATETIME,
  `slutt` DATETIME,
  PRIMARY KEY (`arrangementID`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table Paameldte (Many-to-Many)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Paameldte`;

CREATE TABLE `Paameldte` (
  `brukernavn` VARCHAR(15) NOT NULL,
  `arrangementID` INT NOT NULL,
  PRIMARY KEY (`brukernavn`, `arrangementID`),

  INDEX `idx_paameldte_arrangementID` (`arrangementID`),
  INDEX `idx_paameldte_brukernavn` (`brukernavn`),

  CONSTRAINT `fk_paameldte_bruker`
    FOREIGN KEY (`brukernavn`)
    REFERENCES `Brukere` (`brukernavn`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT `fk_paameldte_arrangement`
    FOREIGN KEY (`arrangementID`)
    REFERENCES `Arrangementer` (`arrangementID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
