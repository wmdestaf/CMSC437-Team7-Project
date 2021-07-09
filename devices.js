// Positions of devices, 0 means position is empty and 1 means position has a register device
var position1 = 0;
var position2 = 0;
var position3 = 0;
var registered = [];

function register_device() {
    var option = document.getElementById("positions").value;
    var type = document.getElementById("devices").value;

	const decode = ["","one","two","three"];
	let idx = decode.indexOf(option);
	
	if(eval("position" + idx)) {
		alert("A device already occupies position " + idx + "!");
		return;
	}
	else if(registered.includes(type)) {
		alert("That device is already registered!");
		return;
	}
	registered.push(type);

    // check which position to add device
    if (position1 == 0 && option == "one") {
        if (type == "ventilator") {
            document.getElementById("tool").innerHTML = "Ventilator";
            document.getElementById("tool-description").innerHTML = "FiO2 = 99%";
            document.getElementById("tool-description2").innerHTML = "Target Breaths / Min = 14";
			
			let controls = "";
			controls += "<label for=\"sp_slider\">FiO2</label>";
			controls += "<input type=\"range\" min=\"0\" max=\"100\" value=\"99\" class=\"slider\" id=\"sp_slider\"/><br>";
			document.getElementById("tool1-controls").innerHTML = controls;
			
			let controls2 = "";
			controls2 += "<label for=\"bpm_slider\">BPM</label>";
			controls2 += "<input type=\"range\" min=\"0\" max=\"100\" value=\"14\" class=\"slider\" id=\"bpm_slider\"/>";
			document.getElementById("tool1-controls").innerHTML += controls2;
			let slider2 = document.getElementById("bpm_slider");
			slider2.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					vitals.setBRPM(x);
					document.getElementById("tool-description2").innerHTML = "Target Breaths / Min = " + x;
				}
			}
			let slider = document.getElementById("sp_slider"); //if this isn't down here, the dom gets corrupted
			slider.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					vitals.setSPO2(x);
					 document.getElementById("tool-description").innerHTML = "FiO2 = " + x + "%";
				}
			}
        }

        if (type == "infusion") {
            document.getElementById("tool").innerHTML = "Infustion Pump";
            document.getElementById("tool-description").innerHTML = "Rate mL/hr = 0";
            document.getElementById("tool-description2").innerHTML = "Vol Lnf mL = 0";
			let controls = "";
			controls += "<label for=\"sp_slider\">Rate</label>";
			controls += "<input type=\"range\" min=\"0\" max=\"100\" value=\"0\" class=\"slider\" id=\"rate_slider\"/><br>";
			document.getElementById("tool1-controls").innerHTML = controls;
			
			let controls2 = "";
			controls2 += "<label for=\"bpm_slider\">Volume</label>";
			controls2 += "<input type=\"range\" min=\"0\" max=\"100\" value=\"0\" class=\"slider\" id=\"vol_slider\"/>";
			document.getElementById("tool1-controls").innerHTML += controls2;
			
			let controls3 = "<label for=\"inf_check\">Enable:</label><input type=\"checkbox\" id=\"inf_check\">"
			document.getElementById("tool1-controls").innerHTML += controls3;
			
			let slider2 = document.getElementById("vol_slider");
			slider2.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					document.getElementById("tool-description2").innerHTML = "Vol Lnf mL = " + x;
				}
			}
			let slider = document.getElementById("rate_slider"); //if this isn't down here, the dom gets corrupted
			slider.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					 document.getElementById("tool-description").innerHTML = "Rate mL/hr = " + x;
				}
			}
        }

        if (type == "syringe") {
            document.getElementById("tool").innerHTML = "Syringe Pump";
            document.getElementById("tool-description").innerHTML = "Rate mL/hr = 0";
            document.getElementById("tool-description2").innerHTML = "";
			
			let controls = "";
			controls += "<label for=\"sp_slider\">Rate</label>";
			controls += "<input type=\"range\" min=\"0\" max=\"100\" value=\"0\" class=\"slider\" id=\"syr_slider\"/><br>";
			document.getElementById("tool1-controls").innerHTML = controls;

			let controls3 = "<label for=\"syr_check\">Enable:</label><input type=\"checkbox\" id=\"syr_check\">"
			document.getElementById("tool1-controls").innerHTML += controls3;
			
			let slider = document.getElementById("syr_slider"); //if this isn't down here, the dom gets corrupted
			slider.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					 document.getElementById("tool-description").innerHTML = "Rate mL/hr = " + x;
				}
			}
        }

        position1 =+ 1;
    }

    if (position2 == 0 && option == "two") {
        if (type == "ventilator") {
            document.getElementById("tool2").innerHTML = "Ventilator";
            document.getElementById("tool-description3").innerHTML = "FiO2 = 99%";
            document.getElementById("tool-description4").innerHTML = "Target Breaths / Min = 14";
			
			let controls = "";
			controls += "<label for=\"sp_slider\">FiO2</label>";
			controls += "<input type=\"range\" min=\"0\" max=\"100\" value=\"99\" class=\"slider\" id=\"sp_slider\"/><br>";
			document.getElementById("tool2-controls").innerHTML = controls;
			
			let controls2 = "";
			controls2 += "<label for=\"bpm_slider\">BPM</label>";
			controls2 += "<input type=\"range\" min=\"0\" max=\"100\" value=\"14\" class=\"slider\" id=\"bpm_slider\"/>";
			document.getElementById("tool2-controls").innerHTML += controls2;
			let slider2 = document.getElementById("bpm_slider");
			slider2.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					vitals.setBRPM(x);
					document.getElementById("tool-description4").innerHTML = "Target Breaths / Min = " + x;
				}
			}
			let slider = document.getElementById("sp_slider"); //if this isn't down here, the dom gets corrupted
			slider.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					vitals.setSPO2(x);
					 document.getElementById("tool-description3").innerHTML = "FiO2 = " + x + "%";
				}
			}
        }

        if (type == "infusion") {
            document.getElementById("tool2").innerHTML = "Infustion Pump";
            document.getElementById("tool-description3").innerHTML = "Rate mL/hr = 0";
            document.getElementById("tool-description4").innerHTML = "Vol Lnf mL = 0";
			
			let controls = "";
			controls += "<label for=\"sp_slider\">Rate</label>";
			controls += "<input type=\"range\" min=\"0\" max=\"100\" value=\"0\" class=\"slider\" id=\"rate_slider\"/><br>";
			document.getElementById("tool2-controls").innerHTML = controls;
			
			let controls2 = "";
			controls2 += "<label for=\"bpm_slider\">Volume</label>";
			controls2 += "<input type=\"range\" min=\"0\" max=\"100\" value=\"0\" class=\"slider\" id=\"vol_slider\"/>";
			document.getElementById("tool2-controls").innerHTML += controls2;
			
			let controls3 = "<label for=\"inf_check\">Enable:</label><input type=\"checkbox\" id=\"inf_check\">"
			document.getElementById("tool2-controls").innerHTML += controls3;
			
			let slider2 = document.getElementById("vol_slider");
			slider2.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					document.getElementById("tool-description4").innerHTML = "Vol Lnf mL = " + x;
				}
			}
			let slider = document.getElementById("rate_slider"); //if this isn't down here, the dom gets corrupted
			slider.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					 document.getElementById("tool-description3").innerHTML = "Rate mL/hr = " + x;
				}
			}
        }

        if (type == "syringe") {
            document.getElementById("tool2").innerHTML = "Syringe Pump";
            document.getElementById("tool-description3").innerHTML = "Rate mL/hr = 0";
            document.getElementById("tool-description4").innerHTML = "";
			
			let controls = "";
			controls += "<label for=\"sp_slider\">Rate</label>";
			controls += "<input type=\"range\" min=\"0\" max=\"100\" value=\"0\" class=\"slider\" id=\"syr_slider\"/><br>";
			document.getElementById("tool2-controls").innerHTML = controls;

			let controls3 = "<label for=\"syr_check\">Enable:</label><input type=\"checkbox\" id=\"syr_check\">"
			document.getElementById("tool2-controls").innerHTML += controls3;
			
			let slider = document.getElementById("syr_slider"); //if this isn't down here, the dom gets corrupted
			slider.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					 document.getElementById("tool-description3").innerHTML = "Rate mL/hr = " + x;
				}
			}
        }

        position2 =+ 1;
    }

    if (position3 == 0 && option == "three") {
        if (type == "ventilator") {
            document.getElementById("tool3").innerHTML = "Ventilator";
            document.getElementById("tool-description5").innerHTML = "FiO2 = 99%";
            document.getElementById("tool-description6").innerHTML = "Target Breaths / Min = 14";
			
			let controls = "";
			controls += "<label for=\"sp_slider\">FiO2</label>";
			controls += "<input type=\"range\" min=\"0\" max=\"100\" value=\"99\" class=\"slider\" id=\"sp_slider\"/><br>";
			document.getElementById("tool3-controls").innerHTML = controls;
			
			let controls2 = "";
			controls2 += "<label for=\"bpm_slider\">BPM</label>";
			controls2 += "<input type=\"range\" min=\"0\" max=\"100\" value=\"14\" class=\"slider\" id=\"bpm_slider\"/>";
			document.getElementById("tool3-controls").innerHTML += controls2;
			let slider2 = document.getElementById("bpm_slider");
			slider2.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					vitals.setBRPM(x);
					document.getElementById("tool-description6").innerHTML = "Target Breaths / Min = " + x;
				}
			}
			let slider = document.getElementById("sp_slider"); //if this isn't down here, the dom gets corrupted
			slider.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					vitals.setSPO2(x);
					 document.getElementById("tool-description5").innerHTML = "FiO2 = " + x + "%";
				}
			}
        }

        if (type == "infusion") {
            document.getElementById("tool3").innerHTML = "Infustion Pump";
            document.getElementById("tool-description5").innerHTML = "Rate mL/hr = 0";
            document.getElementById("tool-description6").innerHTML = "Vol Lnf mL = 0";
			
			let controls = "";
			controls += "<label for=\"sp_slider\">Rate</label>";
			controls += "<input type=\"range\" min=\"0\" max=\"100\" value=\"0\" class=\"slider\" id=\"rate_slider\"/><br>";
			document.getElementById("tool3-controls").innerHTML = controls;
			
			let controls2 = "";
			controls2 += "<label for=\"bpm_slider\">Volume</label>";
			controls2 += "<input type=\"range\" min=\"0\" max=\"100\" value=\"0\" class=\"slider\" id=\"vol_slider\"/>";
			document.getElementById("tool3-controls").innerHTML += controls2;
			
			let controls3 = "<label for=\"inf_check\">Enable:</label><input type=\"checkbox\" id=\"inf_check\">"
			document.getElementById("tool3-controls").innerHTML += controls3;
			
			let slider2 = document.getElementById("vol_slider");
			slider2.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					document.getElementById("tool-description6").innerHTML = "Vol Lnf mL = " + x;
				}
			}
			let slider = document.getElementById("rate_slider"); //if this isn't down here, the dom gets corrupted
			slider.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					 document.getElementById("tool-description5").innerHTML = "Rate mL/hr = " + x;
				}
			}
        }

        if (type == "syringe") {
            document.getElementById("tool3").innerHTML = "Syringe Pump";
            document.getElementById("tool-description5").innerHTML = "Rate mL/hr = 0";
            document.getElementById("tool-description6").innerHTML = "";
			
			let controls = "";
			controls += "<label for=\"sp_slider\">Rate</label>";
			controls += "<input type=\"range\" min=\"0\" max=\"100\" value=\"0\" class=\"slider\" id=\"syr_slider\"/><br>";
			document.getElementById("tool3-controls").innerHTML = controls;

			let controls3 = "<label for=\"syr_check\">Enable:</label><input type=\"checkbox\" id=\"syr_check\">"
			document.getElementById("tool3-controls").innerHTML += controls3;
			
			let slider = document.getElementById("syr_slider"); //if this isn't down here, the dom gets corrupted
			slider.oninput = function() {
				var x = Number.parseFloat(this.value);
				if(!isNaN(x)) {
					 document.getElementById("tool-description5").innerHTML = "Rate mL/hr = " + x;
				}
			}
        }

        position3 =+ 1;
    }
}

