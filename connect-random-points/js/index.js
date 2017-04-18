// Meandering Through Space 2016 

// lecture 3 - connect random points

// things to try:
// * create your own random function!
// * connect the dots using curves

var drawVertices = true;
var drawCurve = true;
var drawFilling = false;

var seed = 0;
var fillColor = [255, 200, 220];
var points = 10;

function setup() {
  
  // create a window filling canvas
  createCanvas(windowWidth, windowHeight);
  
  // create a gui
  sliderRange(0, 1000, 1);
  gui = createGui('connect random points');
  gui.addGlobals('seed', 'points', 'drawVertices', 'drawCurve', 'drawFilling', 'fillColor');
  
  // only redraw the canvas when the GUI changes
  noLoop();
}


function draw() {
  
  // clear screen
  clear();

  // pick filling
  if(drawFilling) {
    fill(fillColor);
  } else {
    noFill();
  }
  stroke(0);
  
  // draw the curve
  if(drawCurve) {
    randomSeed(seed); // reset random seed!
    beginShape();
    for(var i = 0; i < points; i++) {
      var x = myRandom(0, width);
      var y = myRandom(0, height);
      vertex(x, y);
    }
    endShape();
  }
  
   // mark the vertices
  if(drawVertices) {
    randomSeed(seed); // reset random seed!
    fill(0);
    noStroke();
    for(var i = 0; i < points; i++) {
      var x = myRandom(0, width);
      var y = myRandom(0, height);
      ellipse(x, y, 5, 5);
    }
  }
  
}

// adjust canvas to the window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// your custom random function
function myRandom(a, b) {
    var r1 = random();
    var r2 = random();
    var r = map(r1 + r2, 0, 2, a, b);
    return r;
}