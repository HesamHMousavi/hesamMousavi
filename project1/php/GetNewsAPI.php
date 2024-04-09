<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    $url = "https://newsapi.org/v2/top-headlines?country=". $_REQUEST["iso"] ."&category=general&apiKey=2a2547210f5948e3aa118f8c66d2f2f3";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_USERAGENT, "my-app");

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	
	
	header('Content-Type: application/json; charset=UTF-8');
	// header('User-Agent: my-app;');

	echo json_encode($decode); 

?>
