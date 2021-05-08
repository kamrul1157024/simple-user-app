CREATE DATABASE IF NOT EXISTS user_info;
USE user_info;
CREATE TABLE IF NOT EXISTS Users (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY ,
  first_name varchar(32),
  last_name varchar(32),
  email_address varchar(32),
  mobile_no varchar(32)
);