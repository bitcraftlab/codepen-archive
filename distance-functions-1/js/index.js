
////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//       Distance Functions I                                                 //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// @bitcraftlab 2016

// Meandering through Space 2016

// Combining the Distance Functions of two Shapes
// This is also a demo for OOP (object oriented programming)

// Distance functions can be useful to:
// - create elements with a certain distance between them
// - distance field, used as input by agents
//   (braitenberg vehicles, boids, etc ...)
// - create visual effects

// shapes
var shape1;
var shape2;

// pixel density
var d;

// div for showing the frame rate
var fps;

// user interface
var gui;

// div that contains the canvas
var div;

// function choice
var fnChoices = [
  'minimum',
  'maximum',
  'multiply',
  'add',
  'subtract',
  'outline',
  'blob',
  'outlineblob',
  'zebra'
];

// function used to combine distance fields
var fn;

////////////////////////////////////////////////////////////////////////////////
//   Main                                                                     //
////////////////////////////////////////////////////////////////////////////////

function setup() {

  // use (x, y, w, h) format for displaying rectangles
  rectMode(CENTER);

  // we need the pixel density to account for retina displays
  d = pixelDensity();

  // create a background div
  div = createDiv('');
  div.size(windowWidth, windowHeight);
  div.style('background', '#999');

  // center a canvas inside it
  canvas = createCanvas(400, 400);
  canvas.parent(div);
  canvas.center();

  // add border and drop shadow
  canvas.style('box-shadow', '5px 5px 8px rgba(0,0,0,0.35)');
  canvas.style('border', '1px solid black');

  // create a div to show the frame rate
  fps = createDiv('');
  fps.style('font-family', 'arial');
  fps.position(windowWidth - 40, 10);

  // create two shapes
  shape1 = new Circle(width/4, height/2, 50);
  shape2 = new Rect(width/2, height/2, 75, 200);

  // create a GUI, with a function selector
  gui = createGui('distance functions 1');
  gui.addGlobals('fnChoices');

  // hide the cursor when on the canvas
  noCursor();

}


function draw() {

  // pick a function
  fn = window[fnChoices];

  // the first shape follows the mouse
  shape1.goto(mouseX, mouseY);

  // update fps display every 10 frames
  if(frameCount % 10 === 0) {
    fps.html(Math.round(frameRate()));
  }

  // show distance field
  drawDistanceField();

  // draw shapes on top
  noStroke();
  fill(255, 200);
  shape1.draw();
  shape2.draw();

}

function windowResized() {
  // resize main div
  div.size(windowWidth, windowHeight);
  // reposition fps counter
  fps.position(windowWidth - 40, 10);
  // recenter canvas
  canvas.center();
}

////////////////////////////////////////////////////////////////////////////////

function drawDistanceField() {
  loadPixels();
  for(var y = 0; y < height * d; y++) {
    for(var x = 0; x < width * d; x++) {
      var c = fn(shape1.dist(x, y), shape2.dist(x, y));
      var i =  4 * (y * width * d + x);
      // Set Red, Green, Blue and Alpha
      pixels[i] = c;
      pixels[i + 1] = c;
      pixels[i + 2] = c;
      pixels[i + 3] = 255;
    }
  }
  updatePixels();
}

////////////////////////////////////////////////////////////////////////////////
// Shape Class                                                                //
////////////////////////////////////////////////////////////////////////////////

// the mother of all shapes
function Shape(x, y, w, h) {
  // assign attributes
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  return this;
}

Shape.prototype.goto = function(x, y) {
  // update position
  this.x = x;
  this.y = y;
};


////////////////////////////////////////////////////////////////////////////////
//   Rect Class                                                               //
////////////////////////////////////////////////////////////////////////////////

// generic rectangle, extends the shape class

function Rect(x, y, w, h) {
  Shape.call(this, x, y, w, h);
  return this;
}

Rect.prototype = Object.create(Shape.prototype);
Rect.prototype.constructor = Rect;

Rect.prototype.draw = function() {
  rect(this.x, this.y, this.w, this.h);
};

Rect.prototype.dist = function(x, y) {
  var rx = this.w / 2;
  var ry = this.h / 2;
  var dx = Math.max(Math.abs(x / d - this.x) - rx, 0);
  var dy = Math.max(Math.abs(y / d - this.y) - ry, 0);
  return Math.sqrt(dx * dx + dy * dy);
};


////////////////////////////////////////////////////////////////////////////////
//   Circle Class                                                             //
////////////////////////////////////////////////////////////////////////////////

// generic circle, extends the shape class

function Circle(x, y, w) {
  Shape.call(this, x, y, w, w);
  return this;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.draw = function() {
  ellipse(this.x, this.y, this.w, this.h);
};

Circle.prototype.dist = function(x, y) {
  // the radius is half the width
  var rx = this.w / 2 ;
  // delta x and y
  var dx = x / d - this.x;
  var dy = y / d - this.y;
  // return distance from the circle
  return Math.sqrt(dx * dx + dy * dy) - rx;
};

////////////////////////////////////////////////////////////////////////////////
//   Combination Functions                                                    //
////////////////////////////////////////////////////////////////////////////////

// Some functions to combine the output from two distance functions

// get the minimum distance
function minimum(v1, v2) {
  return Math.min(v1, v2);
}

// get the maximum distance
function maximum(v1, v2) {
  return Math.max(v1, v2);
}

// multiply the values
function multiply(v1, v2) {
  return v1 * v2 / 10;
}

// add the values
function add(v1, v2) {
  return v1 + v2;
}

// subtract the values
function subtract(v1, v2) {
  return v1 - v2;
}

// minimum combined with a step function
function outline(v1, v2) {
  return minimum(v1, v2) > 10 ? 255 : 0;
}

// multiplication combined with a step function
function blob(v1, v2) {
  return multiply(v1, v2) > 100 ? 255 : 0;
};

// outline combined with blob function
function outlineblob(v1, v2) {
  return minimum(outline(v1, v2), blob(v1, v2));
}

// black and white stripes
function zebra(v1, v2) {
  return multiply(v1, v2) % 255 > 127 ? 0 : 255;
}