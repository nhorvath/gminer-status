function formatUptime(uptime) {
	var seconds = uptime % 60;
	uptime /= 60;
	var minutes = uptime % 60;
	uptime /= 60;
	var hours = uptime % 24;
	uptime /= 24;
	var days = uptime;
	return (Math.floor(days) + "d "
		+ ("0" + Math.floor(hours)).substr(-2) + ":"
		+ ("0" + Math.floor(minutes)).substr(-2) + ":"
		+ ("0" + Math.floor(seconds)).substr(-2));
}

function formatValue(value, defaultPrecision, valueUnit) {
	if (value >= 1000000000)
		return ((value / 1000000000).toFixed(2) + " G" + valueUnit);
	else if (value >= 1000000)
		return ((value / 1000000).toFixed(2) + " M" + valueUnit);
	else if (value >= 1000)
		return ((value / 1000).toFixed(2) + " K" + valueUnit);
	else
		return (value.toFixed(defaultPrecision) + " " + valueUnit);
}

function createHostStatTable(hostCount) {
	var hostStatTable = document.getElementById("host_stat");
	$('tr.host_row').remove();
	for (var i = 0; i < hostCount; ++i) {
		var row = hostStatTable.insertRow(i + 2);
		for (var j = 0; j < 9; ++j)
			row.insertCell(-1);
		row.id = "Host" + i;
		row.className = 'host_row';
		row.cells[0].className = "column_title";
	}
}

function createDeviceStatTable(deviceCount) {
	var deviceStatTable = document.getElementById("device_stat");
	$('tr.device_row').remove();
	for (var i = 0; i < deviceCount; ++i) {
		var row = deviceStatTable.insertRow(i + 2);
		for (var j = 0; j < 10; ++j)
			row.insertCell(-1);
		row.id = "GPU" + i;
		row.className = 'device_row';
		row.cells[0].className = "column_title";
		var temperatureCell = row.cells[3];
		temperatureCell.appendChild(document.createElement("span"));
		temperatureCell.appendChild(document.createElement("span"));
		temperatureCell.appendChild(document.createElement("span"));
	}
}

function temperatureColor(temperature, temperatureLimit) {
	var temperatureLimit1 = Math.floor(temperatureLimit * 0.9);
	var temperatureLimit2 = Math.floor(temperatureLimit * 0.8);
	if (temperature < temperatureLimit2)
		return "text_green";
	if (temperature < temperatureLimit1)
		return "text_yellow";
	return "text_red";
}

