use iqiyi;
create table t_search(
	id int primary key auto_increment,
	content varchar(100) not null default "",
	#did 用户的id
        did int not null default 0
);