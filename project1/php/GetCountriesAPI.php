<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$result= file_get_contents('../js/countryBorders.geo.json'); 

	$arr = [];
	$decode = json_decode($result,true);	
    foreach ($decode["features"] as $object) {
		array_push($arr, $object["properties"]);
    }
    
	$output['data'] = $arr;
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
