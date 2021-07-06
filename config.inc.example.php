<?php
/**
 * Copy this file to "config.inc.php" and configure your hosts.
 *
 * Add your hosts here, replacing host with their ip address, or usually local machine name will work (it depends on your router).
 * The port should be whatever number you put in --api [port] in your gminer arguments.
 * For example: --api 9000 would be http://your-machine-name:9000/stat
 */
$hosts = array(
	'friendly-name' => 'http://host:port/stat',
);

// timeout for down hosts, in seconds
$timeout = 3;