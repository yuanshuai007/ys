set names utf8;
drop database if exists iqiyi;
create database iqiyi charset='utf8';
use iqiyi;
drop table if exists t_user;
create table t_user(
	id int primary key auto_increment,
	tel int not null default 0,
	pw varchar(100) not null default "",
	ename varchar(100) not null default '',
	vip int not null default 0
);
insert into t_user values(null,123456,"123456","a",0);