//Average statistics in an adult male.
const BASE_HR           = 75;   //heartbeats per minute
const BASE_BP_SYSTOLIC  = 120;  //blood pressure going out (torr)
const BASE_BP_DIASTOLIC = 80;   //'            ' going in  (torr)
const BASE_SPO2         = 99;   //saturation percentage (of) oxygen
const BASE_BPM          = 14;   //breaths per minute
const BASE_TMP          = 98.6; //body temperature, in Farenheit

const HR_COLOR    = "#FF00FF";
const BP_COLOR    = "#FFA500";
const BP2_COLOR   = "#FF8C00";
const SPO2_COLOR  = "#00FF00";
const BPM_COLOR   = "#0000FF";
const TMP_COLOR   = "#FF0000";

class Vitals {
	
	drawGraph(graph, xbase, yinvbase, width, height, color, lw = 3) {
		this.context.strokeStyle = color;
		this.context.lineWidth = lw;

		var iter = graph.iter();
		var elemct = graph.maxSize();
		var pos = 0;
		
		var first = graph.head();
		this.context.beginPath(); 
		this.context.moveTo(xbase, yinvbase - (first * height));
		for(const item of iter) {
			var x = (width * (pos++ / elemct)) + xbase;
			var y = yinvbase - (item * height);
			this.context.lineTo(x, y);
		}
		this.context.stroke();
	}
	
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
		this.context.fillStyle = "white";
		this.context.fillText("HR", 0, 1 * h10, w24);
		this.context.fillStyle = "white";
		this.context.fillText("NIPB", 0, 3 * h10, w24);
		this.context.fillStyle = "white";
		this.context.fillText("SpO2", 0, 5 * h10, w24);
		this.context.fillStyle = "white";
		this.context.fillText("RR", 0, 7 * h10, w24);
		this.context.fillStyle = "white";
		this.context.fillText("TMP", 0, 9 * h10, w24);
		
		//graph data
		this.hrGraph.setTickTime(this.hr);
		this.hrGraph.poll();
		
		this.bpoutGraph.add(this.bp_out);
		this.bpinGraph.add(this.bp_in);
		this.bpinGraph.synchronize(this.bpoutGraph);
		
		this.spo2Graph.add(this.spo2);
		this.brpmGraph.add(this.brpm);
		this.tmpGraph.add(this.tmp)
		
		w24 += 5;
		var mwGraph = (2 * w6) - w24;
		
		//graph display
		this.drawGraph(this.hrGraph,    w24, 1 * h5, mwGraph, h5, HR_COLOR);
		this.drawGraph(this.bpoutGraph, w24, 2 * h5, mwGraph, h5, BP_COLOR);
		this.drawGraph(this.bpinGraph,  w24, 2 * h5, mwGraph, h5, BP2_COLOR);
		this.drawGraph(this.spo2Graph,  w24, 3 * h5, mwGraph, h5, SPO2_COLOR);
		this.drawGraph(this.brpmGraph,  w24, 4 * h5, mwGraph, h5, BPM_COLOR);
		this.drawGraph(this.tmpGraph,   w24, 5 * h5, mwGraph, h5, TMP_COLOR);
		
		
		//values
		this.context.font = old;
		this.context.fillStyle = HR_COLOR;
		this.context.fillText(this.getHR(), 2 * w6, 1 * h5, w6)
		this.context.fillStyle = BP_COLOR;
		this.context.fillText(this.getBPOut() + "/" + this.getBPIn(), 2 * w6, 2 * h5, w6)
		this.context.fillStyle = SPO2_COLOR;
		this.context.fillText(this.getSPO2(), 2 * w6, 3 * h5, w6)
		this.context.fillStyle = BPM_COLOR;
		this.context.fillText(this.getBRPM(), 2 * w6, 4 * h5, w6)
		this.context.fillStyle = TMP_COLOR;
		this.context.fillText(this.getTmp(), 2 * w6, 5 * h5, w6)
		
