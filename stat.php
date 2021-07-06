<?php
require_once 'config.inc.php';

$out = array(
	'hosts'=>array(),
	'devices'=>array()
);
foreach ($hosts as $name => $url) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
	$response = curl_exec($ch);
	curl_close($ch);
	if (!$response || !($json = json_decode($response, true))) {
		$out['hosts'][] = array('host'=>$name, 'status' => 'Offline');
	} else {
		$json['host'] = $name;
		foreach ($json['devices'] as $device) {
			$device['gpu_id'] = "$name.".$device['gpu_id'];
			$out['devices'][] = $device;
		}
		if (count($json['devices']) > 0) {
			$json['status'] = 'Online';
		} else {
			$json['status'] = 'No Devices';
		}
		$out['hosts'][] = $json;
	}
}

echo json_encode($out);