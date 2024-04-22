<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);


    $url = "https://api.currencyapi.com/v3/currencies";

    $headers = array( 
        "apikey:cur_live_E9gh42PfEB5obtEOCo1BBH4zOuT1pzsm1azUfC4P"
    ); 

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); 

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