		//value labels
		w2 += 10;
		this.context.font = `${h5}px Verdana`;
		this.context.fillStyle = HR_COLOR;
		this.context.fillText("Heart Rate (bpm)", w2, 1 * h5, w2);
		this.context.fillStyle = BP_COLOR;
		this.context.fillText("Blood Pressure (mmHg)", w2, 2 * h5, w2);
		this.context.fillStyle = SPO2_COLOR;
		this.context.fillText("Oxygen Saturation (%)", w2, 3 * h5, w2);
		this.context.fillStyle = BPM_COLOR;
		this.context.fillText("Respiration (Bpm)", w2, 4 * h5, w2);
		this.context.fillStyle = TMP_COLOR;
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
		
		this.hrGraph = new RingTimeBuffer(300, 0, 1, BASE_HR);
		
		this.bpinGraph  = new RingBuffer(1000, 40, 200); 
		this.bpoutGraph = new RingBuffer(1000, 40, 200);
		this.bpinGraph.synchronize(this.bpoutGraph);
		
		this.spo2Graph  = new RingBuffer(1000, 80, 100); //store last 25 seconds
		this.brpmGraph  = new RingBuffer(1000, 5, 20);
		this.tmpGraph   = new RingBuffer(1000, 95, 104);
		
		this.timer  = setInterval(this.repaintVitals.bind(this), 25)
	}

	setHR(hr)   { this.hr = hr;       }
	getHR()     { return this.hr      }
	setBPOut(b) { this.bp_out = b;    }
	getBPOut()  { return this.bp_out; }
	setBPIn(b)  { this.bp_in = b;     }
	getBPIn()   { return this.bp_in;  }
	setSPO2(s)  { this.spo2 = s;      }
	getSPO2()   { return this.spo2    }
	setBRPM(b)  { this.brpm = b;      }
	getBRPM()   { return this.brpm;   }
	setTmp(t)   { this.tmp = t;       }
	getTmp()    { return this.tmp;    }
}

class RingBuffer { //JS inbuilt arrays are annoying, and I don't want to deal with 
                   //an O(n) dequeue when the repaint/redraw loop is running this tight
				   //This logic is taken from an RB I built in a DSA class before I transferred here
	constructor(size, minv = Number.MAX_VALUE, maxv = Number.MIN_VALUE) {
		this.max = size;
		this.size = 0;
		this.front = 0;
		this.rear = 0;
		this.data = Array(this.size);
		
		this.maxv = maxv;
		this.minv = minv;
	}
	
	widen(off) {
		this.maxv += off;
		this.minv -= off;
	}
	
	synchronize(other) {
		other.maxv = this.maxv = Math.max(this.maxv, other.maxv);
		other.minv = this.minv = Math.min(this.minv, other.minv);
	}
	
	maxSize() {
		return this.max;
	}
	
	normalize(x) {
		return (this.maxv === this.minv) ? 0.5 : ((x - this.minv) / (this.maxv - this.minv));
	}
	
	add(elem) {
		if(elem > this.maxv)
			this.maxv = elem;
		if(elem < this.minv)
			this.minv = elem;
		
		if(this.size == this.max) { //dequeue to make room
			this.front = (this.front + 1) % this.max;
			this.size--;
		}
		this.data[this.rear] = elem;
		this.rear = (this.rear + 1) % this.max;
		this.size++;
	}
	
	head() {
		return this.size != 0 ? this.data[this.head] : 0;
	}
	
	*iter() { 
		for(var i = 0; i < this.size; ++i) {
			yield this.normalize(this.data[ (i + this.front) % this.max ]);
		}
		return null;
	}	
}

class RingTimeBuffer extends RingBuffer {
	
	constructor(size, minv = Number.MAX_VALUE, maxv = Number.MIN_VALUE, tickTime) {
		super(size, minv, maxv);
		this.setTickTime(tickTime);
		this.startTime = new Date().getTime();
	}
	
	setTickTime(time) {
		this.tickTime = 60000 / time;
	}
	
	poll() {
		var now = new Date().getTime();
		if(now - this.startTime >= this.tickTime) {
			this.add(0.75);
			this.startTime = now;
		}
		else
			this.add(0);
	}
}

/////////////////////////SETUP/////////////////////
var canv = null;
var vitals = null;
function reset_graph() {
	canv = document.getElementById("my_canvas");
	if(vitals)
		clearInterval(vitals.timer);
	vitals = new Vitals(canv);
}
reset_graph();
////////////////////////////////////////////////////