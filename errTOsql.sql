-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema liga_natacao
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema liga_natacao
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `liga_natacao` DEFAULT CHARACTER SET utf8 ;
USE `liga_natacao` ;

-- -----------------------------------------------------
-- Table `liga_natacao`.`Usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `liga_natacao`.`Usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cpf` INT(11) NULL,
  `nome` VARCHAR(255) NULL,
  `senha` VARCHAR(45) NULL,
  `celular` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `funcao` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `liga_natacao`.`Equipes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `liga_natacao`.`Equipes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `liga_natacao`.`Nadadores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `liga_natacao`.`Nadadores` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `cpf` VARCHAR(11) NOT NULL,
  `data_nasc` VARCHAR(45) NOT NULL,
  `telefone` VARCHAR(45) NOT NULL,
  `equipes_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Nadadores_Equipes1_idx` (`equipes_id` ASC) VISIBLE,
  CONSTRAINT `fk_Nadadores_Equipes1`
    FOREIGN KEY (`equipes_id`)
    REFERENCES `liga_natacao`.`Equipes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `liga_natacao`.`Categorias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `liga_natacao`.`Categorias` (
  `id` INT NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `liga_natacao`.`TipoProvas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `liga_natacao`.`TipoProvas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `liga_natacao`.`CategoriasTipoProvas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `liga_natacao`.`CategoriasTipoProvas` (
  `Categorias_idCategorias` INT NOT NULL,
  `TipoProvas_idTipoProvas` INT NOT NULL,
  `idCategoriasTiposProvas` INT NOT NULL,
  PRIMARY KEY (`Categorias_idCategorias`, `TipoProvas_idTipoProvas`, `idCategoriasTiposProvas`),
  INDEX `fk_Categorias_has_TipoProvas_TipoProvas1_idx` (`TipoProvas_idTipoProvas` ASC) VISIBLE,
  INDEX `fk_Categorias_has_TipoProvas_Categorias1_idx` (`Categorias_idCategorias` ASC) VISIBLE,
  CONSTRAINT `fk_Categorias_has_TipoProvas_Categorias1`
    FOREIGN KEY (`Categorias_idCategorias`)
    REFERENCES `liga_natacao`.`Categorias` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Categorias_has_TipoProvas_TipoProvas1`
    FOREIGN KEY (`TipoProvas_idTipoProvas`)
    REFERENCES `liga_natacao`.`TipoProvas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `liga_natacao`.`RankingNadadores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `liga_natacao`.`RankingNadadores` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pontos` INT NULL,
  `temporada` YEAR NULL,
  `Nadadores_id` INT NOT NULL,
  `CategoriasTipoProvas_Categorias_idCategorias` INT NOT NULL,
  `CategoriasTipoProvas_TipoProvas_idTipoProvas` INT NOT NULL,
  `CategoriasTipoProvas_idCategoriasTiposProvas` INT NOT NULL,
  PRIMARY KEY (`id`, `Nadadores_id`),
  INDEX `fk_RankingNadadores_Nadadores1_idx` (`Nadadores_id` ASC) VISIBLE,
  INDEX `fk_RankingNadadores_CategoriasTipoProvas1_idx` (`CategoriasTipoProvas_Categorias_idCategorias` ASC, `CategoriasTipoProvas_TipoProvas_idTipoProvas` ASC, `CategoriasTipoProvas_idCategoriasTiposProvas` ASC) VISIBLE,
  CONSTRAINT `fk_RankingNadadores_Nadadores1`
    FOREIGN KEY (`Nadadores_id`)
    REFERENCES `liga_natacao`.`Nadadores` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_RankingNadadores_CategoriasTipoProvas1`
    FOREIGN KEY (`CategoriasTipoProvas_Categorias_idCategorias` , `CategoriasTipoProvas_TipoProvas_idTipoProvas` , `CategoriasTipoProvas_idCategoriasTiposProvas`)
    REFERENCES `liga_natacao`.`CategoriasTipoProvas` (`Categorias_idCategorias` , `TipoProvas_idTipoProvas` , `idCategoriasTiposProvas`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `liga_natacao`.`EventosResultados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `liga_natacao`.`EventosResultados` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `posicao` INT NULL,
  `pontos` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `liga_natacao`.`Eventos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `liga_natacao`.`Eventos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  `data` DATE NULL,
  `cidade` VARCHAR(45) NULL,
  `EventosResultados_idEventosResultados` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Eventos_EventosResultados1_idx` (`EventosResultados_idEventosResultados` ASC) VISIBLE,
  CONSTRAINT `fk_Eventos_EventosResultados1`
    FOREIGN KEY (`EventosResultados_idEventosResultados`)
    REFERENCES `liga_natacao`.`EventosResultados` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `liga_natacao`.`Noticias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `liga_natacao`.`Noticias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `texto` TEXT NOT NULL,
  `titulo` VARCHAR(45) NOT NULL,
  `data` DATE NOT NULL,
  `usuarios_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Noticias_Usuarios1_idx` (`usuarios_id` ASC) VISIBLE,
  CONSTRAINT `fk_Noticias_Usuarios1`
    FOREIGN KEY (`usuarios_id`)
    REFERENCES `liga_natacao`.`Usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `liga_natacao`.`Resultados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `liga_natacao`.`Resultados` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nadadores_id` INT NOT NULL,
  `tipoProvas_idTipoProvas` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Resultados_TipoProvas1_idx` (`tipoProvas_idTipoProvas` ASC) VISIBLE,
  INDEX `fk_Resultados_Nadadores1_idx` (`nadadores_id` ASC) VISIBLE,
  CONSTRAINT `fk_Resultados_TipoProvas1`
    FOREIGN KEY (`tipoProvas_idTipoProvas`)
    REFERENCES `liga_natacao`.`TipoProvas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Resultados_Nadadores1`
    FOREIGN KEY (`nadadores_id`)
    REFERENCES `liga_natacao`.`Nadadores` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `liga_natacao`.`RankingEquipes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `liga_natacao`.`RankingEquipes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pontos` INT NULL,
  `temporada` YEAR NULL,
  `equipes_id` INT NOT NULL,
  `categoriasTipoProvas_Categorias_idCategorias` INT NOT NULL,
  `categoriasTipoProvas_TipoProvas_idTipoProvas` INT NOT NULL,
  `categoriasTipoProvas_idCategoriasTiposProvas` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_RankingEquipes_Equipes1_idx` (`equipes_id` ASC) VISIBLE,
  INDEX `fk_RankingEquipes_CategoriasTipoProvas1_idx` (`categoriasTipoProvas_Categorias_idCategorias` ASC, `categoriasTipoProvas_TipoProvas_idTipoProvas` ASC, `categoriasTipoProvas_idCategoriasTiposProvas` ASC) VISIBLE,
  CONSTRAINT `fk_RankingEquipes_Equipes1`
    FOREIGN KEY (`equipes_id`)
    REFERENCES `liga_natacao`.`Equipes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_RankingEquipes_CategoriasTipoProvas1`
    FOREIGN KEY (`categoriasTipoProvas_Categorias_idCategorias` , `categoriasTipoProvas_TipoProvas_idTipoProvas` , `categoriasTipoProvas_idCategoriasTiposProvas`)
    REFERENCES `liga_natacao`.`CategoriasTipoProvas` (`Categorias_idCategorias` , `TipoProvas_idTipoProvas` , `idCategoriasTiposProvas`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `liga_natacao`.`Records`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `liga_natacao`.`Records` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tempo` TIME NULL,
  `temporada` YEAR NULL,
  `nadadores_id` INT NOT NULL,
  `eventos_idEventos` INT NOT NULL,
  `resultados_idResultados` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Records_Nadadores1_idx` (`nadadores_id` ASC) VISIBLE,
  INDEX `fk_Records_Eventos1_idx` (`eventos_idEventos` ASC) VISIBLE,
  INDEX `fk_Records_Resultados1_idx` (`resultados_idResultados` ASC) VISIBLE,
  CONSTRAINT `fk_Records_Nadadores1`
    FOREIGN KEY (`nadadores_id`)
    REFERENCES `liga_natacao`.`Nadadores` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Records_Eventos1`
    FOREIGN KEY (`eventos_idEventos`)
    REFERENCES `liga_natacao`.`Eventos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Records_Resultados1`
    FOREIGN KEY (`resultados_idResultados`)
    REFERENCES `liga_natacao`.`Resultados` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
