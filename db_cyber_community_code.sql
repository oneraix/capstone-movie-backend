-- SQLBook: Code
-- Kiểm tra version
SELECT VERSION();

-- database
CREATE DATABASE IF NOT EXISTS db_cyber_community; 
USE db_cyber_community;

-- table template
CREATE TABLE `TABLE_TEMPLATE` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- table
-- PRIMARY KEY: kết hợp của NOT NULL và UNIQUE
CREATE TABLE `Roles` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	
	`name` VARCHAR(255),
	`description` VARCHAR(255),
	`isActive` BOOL DEFAULT 1,
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Thêm dữ liệu
INSERT INTO `Roles` (`name`, `description`) VALUES
('ROLE_ADMIN', 'Quản Trị Hệ Thống'),
('ROLE_USER', 'Người Dùng Hệ Thống')

CREATE TABLE `Users` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`fullName` VARCHAR(255),
	`avatar` VARCHAR(255),
	`password` VARCHAR(255),
	`facebookId` VARCHAR(255) UNIQUE,
	`googleId` VARCHAR(255) UNIQUE,
	`roleId` INT NOT NULL DEFAULT 2,
		
	FOREIGN KEY (`roleId`) REFERENCES `Roles` (`id`),
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `Articles` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	
	`title` VARCHAR(255),  
    `content` TEXT,   
	`imageUrl` VARCHAR(500),
	`views` INT NOT NULL DEFAULT 0,
	`userId` INT NOT NULL,
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO `Articles` (`content`, `imageUrl`, `views`, `userId`, `createdAt`, `updatedAt`)
VALUES
('Content about learning NextJS...', 'https://picsum.photos/seed/1/600/400', 15, 1, '2024-01-01 08:00:00', '2024-01-01 08:00:00'),
('Content about mastering React Query...', 'https://picsum.photos/seed/2/600/400', 32, 2, '2024-01-02 09:00:00', '2024-01-02 09:00:00'),
('Content about JavaScript tips...', 'https://picsum.photos/seed/3/600/400', 45, 1, '2024-01-03 10:00:00', '2024-01-03 10:00:00'),
('Comparison content...', 'https://picsum.photos/seed/4/600/400', 27, 3, '2024-01-04 11:00:00', '2024-01-04 11:00:00'),
('Content about TypeScript...', 'https://picsum.photos/seed/5/600/400', 12, 2, '2024-01-05 12:00:00', '2024-01-05 12:00:00'),
( 'Content about SQL joins...', 'https://picsum.photos/seed/6/600/400', 8, 3, '2024-01-06 13:00:00', '2024-01-06 13:00:00'),
('Extensions content...', 'https://picsum.photos/seed/7/600/400', 60, 1, '2024-01-07 14:00:00', '2024-01-07 14:00:00'),
('Content about React optimization...', 'https://picsum.photos/seed/8/600/400', 33, 2, '2024-01-08 15:00:00', '2024-01-08 15:00:00'),
( 'Content about API design...', 'https://picsum.photos/seed/9/600/400', 18, 3, '2024-01-09 16:00:00', '2024-01-09 16:00:00'),
('Predictions about web development...', 'https://picsum.photos/seed/10/600/400', 21, 1, '2024-01-10 17:00:00', '2024-01-10 17:00:00');


CREATE TABLE IF NOT EXISTS `Permissions` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
   
	`name` VARCHAR(255) NOT NULL,
	`endpoint` VARCHAR(255) NOT NULL,
	`method` VARCHAR(100) NOT NULL,
	`module` VARCHAR(100) NOT NULL,

	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` tinyint(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `RolePermission` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	
	`roleId` INT NOT NULL,
	`permissionId` INT NOT NULL,
	`isActive` BOOLEAN DEFAULT 1,
	
	FOREIGN KEY (`roleId`) REFERENCES Roles (`id`),
	FOREIGN KEY (`permissionId`) REFERENCES Permissions (`id`),
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `Chats` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	
	`message` text,
	`userId` int NOT NULL,
	`roomId` VARCHAR(255) NOT NULL,
	
	FOREIGN KEY (`userId`) REFERENCES Users (`id`),
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);