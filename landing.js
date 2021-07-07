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

Array.prototype.peekBack = function() {
    return this[this.length - 1];
}

Array.prototype.swap = function (x,y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}

function pickup(html) {
	var parsed = [];
	var lines = html.substring(7, html.length - 9).split("<!---->"); //badness
	lines.forEach(function(x) {
		const regex = /<tr><td.*class="(.*)">(?:\<strong>)?(.*)(?:\<\/strong>)?<\/td><\/tr>/;
		let match = x.match(regex);
		var sub = match[2].match(/(.*)<\/strong>/);
		if(sub)
			match[2] = sub[1];
		//print class + data;
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
		console.log(cur_type, cur_val, i);
		
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
	var name = document.getElementById("patient_list").getElementsByClassName("selected")[0].innerHTML; // i don't know if this causes a race condition
	name = name.split(" ");
	name = "data-" + name[0] + "-" + name[1];
	patient_data[name] = data;
}

function dump(obj, editable) {
	if(typeof obj !== 'object') //base case: we're a primitive
		return "<tr><td " + (editable ? "contenteditable" : "") + " onblur=\"saveAndRegenerate()\" class=\"data\">" + obj + "</td></tr><!---->";
	else if(Array.isArray(obj)) {
		var ret = "<tr><td class=\"arr-start\"></td></tr><!---->"
		obj.forEach(function(x) {
			ret += dump(x, true); //not strictly necessary, but good to be consistent
		});
		return ret + "<tr><td class=\"arr-end\"></td></tr><!---->";
	}
	else { 
		var ret = "<tr><td class=\"obj-start\"></td></tr><!---->";
		Object.keys(obj).forEach(function(x) {
			//provide the parser information on save
			var c = (typeof obj[x] !== 'object') ? "prim" : (Array.isArray(obj[x]) ? "arr" : "obj");
			ret += "<tr><td class=\"" + c + "\"><strong>" + x + "</strong></td></tr><!---->";
			ret += dump(obj[x], (x === "name" ? false : true));
		});
		return ret + "<tr><td class=\"obj-end\"></td></tr><!---->";
	}
}

function saveAndRegenerate() {
	pickup(document.getElementById("data-table").innerHTML);
	reloadDataViewer(null);
}

function reloadDataViewer(name) {
	if(!name)
		name = document.getElementById("patient_list").getElementsByClassName("selected")[0].innerHTML; // i don't know if this causes a race condition
	name = name.split(" ");
	name = "data-" + name[0] + "-" + name[1];
	var data = patient_data[name];
	
	var table = document.getElementById("data-table");
	var table_html = dump(data, false);
	
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