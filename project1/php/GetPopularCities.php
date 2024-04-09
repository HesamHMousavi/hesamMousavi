<?php 
	
// Define the URL and data 
$url = 'https://countriesnow.space/api/v0.1/countries/cities'; 
$url = 'https://countriesnow.space/api/v0.1/countries/population/cities/filter'; 
$county = $_REQUEST["country"];
$data = [
    'limit' => '25',
    "order" => "dsc",
	"orderBy" => "population",
	"country" => $county,
]; 

// Prepare POST data 
$options = [ 
	'http' => [ 
		'method' => 'POST', 
		'header' => 'Content-type: application/x-www-form-urlencoded', 
		'content' => http_build_query($data), 
	], 
]; 

// Create stream context 
$context = stream_context_create($options); 

// Perform POST request 
$response = file_get_contents($url, false, $context); 

// Display the response 
echo $response; 

?>

