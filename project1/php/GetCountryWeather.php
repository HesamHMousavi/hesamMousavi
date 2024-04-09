<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    $url = "http://api.weatherapi.com/v1/forecast.json?key=92f97897301b4b3da79142335240304&q=".$_REQUEST['city']."&days=8&aqi=no&alerts=no";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($decode); 

?>
