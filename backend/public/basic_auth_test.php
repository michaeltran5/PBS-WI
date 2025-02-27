<?php

$config = require_once "../src/config/config.php";

//basic api connection test
$url = $config['pbs_api']['base_url'] . "/shows/";
$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($ch, CURLOPT_USERPWD, $config['pbs_api']['client_id'] . ":" . $config['pbs_api']['client_secret']);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

echo "URL: " . $url . "<br>";
echo "Status: " . ($info['http_code'] == 200 ? "SUCCESS" : "FAILED (" . $info['http_code'] . ")");

if ($info['http_code'] != 200) {
    echo "<br>Response: " . $response;
}
?>