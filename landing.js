function saveAndCallback(f) {
	//ensure we don't try to make an ajax request if we don't have write capability
	if(window.sessionStorage.getItem("patient_list") || window.sessionStorage.getItem("patient_data") || window.sessionStorage.getItem("patient_map")) {
		var serial = "";
		console.log(Array.isArray(patient_names));
		patient_names.forEach(function(x) {
			serial += (x + "\n");
		});
		window.sessionStorage.setItem("patient_list", serial);
		window.sessionStorage.setItem("patient_data", JSON.stringify(patient_data));
		window.sessionStorage.setItem("patient_map", JSON.stringify(patient_map));
		f();
		return;
	}
	
	$.ajax({
		type: "POST",
		url: 'writer.php',
		dataType: 'html',
		data: { "to": "data/patient_map.json", "data": JSON.stringify(patient_map) }
	}).done(function () {
		$.ajax({
			type: "POST",
			url: 'writer.php',
			dataType: 'html',
			data: { "to": "data/patient_data.json", "data": JSON.stringify(patient_data) }
		}).done(function () {
			f();
		}).fail(function ( jqXHR, textStatus, errorThrown ) {
			alert("Data could not be saved, check log for details.");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		});
	}).fail(function ( jqXHR, textStatus, errorThrown ) {
		alert("Data could not be saved to file, check log for details.");
		console.log(jqXHR);
		console.log(textStatus);
		console.log(errorThrown);
	});
}

function logout() {
	saveAndCallback(() => {
		sessionStorage.removeItem("name");
		window.location.replace("login.html");
	});
}

function go_scheduler() {
	saveAndCallback(() => {
		window.location.replace("phys_schedule.html");
	});
}

var patient_names = undefined;
var patient_data = undefined;
var patient_map = undefined;
var assigned_patient = undefined;
var mode = undefined;
			
//this is ugly
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
		}
	}
	xhttp.open("GET", "data/patient_list.txt", false); //this will cause a race condition if we load async
	xhttp.send(); 
}

function loadData() {
	var data;
	if(data = window.sessionStorage.getItem("patient_data")) {
		patient_data = JSON.parse(data);
		return;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) { 
			patient_data = JSON.parse(this.responseText);
		}
		else if(this.readyState == 4 && this.status == 404) {
			alert("Error: No Patient Data Found On Server.");
		}
	}
	xhttp.open("GET", "data/patient_data.json", false);
	xhttp.send(); 
}

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
		}
	}
	xhttp.open("GET", "data/patient_map.json", false);
	xhttp.send(); 
}

Array.prototype.peekBack = function() {
    return this[this.length - 1];
}

Array.prototype.swap = function (x,y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}

//fun fact, this is a complete BNF grammar
function pickup(html) {
	var parsed = [];
	var lines = html.substring(7, html.length - 9).split("<!---->"); //badness
	lines.forEach(function(x) {
		const regex = /<tr><td.*class=".*delim (.*)">(?:\<strong>)?(.*)(?:\<\/strong>)?<\/td><\/tr>/;
		let match = x.match(regex);
		var sub = match[2].match(/(.*)<\/strong>/);
		if(sub)
			match[2] = sub[1];
		parsed.push({"type": String(match[1]), "value": String(match[2])});
	});
	
	parsed = parsed.slice(1, -1);
	parsed.forEach(x => console.log(x.type, x.value));

	var i = 0;
	var data = new Object({});
	var stack = Array();
	stack.push(data);
	
	while(i < parsed.length) {
		var cur_obj = stack.peekBack();
		var cur_type = parsed[i].type;
		var cur_val  = parsed[i].value;
		
		switch(String(cur_type)) {
			case "obj"      : stack.push({});
							  cur_obj[parsed[i].value] = stack.peekBack(); //create and descend
							  i += 2;
							  break;
			case "arr"      : stack.push([]);
							  cur_obj[parsed[i].value] = stack.peekBack(); //create and descend
							  i += 2;
							  break;
			case "obj-end"  : 
			case "arr-end"  : stack.pop();
							  cur_obj = stack.peekBack();
							  i++;
							  break;
			case "prim"     : cur_obj[cur_val] = parsed[i + 1].value;
							  i += 2;
							  break;
			case "data"     : cur_obj.push(cur_val);
							  i++;
							  break;
		}
	}
	patient_data[getName(false)] = data;
}

