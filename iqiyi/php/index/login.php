<?php
	require 'init.php';
	header("content-type:application/json;charset=utf-8");
	@$ename=$_REQUEST["ename"] or die('{"msg":"用户名必须有"}');
	@$pw=$_REQUEST["pw"] or die('{"msg":"密码必须有"}');
	//先查找用户名存不存在
	$result_ename=mysqli_query($con,"select id from t_user where ename='$ename'");
	$result_ename=mysqli_fetch_assoc($result_ename);
	//先查找用户名和密码匹不匹配
	$result=mysqli_query($con,"select id,ename from t_user where ename='$ename' and pw='$pw'");
	$result=mysqli_fetch_assoc($result);
	//var_dump($result);
	if($result_ename===null){
		//-1:用户名不存在
		echo '{"msg":"-1"}';
	}
	else if($result===null){
		//-2:用户名和密码不匹配
		echo '{"msg":"-2"}';
	}
	else{
		//1:登录成功
		$result["msg"]="1";
		echo json_encode($result);
	}
?>