function updateStatistics(data) {
	hideError();

	var extendedShareInfo = false

	var hostStatTable = document.getElementById("host_stat");
	hostStatTable.style.display = "table";

	var totalPoolSpeed = 0;
	var totalSPM = 0;
	var totalElecKWH = 0;
	var totalElecCost = 0;
	for (var hostIndex = 0; hostIndex < data.hosts.length; ++hostIndex) {
		var host = data.hosts[hostIndex];
		var row = document.getElementById("Host" + hostIndex);
		var cells = row.cells;
		cells[0].innerText = host.host;
		cells[1].innerText = host.status;
		switch(host.status) {
			case 'Online':
				cells[1].className = 'text_green';
				break;
			case 'Offline':
				cells[1].className = 'text_red';
				for (var j=2; j<cells.length; j++) {
					cells[j].innerText = "N/A";
				}
				continue;
				break;
			default:
				cells[1].className = 'text_yellow';
				break;
		}
		cells[2].innerText = formatValue(host.pool_speed, host.speed_rate_precision, host.speed_unit);
		cells[3].innerText = host.shares_per_minute.toFixed(2);
		cells[4].innerText = formatUptime(host.uptime);
		var electricityStr;
		if (host.electricity != 0) {
			electricityStr = host.electricity.toFixed(3) + " kWh";
			totalElecKWH += host.electricity;
			if (host.electricity_cost != null) {
				electricityStr += " $" + host.electricity_cost.toFixed(2);
				totalElecCost += host.electricity_cost;
			}
		} else
			electricityStr = "N/A";
		cells[5].innerText = electricityStr;
		cells[6].innerText = (host.server == null ? "N/A" : host.server);
		cells[7].innerText = host.algorithm;
		cells[8].innerText = host.miner;

		totalPoolSpeed += host.pool_speed;
		totalSPM += host.shares_per_minute;
	}

	var row = document.getElementById("host_total");
	var cells = row.cells;
	cells[2].innerText = formatValue(totalPoolSpeed, data.hosts[0].speed_rate_precision, data.hosts[0].speed_unit);
	cells[3].innerText = totalSPM.toFixed(2);
	if (totalElecKWH != 0) {
		electricityStr = totalElecKWH.toFixed(3) + " kWh";
		if (totalElecCost != 0) {
			electricityStr += " $" + totalElecCost.toFixed(2);
		}
		cells[5].innerText = electricityStr;
	} else {
		cells[5].innerText = "N/A";
	}

	var totalSpeed = 0;
	var totalSpeed2 = 0;
	var totalSpeedPower = 0;
	var totalPowerUsage = 0;
	var totalAcceptedShares = 0;
	var totalAcceptedShares2 = 0;
	var totalStaleShares = 0;
	var totalStaleShares2 = 0;
	var totalInvalidShares = 0;
	var totalInvalidShares2 = 0;
	var dualMode = (data.hosts[0].total_accepted_shares2 != null);

	var deviceStatTable = document.getElementById("device_stat");
	deviceStatTable.style.display = "table";

	for (var deviceIndex = 0; deviceIndex < data.devices.length; ++deviceIndex) {
		var device = data.devices[deviceIndex];
		var row = document.getElementById("GPU" + deviceIndex);
		var cells = row.cells;
		cells[0].innerText = device.gpu_id;
		cells[1].innerText = device.name;
		cells[2].innerText = device.fan + " %";
		if (device.temperature == 0) {
			cells[3].innerText = "N/A";
			cells[3].className = null;
		} else {
			var temperatureChilds = cells[3].childNodes;
			temperatureChilds[0].innerText = device.temperature + " C";
			temperatureChilds[0].className = temperatureColor(device.temperature, device.temperature_limit);
			if (device.memory_temperature != 0) {
				temperatureChilds[1].innerText = " / ";
				temperatureChilds[2].innerText = device.memory_temperature + " C";
				temperatureChilds[2].className = temperatureColor(device.memory_temperature, device.memory_temperature_limit);
			} else {
				temperatureChilds[1].innerText = null;
				temperatureChilds[2].innerText = null;
			}
		}
		cells[4].innerText = formatValue(device.speed, data.hosts[0].speed_rate_precision, data.hosts[0].speed_unit);
		totalSpeed += device.speed;
		if (dualMode) {
			cells[4].innerText += " + " + formatValue(device.speed2, data.hosts[0].speed_rate_precision2, data.hosts[0].speed_unit2);
			totalSpeed2 += device.speed2;
		}
		if (device.accepted_shares != null) {
			if (extendedShareInfo)
				cells[5].innerText = device.accepted_shares + " / " + device.stale_shares + " / " + device.invalid_shares;
			else
				cells[5].innerText = device.accepted_shares + " / " + device.rejected_shares;
			totalAcceptedShares += device.accepted_shares;
			totalStaleShares += device.stale_shares;
			totalInvalidShares += device.invalid_shares;
			if (dualMode) {
				if (extendedShareInfo)
					cells[5].innerText += " + " + device.accepted_shares2 + " / " + device.stale_shares2 + " / " + device.invalid_shares2;
				else
					cells[5].innerText += " + " + device.accepted_shares2 + " / " + device.rejected_shares2;
				totalAcceptedShares2 += device.accepted_shares2;
				totalStaleShares2 += device.stale_shares2;
				totalInvalidShares2 += device.invalid_shares2;
			}
		} else
			cells[5].innerText = "-";
		cells[6].innerText = device.core_clock;
		cells[7].innerText = device.memory_clock;
		if (device.power_usage != 0) {
			cells[8].innerText = device.power_usage + " W";
			cells[9].innerText = formatValue((device.speed / device.power_usage), 2, data.hosts[0].power_unit);
			totalSpeedPower += device.speed;
			totalPowerUsage += device.power_usage;
		} else {
			cells[8].innerText = "N/A";
			cells[9].innerText = "N/A";
		}
	}
	var row = document.getElementById("total");
	var cells = row.cells;
	cells[4].innerText = formatValue(totalSpeed, data.hosts[0].speed_rate_precision, data.hosts[0].speed_unit);
	if (dualMode)
		cells[4].innerText += " + " + formatValue(totalSpeed2, data.hosts[0].speed_rate_precision2, data.hosts[0].speed_unit2);
	if (totalPowerUsage != 0) {
		cells[8].innerText = totalPowerUsage + " W";
		cells[9].innerText = formatValue((totalSpeedPower / totalPowerUsage), 2, data.hosts[0].power_unit);
	} else {
		cells[8].innerText = "N/A";
		cells[9].innerText = "N/A";
	}
	if (extendedShareInfo) {
		cells[5].innerText = totalAcceptedShares + " / " + totalStaleShares + " / " + totalInvalidShares;
		if (dualMode)
			cells[5].innerText += totalAcceptedShares2 + " / " + totalStaleShares2 + " / " + totalInvalidShares2;
	} else {
		cells[5].innerText = totalAcceptedShares + " / " + (totalStaleShares + totalInvalidShares);
		if (dualMode)
			cells[5].innerText += totalAcceptedShares2 + " / " + (totalStaleShares2 + totalInvalidShares2);
	}
}