function cvtName(name) {
	name = name.split(" ");
	return "data-" + name[0] + "-" + name[1];
}

function getName(dn_split) {
	var name;
	if(mode === "phys")
		name = document.getElementById("patient_list").getElementsByClassName("selected")[0];
	else
		name = { "innerHTML": assigned_patient.replace("-", " ") }
	
	if(!name || dn_split)
		return name;
	return cvtName(name.innerHTML);
}

function dump(obj, editable, blacklist) {
	if(typeof obj !== 'object') //base case: we're a primitive
		return "<tr><td " + (editable ? "contenteditable" : "") + " onblur=\"saveAndRegenerate()\" class=\"delim data\">" + obj + "</td></tr><!---->";
	else if(Array.isArray(obj)) {
		var ret = "<tr><td class=\"delim arr-start\"></td></tr><!---->"
		obj.forEach(function(x) {
			ret += dump(x, editable, blacklist);
		});
		return ret + "<tr><td class=\"delim arr-end\"></td></tr><!---->";
	}
	else { 
		var ret = "<tr><td class=\"delim obj-start\"></td></tr><!---->";
		Object.keys(obj).forEach(function(x) {
			//provide the parser information on save
			var c = (typeof obj[x] !== 'object') ? "prim" : (Array.isArray(obj[x]) ? "arr" : "obj");
			ret += "<tr><td class=\"delim " + c + "\"><strong>" + x + "</strong></td></tr><!---->";
			var editable = !(blacklist.includes(x));
			ret += dump(obj[x], editable, blacklist);
		});
		return ret + "<tr><td class=\"delim obj-end\"></td></tr><!---->";
	}
}

function saveAndRegenerate() {
	pickup(document.getElementById("data-table").innerHTML);
	reloadDataViewer(null);
}

function reloadDataViewer(name) {
	if(!name)
		name = getName(false);
	else
		name = cvtName(name);
	
	var data = patient_data[name];
	if(!data)
		return;
	var table = document.getElementById("data-table");
	const blacklist = ["name"];
	var table_html = dump(data, true, blacklist);
	
	const blacklist2 = ["information", "saved-images", "saved-vitals"];
	//populate the element selector with top-level arrays and objects. This could *concievably* support
	//nested objects / nested arrays, but I couldn't get it to work in time: so we blacklist them manually.
	var el_box = document.getElementById("element-select-box");
	var inner = "<option value=\"ignore\">Select Element...</option>";
	Object.keys(data).forEach(function(x) {
		if(typeof data[x] === 'object' && !blacklist2.includes(x)) {
			let full = x + " " + (Array.isArray(data[x]) ? "(array)" : "(object)");
			inner += "<option value=\"" + full + "\">" + full + " " + "</option>";
		}
	});
	el_box.innerHTML = inner;
	
	//add all images to image selector
	var img_box = document.getElementById("img-select-box");
	var imgs = "";
	var matches = table_html.matchAll(/(ICU\/patientdata\/.*?)<\/td>/g);
	for(let x of matches) {
		imgs += "<option value=\"" + x[1] + "\">" + x[1] + "</option>";
	}
	img_box.innerHTML = imgs;

	table.innerHTML = table_html;
}

function add_key() {
	var name = getName(false);
	
	//validate key data
	var key_box = document.getElementById("ktextval");
	if(!key_box.value) {
		alert("Empty key!");
		return;
	}
	
	let super_key = document.getElementById("element-select-box").value.match(/^(.*)\(.*\)$/)[1].trim();
	if( (patient_data[name][super_key]).includes(key_box.value)) {
		alert("Key exists!");
		return;
	}
	(patient_data[name][super_key]).push(key_box.value);
	reloadDataViewer(null);
}

function del_key() {
	var name = getName(false);
	//validate key data
	var key_box = document.getElementById("ktextval");
	if(!key_box.value) {
		alert("Empty key!");
		return;
	}
	
	let super_key = document.getElementById("element-select-box").value.match(/^(.*)\(.*\)$/)[1].trim();
	if( !( (patient_data[name][super_key]).includes(key_box.value) )) {
		alert("Key does not exist!");
		return;
	}
	(patient_data[name][super_key]).splice( (patient_data[name][super_key]).indexOf(key_box.value), 1);
	reloadDataViewer(null);
}

