function save() {
	//ensure we don't try to make an ajax request if we don't have write capability
	if(window.sessionStorage.getItem("patient_list") ||  window.sessionStorage.getItem("patient_map")) {
		var serial = "";
		console.log(Array.isArray(patient_names));
		patient_names.forEach(function(x) {
			serial += (x + "\n");
		});
		window.sessionStorage.setItem("patient_list", serial);
		window.sessionStorage.setItem("patient_map", JSON.stringify(patient_map));
		return;
	}
	
	$.ajax({
		type: "POST",
		url: 'writer.php',
		dataType: 'html',
		data: { "to": "data/patient_map.json", "data": JSON.stringify(patient_map) }
	}).done(function () {
		alert("Saved data OK");
		saved = true;
	}).fail(function ( jqXHR, textStatus, errorThrown ) {
		alert("Data could not be saved, check log for details.");
		console.log(jqXHR);
		console.log(textStatus);
		console.log(errorThrown);
	});
}

function logout() {
	if(!saved && !confirm("Unsaved data. Are you sure you want to return?"))
		return;
	sessionStorage.removeItem("name");
	window.location.replace("login.html");
}

function go_back() {
	if(!saved && !confirm("Unsaved data. Are you sure you want to return?"))
		return;
	window.location.replace("phys_landing.html");
}

var saved = true;
//not very dry
var patient_names = undefined;
var patient_map = undefined;

function loadMap() {
	var map;
	if(map = window.sessionStorage.getItem("patient_map")) {
		patient_map = JSON.parse(map);
		return;
	}
	
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

function loadNames() {
	var list;
	if(list = window.sessionStorage.getItem("patient_list")) { //exists
		(patient_names = list.split("\n")).pop();
		return;
	}
	
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

function toSimpleName(fmt) {
	fmt = fmt.split("-");
	return fmt[1] + " " + fmt[2];
}

function toFmtName(simple) {
	simple = simple.split(" ");
	return "data-" + simple[0] + "-" + simple[1];
}

function assign_pat() {
	var nurse_name = document.getElementById("nurses").value;
	var pat_name = document.getElementById("patients").value;
	
	//ensure both are selected
	if(nurse_name === "Select Nurse...")
		alert("No nurse selected!");
	else if(pat_name === "Select Patient...")
		alert("No patient selected!");
	else if(patient_map[toFmtName(nurse_name)][0])
		alert("Nurse already assigned to patient: " + patient_map[toFmtName(nurse_name)][0] + "!");
	else {
		//assign
		patient_map[toFmtName(nurse_name)][0] = pat_name;
		$('#selected').html("Assigned Patient: " + pat_name);
		saved = false;
	}
}

function unassign_pat() {
	var nurse_name = document.getElementById("nurses").value;
	nurse_name = toFmtName(nurse_name);

	//ensure both are selected
	if(nurse_name === "Select Nurse...")
		alert("No nurse selected!");
	else if(!(patient_map[nurse_name][0]))
		alert("Nurse is not assigned to any patient!");
	else {
		patient_map[nurse_name].pop();
		$('#selected').html("Assigned Patient: Unassigned");
		saved = false;
	}
}	

$(document).ready(function() {
	loadMap();
	loadNames();
	
	//populate selects
	var nurse_selector = document.getElementById("nurses");
	var inner = "";
	Object.keys(patient_map).forEach(function(x) {
		x = toSimpleName(x);
		inner += "<option id=\"" + x + "\">" + x + "</option>";
	});
	nurse_selector.innerHTML += inner;
	
	var pat_selector = document.getElementById("patients");
	var inner = "";
	patient_names.forEach(function(x) {
		inner += "<option id=\"" + x + "\">" + x + "</option>";
	});
	pat_selector.innerHTML += inner;
	
	//add listeners
	$(document).on('input', '#nurses', function(){
		$('#selected').html("Assigned Patient: " + (patient_map[toFmtName(this.value)][0] ?? "Unassigned").replace("-"," "));
	});
});