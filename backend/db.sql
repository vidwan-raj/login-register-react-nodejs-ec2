USE registration;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;

create table user(
	id int NOT NULL  AUTO_INCREMENT,
    username varchar(30),
    password varchar(240),
    firstName varchar(40),
    email varchar(80),
    lastName varchar(40),
    PRIMARY KEY(id)
);