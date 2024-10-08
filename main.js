function reqwest(url) {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send();
	if (xhr.status === 200) {
		return xhr.responseText;
	} else {
		console.error("Error: $(xhr.status)")
		return null;
	}
}

function getWind(metar) {
	metar = metar.split(' ');
	if (metar[2] == "AUTO") {
		return metar[3];
	} else {
		return metar[2];
	}
}

function getTemp(metar) {
	metar = metar.split(' ');
	let i = 0;
	while (i < metar.length) {
		if (metar[i].length == 5 && metar[i][2] == '/') {
			return metar[i].substring(0,2);
		}
		i += 1;
	}
}

function getQnh(metar) {
	metar = metar.split(' ');
	let i = 0;
	while (i < metar.length) {
		if (metar[i].length == 5 && metar[i][0] == "A") {
			return (metar[i].substring(1));
		}
		i += 1;
	}
	i = 0;
	while (i < metar.length) {
		if (metar[i].length == 5 && metar[i][0] == "Q") {
			metar[i] = metar[i].substring(1);
			metar[i] = Number(metar[i])
			metar[i] /= (33.864 / 100);
			metar[i] = String(metar[i])
			return (metar[i].substring(0, 4));
		}
		i += 1;
	}
}

function add() {
	let icao = document.getElementById('IcaoInput').value;
	document.getElementById('IcaoInput').value = "";
	if (icao.length < 1 || 4 < icao.length) {
		alert("bad input");
		return;
	}
	if (icao.length == 3) {
		icao = "R" + icao;
	}
	if (icao.length == 2) {
		icao = "RJ" + icao;
	}
	if (icao.length == 1) {
		icao = "RJ" + icao + icao;
	}
	let url = "https://metar.vatsim.net/" + icao;
	let list = document.getElementById('stationList');
	let station = document.createElement('div');
	let location = document.createElement('div');
	let wind = document.createElement('div');
	let temp = document.createElement('div');
	let qnh = document.createElement('div');
	location.innerHTML = icao.toUpperCase();
	let metar = reqwest(url);
	wind.innerHTML = getWind(metar);
	temp.innerHTML = getTemp(metar);
	qnh.innerHTML = getQnh(metar);
	station.appendChild(location);
	station.appendChild(wind);
	station.appendChild(temp);
	station.append(qnh);
	station.className = "station"
	list.appendChild(station);
}

function update() {
	let stationList = [];
	let i = 0;
	while (i < document.getElementById('stationList').childElementCount) {
		stationList.push(document.getElementById('stationList').childNodes[i+1].firstChild.innerHTML);
		i += 1;
	}
	i = 0;
	while (i < document.getElementById('stationList').childElementCount) {
		let childNodes = document.getElementById('stationList').childNodes[i+1]
		childNodes.childNodes[1].innerHTML = getWind(reqwest("https://metar.vatsim.net/" + childNodes.childNodes[0].innerHTML));
		childNodes.childNodes[2].innerHTML = getTemp(reqwest("https://metar.vatsim.net/" + childNodes.childNodes[0].innerHTML));
		childNodes.childNodes[3].innerHTML = getQnh(reqwest("https://metar.vatsim.net/" + childNodes.childNodes[0].innerHTML));
		i += 1;
	}
	console.log(stationList);
}

window.addEventListener('DOMContentLoaded', function(){
	setInterval(() => {
		update();
	}, 120000) //2min.
})