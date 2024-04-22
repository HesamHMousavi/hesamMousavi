<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    $url = "https://api.opencagedata.com/geocode/v1/json?q=".$_REQUEST["lat"]."%2C".$_REQUEST["lng"]."&key=943a300681d548c5aa99df79c7b55605";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

    $output['data'] = $decode;
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?>
