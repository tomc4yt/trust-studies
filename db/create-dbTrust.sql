DROP DATABASE IF EXISTS dbTrust;

CREATE DATABASE dbTrust;

USE dbTrust;

CREATE TABLE board(
  idBoard INT AUTO_INCREMENT,
  name VARCHAR(25),
  config TEXT,
  PRIMARY KEY(idBoard)
);

CREATE TABLE session(
  idSession INT AUTO_INCREMENT,
  assignmentId VARCHAR(100),
  workerId VARCHAR(100),
  timeExpire VARCHAR(50),
  timeStart VARCHAR(50),
  userAgent VARCHAR(100),
  token VARCHAR(200),
  PRIMARY KEY(idSession)
);
