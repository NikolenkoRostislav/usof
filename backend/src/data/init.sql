CREATE DATABASE IF NOT EXISTS usof;
CREATE USER IF NOT EXISTS 'usof_user'@'localhost' IDENTIFIED BY 'pass';
GRANT ALL ON usof.* TO 'usof_user'@'localhost';