<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);


	$result= file_get_contents('../js/countryBorders.geo.json'); 
    
	$decode = json_decode($result,true);	
    $obj = null;
    foreach ($decode["features"] as $object) {
        if($object["properties"]["iso_a2"] === $_REQUEST['iso2']){
            $obj = $object;
        }
    }
    
	$output['data'] = $obj;
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
