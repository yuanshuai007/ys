<?php
	/*
	* 这个php用来检验注册时手机号是否已注册
	*/
?>
<?php
	require 'init.php';
	header("content-type:application/json;charset=utf-8");
	@$tel=$_REQUEST["tel"] or die('{"msg":"手机号必须有"}');
	//查找手机号是否已注册
	$result=mysqli_query($con,"select id from t_user where tel='$tel'");
	$result=mysqli_fetch_assoc($result);
	
	//var_dump($result);
	if($result===null){
		//1:手机号没有注册
		echo '{"msg":"1"}';
	}
	else{
		//-1:手机号已注册
		echo '{"msg":"-1"}';
	}
?>