function add_kv() {
	var name = getName(false);
	//validate key data
	var key_box = document.getElementById("ktextval");
	if(!key_box.value) {
		alert("Empty key!");
		return;
	}
	var val_box = document.getElementById("vtextval");
	if(!val_box.value) {
		alert("Empty value!");
		return;
	}
	
	let super_key = document.getElementById("element-select-box").value.match(/^(.*)\(.*\)$/)[1].trim();
	if( (patient_data[name][super_key][key_box.value]) ) {
		alert("Key exists!");
		return;
	}
	patient_data[name][super_key][key_box.value] = val_box.value;
	reloadDataViewer(null);
}

function del_kv() {
	var name = getName(false);
	
	//validate key data
	var key_box = document.getElementById("ktextval");
	if(!key_box.value) {
		alert("Empty key!");
		return;
	}
	
	let super_key = document.getElementById("element-select-box").value.match(/^(.*)\(.*\)$/)[1].trim();
	if( !(patient_data[name][super_key][key_box.value]) ) {
		alert("Key does not exist!");
		return;
	}
	delete patient_data[name][super_key][key_box.value];
	reloadDataViewer(null);
}

function open_image() {
	var img_box = document.getElementById("img-select-box");
	if( (img_box.value ?? "ignore") !== "ignore" )
		window.open(img_box.value, 'newwindow', 'width=300,height=300'); 
}

function pad(n) {
	return ("" + n).length == 2 ? n : "0" + n;
}

function save_vitals() {
	var now = new Date();
	var mo = pad(now.getMonth() + 1);
	var dd = pad(now.getDate());
	var yyyy = now.getFullYear();
	var hh = pad(now.getHours());
	var mm = pad(now.getMinutes());
	var ss = pad(now.getSeconds());
	
	var selected_name = getName(true);
	if(!selected_name) {
		alert("No patient selected!");
		return;
	}
	var old = selected_name.innerHTML; //whyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
	selected_name = cvtName(old);
	if(!(patient_data[selected_name])) {
		alert("No patient assigned!");
		return;
	}
		
	var vital_signs = {
		"hr":   vitals.getHR(),
		"bp":   vitals.getBPOut() + "/" + vitals.getBPIn(),
		"SpO2": vitals.getSPO2(),
		"Bpm":  vitals.getBRPM(),
		"tmp":  vitals.getTmp(),
	};
	
	patient_data[selected_name]["saved-vitals"][mo + "-" + dd + "-" + yyyy + "|" + hh + ":" + mm + ":" + ss] = vital_signs;
	
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
	assigned_patient = patient_map[cvtName(name ?? "Invalid User")] ?? ["User Unrecognized"]; 
	assigned_patient = assigned_patient[0] ?? "User unassigned"; //this can be changed to allow one-to-many relationships later!
	mode = window.location.pathname.split("/").pop().split(".").shift().split("_").shift();
	
	if(mode === "phys") {
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
	}
	else {
		document.getElementById("data-viewer-name").innerHTML = "Patient name: " + assigned_patient;
		reloadDataViewer(null);
	}
	
	//edit panel input box
	var el_box = document.getElementById("element-select-box");
	el_box.addEventListener("change", function() {
		let mode = this.value.match(/.*\((.*)\)/);
		if(!mode)
			return;
		mode = mode[1];
		
		//this could be better accomplished by using a querySelector
		var addkbtn  = document.getElementById("addkbtn");
		var delkbtn  = document.getElementById("delkbtn");
		var addkvbtn = document.getElementById("addkvbtn");
		var delkvbtn = document.getElementById("delkvbtn");
		var ktextval = document.getElementById("ktextval");
		var vtextval = document.getElementById("vtextval");
		
		addkbtn.disabled  = true;
		delkbtn.disabled  = true;
		addkvbtn.disabled = true;
		delkvbtn.disabled = true;
		ktextval.disabled = true;
		vtextval.disabled = true;
		
		if(mode === "object") {
			addkvbtn.removeAttribute("disabled");
			delkvbtn.removeAttribute("disabled");
			ktextval.removeAttribute("disabled");
			vtextval.removeAttribute("disabled");
		} 
		else if(mode === "array") {
			addkbtn.removeAttribute("disabled");
			delkbtn.removeAttribute("disabled");
			ktextval.removeAttribute("disabled");
		}
	});
});