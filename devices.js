// Positions of devices, 0 means position is empty and 1 means position has a register device
var position1 = 0;
var position2 = 0;
var position3 = 0;

function register_device() {
    var option = document.getElementById("positions").value;
    var type = document.getElementById("devices").value;

    // Error, check if position has a register device already
    if ((position1 == 1 && option == "one") || 
        (position2 == 1 && option == "two") ||
        (position3 == 1 && option == "three")) {
            
            if (((option == "one") && (document.getElementById("tool").innerHTML == "Ventilator") && type == "ventilator") ||
                ((option == "one") && (document.getElementById("tool").innerHTML == "Infustion Pump") && type == "infusion") ||
                ((option == "one") && (document.getElementById("tool").innerHTML == "Syringe Pump") && type == "syringe")) {
                    alert("Error: " + document.getElementById("tool").innerHTML + " device is already registered")
            }
            
            else if (((option == "two") && (document.getElementById("tool2").innerHTML == "Ventilator") && type == "ventilator") ||
                ((option == "two") && (document.getElementById("tool2").innerHTML == "Infustion Pump") && type == "infusion") ||
                ((option == "two") && (document.getElementById("tool2").innerHTML == "Syringe Pump") && type == "syringe")) {
                    alert("Error: " + document.getElementById("tool2").innerHTML + " device is already registered")
            }
            
            else if (((option == "three") && (document.getElementById("tool3").innerHTML == "Ventilator") && type == "ventilator") ||
                ((option == "three") && (document.getElementById("tool3").innerHTML == "Infustion Pump") && type == "infusion") ||
                ((option == "three") && (document.getElementById("tool3").innerHTML == "Syringe Pump") && type == "syringe")) {
                    alert("Error: " + document.getElementById("tool3").innerHTML + " device is already registered")
            }

            else {
                alert("Error: Slot " + option + " has a device already connected.")
            }
    }

    // check which position to add device
    if (position1 == 0 && option == "one") {
        if (type == "ventilator") {
            document.getElementById("tool").innerHTML = "Ventilator";
            document.getElementById("tool-description").innerHTML = "FiO2 = 0%";
            document.getElementById("tool-description2").innerHTML = "Flow Rate L/min = 0";
        }

        if (type == "infusion") {
            document.getElementById("tool").innerHTML = "Infustion Pump";
            document.getElementById("tool-description").innerHTML = "Rate mL/hr = 0";
            document.getElementById("tool-description2").innerHTML = "Vol Lnf mL = 0";
        }

        if (type == "syringe") {
            document.getElementById("tool").innerHTML = "Syringe Pump";
            document.getElementById("tool-description").innerHTML = "Rate mL/hr = 0";
            document.getElementById("tool-description2").innerHTML = "";
        }

        position1 =+ 1;
    }

    if (position2 == 0 && option == "two") {
        if (type == "ventilator") {
            document.getElementById("tool2").innerHTML = "Ventilator";
            document.getElementById("tool-description3").innerHTML = "FiO2 = 0%";
            document.getElementById("tool-description4").innerHTML = "Flow Rate L/min = 0";
        }

        if (type == "infusion") {
            document.getElementById("tool2").innerHTML = "Infustion Pump";
            document.getElementById("tool-description3").innerHTML = "Rate mL/hr = 0";
            document.getElementById("tool-description4").innerHTML = "Vol Lnf mL = 0";
        }

        if (type == "syringe") {
            document.getElementById("tool2").innerHTML = "Syringe Pump";
            document.getElementById("tool-description3").innerHTML = "Rate mL/hr = 0";
            document.getElementById("tool-description4").innerHTML = "";
        }

        position2 =+ 1;
    }

    if (position3 == 0 && option == "three") {
        if (type == "ventilator") {
            document.getElementById("tool3").innerHTML = "Ventilator";
            document.getElementById("tool-description5").innerHTML = "FiO2 = 0%";
            document.getElementById("tool-description6").innerHTML = "Flow Rate L/min = 0";
        }

        if (type == "infusion") {
            document.getElementById("tool3").innerHTML = "Infustion Pump";
            document.getElementById("tool-description5").innerHTML = "Rate mL/hr = 0";
            document.getElementById("tool-description6").innerHTML = "Vol Lnf mL = 0";
        }

        if (type == "syringe") {
            document.getElementById("tool3").innerHTML = "Syringe Pump";
            document.getElementById("tool-description5").innerHTML = "Rate mL/hr = 0";
            document.getElementById("tool-description6").innerHTML = "";
        }

        position3 =+ 1;
    }
}

function unregister_device() {
    var option = document.getElementById("positions").value;

    // Error, check if there's no device connected
    if ((option == "one" && position1 == 0)||
        (option == "two" && position2 == 0)||
        (option == "three" && position3 == 0)) {
        alert("Error: Slot " + option + " has no device connected.")
    }

    // check if device is connected and remove it
    if (option == "one" && position1 == 1) {
        document.getElementById("tool").innerHTML = "";
        document.getElementById("tool-description").innerHTML = "";
        document.getElementById("tool-description2").innerHTML = "";
        position1 = 0;
    }

    if (option == "two" && position2 == 1) {
        document.getElementById("tool2").innerHTML = "";
        document.getElementById("tool-description3").innerHTML = "";
        document.getElementById("tool-description4").innerHTML = "";
        position2 = 0;
    }

    if (option == "three" && position3 == 1) {
        document.getElementById("tool3").innerHTML = "";
        document.getElementById("tool-description5").innerHTML = "";
        document.getElementById("tool-description6").innerHTML = "";
        position3 = 0;
    }

}

function check_device() {
    var option = document.getElementById("positions").value;
    /*
    if {
        alert("");
    }
    */
}