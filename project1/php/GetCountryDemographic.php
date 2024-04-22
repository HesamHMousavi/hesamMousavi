<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);


    $url = "https://api.api-ninjas.com/v1/country?name=" . rawurlencode($_REQUEST['country']);

    $headers = array( 
        "X-Api-Key:LGXs6KJBdzHqLPvN5V+Isw==zezxfTekkoTFeLox"
    ); 

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); 

	$result=curl_exec($ch);

	curl_close($ch);

    // echo $result;

	$decode = json_decode($result,true);	

	$output['data'] = $decode;
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