function minerDisconnected() {
	showError('Stats Offline');
}

function showError(message) {
	error = document.getElementById("error");
	error.innerText = message;
	error.style.display = "block";
	var minerStatTable = document.getElementById("host_stat");
	minerStatTable.style.display = "none";
	var deviceStatTable = document.getElementById("device_stat");
	deviceStatTable.style.display = "none";
}

function hideError() {
	error = document.getElementById("error");
	error.innerText = 'Ok';
	error.style.display = "none";
}

var httpRequest = null;
var requestTime = null;

function update() {
	requestTime = (new Date).getTime();
	httpRequest.open('GET', 'stat.php', true);
	httpRequest.send(null);
}

function onLoad() {
	var deviceStatTable = document.getElementById("device_stat");
	if (!window.XMLHttpRequest) {
		showError("Your browser does not support XMLHttpRequest");
		return;
	}
	httpRequest = new XMLHttpRequest();
	if (!httpRequest) {
		showError("Your browser does not support XMLHttpRequest");
		return;
	}

	httpRequest.timeout = (window.hasOwnProperty('statsTimeout')) ? 2*window.statsTimeout : 10000;
	httpRequest.ontimeout = function() {
		minerDisconnected();
		setTimeout(update, 1000);
	};
	var deviceCount = 0;
	var hostCount = 0;
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState !== XMLHttpRequest.DONE)
			return;
		if (httpRequest.status !== 200 || httpRequest.responseText.length === 0) {
			minerDisconnected();
			setTimeout(update, 1000);
			return;
		}
		var data = window.JSON.parse(httpRequest.responseText);
		if (hostCount !== data.hosts.length) {
			hostCount = data.hosts.length;
			createHostStatTable(data.hosts.length);
		}
		if (deviceCount !== data.devices.length) {
			deviceCount = data.devices.length;
			createDeviceStatTable(data.devices.length);
		}
		updateStatistics(data);
		var currentTime = (new Date).getTime();
		var delay = 1000 - (currentTime - requestTime);
		setTimeout(update, delay > 0 ? delay : 1);
	};
	update();
}

window.onload = onLoad;