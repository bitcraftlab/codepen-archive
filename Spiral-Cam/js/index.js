// Chrome is highly recommended!
// Firefox is kind of sloooooow.

// dom elements
var capture;
var canvas;
var div;
var gui;

// webcam default size
var w = 640;
var h = 480;

// gap between strokes
var gap = 10;
var gapMin = 10;
var gapMax = 50;

// constant angular velocity of 2 degrees
var aStep = 2;
var aStepMin = 2;
var aStepMax = 30

var zoom = 1;
var zoomMin = 0.1;
var zoomMax = 2;
var zoomStep = 0.1;


function setup() {
  
  angleMode(DEGREES);
  
  // create a div to hold the image
  div = createDiv('');
  div.size(windowWidth, windowHeight);
  
  // capture webcam
  capture = createCapture(VIDEO);
  capture.hide();
  
  // canvas centered inside the div
  canvas = createCanvas(w, h);
  canvas.parent(div);
  canvas.center();
  
  gui = createGui('Spiral Cam');
  gui.addGlobals('zoom', 'gap', 'aStep');
  
}


function draw() {
  
  // zoom in!
  translate(width/2, height/2);
  scale(zoom);
  translate(-width/2, -height/2)
  
  if(capture) {
    
    capture.loadPixels();

    background(255);

    // diameter of the sral
    var d = min(w, h);

    // number of turns
    var turns = d / 2 / gap;

    // total turning angle of the spiral
    var angle = turns * 360;

    // previous coordinates
    var px, py;

    // constant angular velocity
    for(var a = 1; a < angle; a += aStep){

      // sample color from the camera
      var c = getColor(capture, round(px), round(py));

      // pixel brightness
      var b = brightness(c);

      // next point on the spiral
      var pt = spiral(a);

      // stroke weight
      var sw = map(b, 0, 100, gap, 1);
      strokeWeight(sw);

      // connect previous and current point
      line(px, py, pt.x, pt.y);

      // save previous position
      px = pt.x;
      py = pt.y;

    }
    
  }

}


// get a pixel from the pixel array
function getColor(grid, x, y) {
  // get pixel index
  var idx =(y * w + x) * 4;
  // [ red, green, blue ] components
  var c = [grid.pixels[idx], grid.pixels[idx+1], grid.pixels[idx+2]];
  return c;
}


function spiral(a){
  // compute radius based on angle
  var r = a / 360 * gap;
  // calculate point on the spiral
  return {
    x: w/2 + cos(a) * r,
    y: h/2 + sin(a) * r
  };
}

function windowResized() {
  div.size(windowWidth, windowHeight);
  canvas.center();
}