use iqiyi;
drop table if exists t_cookie;
create table t_cookie(
	id int primary key auto_increment,
	eid int not null default 0,
	pw varchar(100) not null default "",
	ename varchar(100) not null default '',
	expires bigInt not null default 0
);