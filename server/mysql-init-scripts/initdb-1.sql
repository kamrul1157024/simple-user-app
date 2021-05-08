CREATE DATABASE IF NOT EXISTS user_info;
USE user_info;
CREATE TABLE Users (
  id int NOT NULL AUTO_INCREMENT,
  first_name varchar(32),
  last_name varchar(32),
  email_address varchar(32),
  mobile_no varchar(32),
  PRIMARY KEY (id)
);
