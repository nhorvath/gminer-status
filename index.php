<?php require_once 'config.inc.php'; ?>
<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="style.css" />
	<script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.slim.min.js"></script>
	<script type="text/javascript">
		var statsTimeout = <?php echo $timeout*1000; ?>;
	</script>
	<script type="text/javascript" src="script.js"></script>
</head>

<body>
<div id="container">
	<div id="error"></div>
	<table id="host_stat" class="host_stat_default">
		<tr>
			<td class="column_title" colspan="9">Hosts</td>
		</tr>
		<tr>
			<td class="column_title">Host</td>
			<td class="column_title">Status</td>
			<td class="column_title">Pool Hashrate</td>
			<td class="column_title">Shares/Min</td>
			<td class="column_title">Uptime</td>
			<td class="column_title">Electricity</td>
			<td class="column_title">Server</td>
			<td class="column_title">Algo</td>
			<td class="column_title">Version</td>
		</tr>
		<tr id="host_total">
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
		</tr>
	</table>
	<table id="device_stat" class="device_stat_default">
		<tr>
			<td class="column_title" colspan="10">GPUs</td>
		</tr>
		<tr>
			<td class="column_title">ID</td>
			<td class="column_title">GPU</td>
			<td class="column_title">Fan</td>
			<td class="column_title">Temperature</td>
			<td class="column_title">Speed</td>
			<td class="column_title">Shares</td>
			<td class="column_title">Core</td>
			<td class="column_title">Memory</td>
			<td class="column_title">Power</td>
			<td class="column_title">Efficiency</td>
		</tr>
		<tr id="total">
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
		</tr>
	</table>
</div>
</body>

</html>

