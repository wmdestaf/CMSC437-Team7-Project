function logout() {
	sessionStorage.clear();
	window.location.replace("login.html");
}

var patient_names = undefined;
var patient_data = undefined;
var patient_map = undefined;
			
//this is ugly
function loadNames() {
	//load in patient information
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) { 
			(patient_names = this.responseText.split("\n")).pop(); //trailing \n
		}
		else if(this.readyState == 4 && this.status == 404) {
			alert("Error: No Patient List Found On Server.");
			patient_names = null;
		}
	}
	xhttp.open("GET", "data/patient_list.txt", false); //this will cause a race condition if we load async
	xhttp.send(); 
}

function loadData() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) { 
			patient_data = JSON.parse(this.responseText);
		}
		else if(this.readyState == 4 && this.status == 404) {
			alert("Error: No Patient Data Found On Server.");
			patient_data = null;
		}
	}
	xhttp.open("GET", "data/patient_data.json", false);
	xhttp.send(); 
}

function loadMap() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) { 
			patient_map = JSON.parse(this.responseText);
		}
		else if(this.readyState == 4 && this.status == 404) {
			alert("Error: No Patient Map Found On Server.");
			patient_map = null;
		}
	}
	xhttp.open("GET", "data/patient_map.json", false);
	xhttp.send(); 
}

function dump(obj) {
	if(typeof obj !== 'object') //base case: we're a primitive
		return "<tr><td>" + obj + "</td></tr>";
	else if(Array.isArray(obj)) {
		var ret = "";
		obj.forEach(function(x) {
			ret += dump(x);
		});
		return ret;
	}
	else { 
		var ret = "";
		Object.keys(obj).forEach(function(x) {
			ret += "<tr><td><strong>" + x + "</strong></td></tr>";
			ret += dump(obj[x]);
		});
	}
	return ret;
}

function reloadDataViewer(name) {
	name = name.split(" ");
	name = "data-" + name[0] + "-" + name[1];
	var data = patient_data[name];
	
	var table = document.getElementById("data-table");
	var table_html = dump(data);
	
	//replace the linked images with links
	table_html = table_html.replace(/<td>(ICU\/patientdata\/.*?)<\/td>/g, function(base, path) {
		let oc = "onclick=\"window.open('" + path + "', 'newwindow', 'width=300,height=300'); return false;\"";
		return "<td><a href=\"" + path + "\" " + oc + ">" + path + "</a></td>";
	});
	table.innerHTML = table_html;
}

function pad(n) {
	return ("" + n).length == 2 ? n : "0" + n;
}

function save_vitals() {
	var now = new Date();
	var mm = pad(now.getDate());
	var dd = pad(now.getDay());
	var yyyy = now.getFullYear();
	var hh = pad(now.getHours());
	var mm = pad(now.getMinutes());
	var ss = pad(now.getSeconds());
	
	var selected_name = document.getElementById("patient_list").getElementsByClassName("selected")[0]; //there is only 1 at a time
	if(!selected_name) {
		alert("No patient selected!");
		return;
	}
	var old = selected_name.innerHTML; //whyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
	selected_name = old.split(" ");
	selected_name = "data-" + selected_name[0] + "-" + selected_name[1];
		
	var vital_signs = {
		"hr":   vitals.getHR(),
		"bp":   vitals.getBPOut() + "/" + vitals.getBPIn(),
		"SpO2": vitals.getSPO2(),
		"Bpm":  vitals.getBRPM(),
		"tmp":  vitals.getTmp(),
	};
	patient_data[selected_name]["saved-vitals"][mm + "-" + dd + "-" + yyyy + "|" + hh + ":" + mm + ":" + ss] = vital_signs;
	
	reloadDataViewer(old);
}
			
$(document).ready(function(){
	var name = sessionStorage.getItem("name");
	$("#greeting").html("Hello, " + name);
	document.title += ": " + name;
	
	console.log("here\n");
	loadNames();
	loadData();
	loadMap();
	
	//load in the selection panel
	var list = ""
	patient_names.forEach(function(x) {
		list += "<li>" + x + "</li>";
	});
	document.getElementById("patient_list").innerHTML = list;
	
	//repair the list by adding listeners
	$("#patient_list li").on("click", function () {
		$("#patient_list li").removeClass('selected');
		$(this).attr('class', 'selected');
		let patient_name = $(this).html();
		$("#data-viewer-name").html("Patient name: " + patient_name);
		reloadDataViewer(patient_name);
	});
	
	$("#patient_list li").hover(function () {
		$(this).addClass('hovered');
	}, 
	function () {
		$(this).removeClass('hovered');
	});
	
	//selection panel input box;
	$(document).on('input', '#patient', function(){
		const regex = new RegExp(this.value, 'ig');
		let matches = Array(0);
		let list = document.getElementById("patient_list").getElementsByTagName("li");
		for(let x of list) {
			if(x.innerHTML.match(regex))
				x.style.display = "block";
			else
				x.style.display = "none";
		}
	});
});