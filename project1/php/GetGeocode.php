<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);


    $url = "https://api.api-ninjas.com/v1/geocoding?city=".$_REQUEST["city"]."&country=" . rawurlencode($_REQUEST['country']);

    $headers = array( 
        "X-Api-Key:9JQ79aLd+QQvrALme46dMQ==9w25xOz08E7fShOY"
    ); 

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); 

	$result=curl_exec($ch);

	curl_close($ch);

    echo $result;

?>
