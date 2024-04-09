<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);


    $url = "https://api.currencyapi.com/v3/currencies";

    $headers = array( 
        "apikey:cur_live_WjJbMvNLqg0ThDvfyUF9Uh6IBsXaNb5Hg6r7TVpc"
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
