set names utf8;
use iqiyi;
drop table if exists t_upload_img;
create table t_upload_img(
	id int primary key auto_increment,
	uid int not null default 0,
	img varchar(100) not null default "",
	time bigInt not null default 0
);