function unregister_device() {
    var option = document.getElementById("positions").value;

	const decode = ["","one","two","three"];
	let idx = decode.indexOf(option);
	if(eval("!position" + idx)) {
		alert("Error: Slot " + option + " has no device connected.")
		return;
	}
	
	registered = registered.filter(function(x) {
		let y = document.getElementById("tool" + (idx > 1 ? idx : "")).innerHTML.split(" ")[0].toLowerCase();
		return x !== y;
	});
	
    // check if device is connected and remove it
    if (option == "one" && position1 == 1) {
        document.getElementById("tool").innerHTML = "";
        document.getElementById("tool-description").innerHTML = "";
        document.getElementById("tool-description2").innerHTML = "";
        document.getElementById("tool1-controls").innerHTML = "";
        position1 = 0;
    }

    if (option == "two" && position2 == 1) {
        document.getElementById("tool2").innerHTML = "";
        document.getElementById("tool-description3").innerHTML = "";
        document.getElementById("tool-description4").innerHTML = "";
		document.getElementById("tool2-controls").innerHTML = "";
        position2 = 0;
    }

    if (option == "three" && position3 == 1) {
        document.getElementById("tool3").innerHTML = "";
        document.getElementById("tool-description5").innerHTML = "";
        document.getElementById("tool-description6").innerHTML = "";
		document.getElementById("tool3-controls").innerHTML = "";
        position3 = 0;
    }

}