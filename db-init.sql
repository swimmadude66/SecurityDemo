Create Database IF NOT EXISTS securitydemo;

CREATE TABLE IF NOT EXISTS `users` (
  `UserId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `Username` varchar(25) DEFAULT NULL,
  `Password` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `Id_UNIQUE` (`UserId`),
  UNIQUE KEY `Username_UNIQUE` (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `posts` (
  `PostId` int(11) NOT NULL AUTO_INCREMENT,
  `Message` longtext,
  `Author` int(11) NOT NULL,
  PRIMARY KEY (`PostId`),
  UNIQUE KEY `Id_UNIQUE` (`PostId`),
  KEY `authr` (`Author`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `comments` (
  `CommentId` int(11) NOT NULL AUTO_INCREMENT,
  `Message` longtext NOT NULL,
  `PostId` int(11) NOT NULL,
  `Author` int(11) DEFAULT NULL,
  PRIMARY KEY (`CommentId`),
  UNIQUE KEY `Id_UNIQUE` (`CommentId`),
  KEY `post_idx` (`PostId`),
  CONSTRAINT `post` FOREIGN KEY (`PostId`) REFERENCES `posts` (`PostId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
