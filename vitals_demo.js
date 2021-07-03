//Average statistics in an adult male.
const BASE_HR           = 75;   //heartbeats per minute
const BASE_BP_SYSTOLIC  = 120;  //blood pressure going out (torr)
const BASE_BP_DIASTOLIC = 80;   //'            ' going in  (torr)
const BASE_SPO2         = 99;   //saturation percentage (of) oxygen
const BASE_BPM          = 14;   //breaths per minute
const BASE_TMP          = 98.6; //body temperature, in Farenheit

class Vitals {
	repaintVitals() {
		this.context.fillStyle = 'black';
		this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
		
		var w2  = this.width / 2;
		var h5  = this.height / 5;
		var w6  = this.width / 6;
		var h10 = this.height / 10;
		var w24 = this.width / 24;
		
		var old = this.context.font; //????????
		
		//graph labels
		this.context.font = `${w24}px Verdana`;
		this.context.fillStyle = "#FFFFFF";
		this.context.fillText("HR", 0, 1 * h10, w24);
		this.context.fillStyle = "#FFFFFF";
		this.context.fillText("HR", 0, 3 * h10, w24);
		this.context.fillStyle = "#FFFFFF";
		this.context.fillText("HR", 0, 5 * h10, w24);
		this.context.fillStyle = "#FFFFFF";
		this.context.fillText("HR", 0, 7 * h10, w24);
		
		//values
		this.context.font = old;
		this.context.fillStyle = "#FF0000";
		this.context.fillText(this.getHR(), 2 * w6, 1 * h5, w6)
		this.context.fillStyle = "#FF0000";
		this.context.fillText(this.getBPOut() + "/" + this.getBPIn(), 2 * w6, 2 * h5, w6)
		this.context.fillStyle = "#FF0000";
		this.context.fillText(this.getSPO2(), 2 * w6, 3 * h5, w6)
		this.context.fillStyle = "#FF0000";
		this.context.fillText(this.getBRPM(), 2 * w6, 4 * h5, w6)
		this.context.fillStyle = "#FF0000";
		this.context.fillText(this.getTmp(), 2 * w6, 5 * h5, w6)
		
		//value labels
		w2 += 10;
		this.context.font = `${h5}px Verdana`;
		this.context.fillStyle = "#FF0000";
		this.context.fillText("Heart Rate (bpm)", w2, 1 * h5, w2);
		this.context.fillStyle = "#FF0000";
		this.context.fillText("Blood Pressure (mmHg)", w2, 2 * h5, w2);
		this.context.fillStyle = "#FF0000";
		this.context.fillText("Oxygen Saturation (%)", w2, 3 * h5, w2);
		this.context.fillStyle = "#FF0000";
		this.context.fillText("Respiration (Bpm)", w2, 4 * h5, w2);
		this.context.fillStyle = "#FF0000";
		this.context.fillText("Temperature (°F)", w2, 5 * h5, w2);
	}
	
	constructor(canvas) {
		this.canvas = canvas;
		this.width = canvas.width * 0.95;
		this.height = canvas.height * 0.95;
		this.context = canvas.getContext("2d");
		canvas.style.border = "1px solid black";
		
		this.hr = BASE_HR;
		this.bp_out = BASE_BP_SYSTOLIC;
		this.bp_in  = BASE_BP_DIASTOLIC;
		this.spo2   = BASE_SPO2;
		this.brpm   = BASE_BPM;
		this.tmp    = BASE_TMP;
		
		this.timer  = setInterval(this.repaintVitals.bind(this), 25)
	}
	
	//various getters and setters
	setHR(hr)   { this.hr = hr;       }
	getHR()     { return this.hr      }
	setBPOut(b) { this.bpout = b;     }
	getBPOut()  { return this.bp_out; }
	setBPIn(b)  { this.bpin = b;      }
	getBPIn()   { return this.bp_in;  }
	setSPO2(s)  { this.spo2 = s;      }
	getSPO2()   { return this.spo2    }
	setBRPM(b)  { this.brpm = b;      }
	getBRPM()   { return this.brpm;   }
	setTmp(t)   { this.tmp = t;       }
	getTmp()    { return this.tmp;    }
}

var canv = document.getElementById("my_canvas");
var vitals = new Vitals(canv);