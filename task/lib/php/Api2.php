<?php

	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);

	$executionStartTime = microtime(true);
    
    $url = 'http://api.geonames.org/findNearbyJSON?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['in'] . '&username=v3skr';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['data'] = $decode['geonames'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>