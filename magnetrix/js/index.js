////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//    M A G N E T R I X                                                       //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// a matrix of magnetic needles
// simple example of collective behaviour

// @bitcraftlab 2016 - Meandering Code 2016


// HOMEWORK

// 1. Use p5.gui to make some of the variables adjustable.
//   (alignment speed, size of the magnets, arrangement of the magnets ...)

// 2. Add intuitive mouse interaction to the sketch

// 3. The system settles to a stable state quite fast.
//    Modify the system so it stays in motion continuously either by:
//    - Constantly adding motion to the system
//    - Creating laws of nature that conserve motion rather than annihilate it

// OPTIONAL

// 4. The needles create a magnetic field
//    Think of a way to visulaize the field without showing the needles.
//    (Hint: Trajectories, colors, fieldlines ... )
//    Use p5.gui to switch between visualizations


////////////////////////////////////////////////////////////////////////////////
// parameters                                                                 //
////////////////////////////////////////////////////////////////////////////////


// diameter of the canvas
var dcanvas = 300;

// 400 compass needles in a 20 x 20 grid
var cols = 20;
var rows = 20;

// size of a compass
var s = 20;

// distance from the bordr
var gap = 50;


////////////////////////////////////////////////////////////////////////////////
// globals
////////////////////////////////////////////////////////////////////////////////

var canvas;

// alignment factor
var alignment = 0.9;

// compass array
var c = [];

////////////////////////////////////////////////////////////////////////////////
// main
////////////////////////////////////////////////////////////////////////////////

function setup() {

  angleMode(DEGREES);

  // create a div that filld the window
  div = createDiv('');
  div.size(windowWidth, windowHeight);

  // create a canvas centered inside the div
  canvas = createCanvas(dcanvas, dcanvas);
  canvas.parent(div);
  canvas.center();

  // create all the compass needles
  for(row = 0; row < rows; row++) {
    for(col = 0; col < cols; col++) {

      // random angle
      var d = random(360);

      // calculate screen position of the corrent compass
      var x = map(col, 0, cols - 1, gap, width-gap);
      var y = map(row, 0, cols - 1, gap, height-gap);

      // create new compass and add it to the list
      c.push(new Compass(x, y, s, d));

    }
  }

}

function draw() {

  // clear all graphics
  clear();

  // make every compass calculate its new state
  for(var i = 0; i < c.length; i++) {
    c[i].tick();
  }

  // update states and draw the result on screen
  for(i = 0; i < c.length; i++) {
    c[i].update();
    c[i].draw();
  }

}

////////////////////////////////////////////////////////////////////////////////
// interaction
////////////////////////////////////////////////////////////////////////////////

// reset everything when a key is pressed
function keyPressed() {
  for(var i = 0; i < c.length; i++) {
    c[i].reset();
  }
}

// add mouse interaction here!
function mouseDragged() {

}

////////////////////////////////////////////////////////////////////////////////
// objects
////////////////////////////////////////////////////////////////////////////////

function Compass(x, y, size, direction) {

  this.x = x;
  this.y = y;
  this.size = size;
  this.dir = direction;

  // reset to random direction
  this.reset = function() {
    this.dir = random(360);
  };

  // draw the compass needle
  this.draw = function() {
    noFill();
    stroke(0, 50);
    ellipse(this.x, this.y, this.size);
    var x2 = this.x + cos(this.dir) * this.size / 2;
    var y2 = this.y + sin(this.dir) * this.size / 2;
    stroke(0);
    line(this.x, this.y, x2, y2);
  };

  // update value, by interpolating between our own direction and that of our neighbors
  this.tick = function() {

    // counter for number of neighbor comapsses
    var n = 0;

    // vector components
    var sumx = 0;
    var sumy = 0;

    // look at all the compasses (not very efficient)
    for(i = 0; i < c.length; i++) {

      // get distance to the other compass
      var other = c[i];
      var d = dist(this.x, this.y, other.x, other.y);

      // if the compasses touch they are neighbors - make them interact!
      if(d < this.size / 2 + other.size / 2) {

        // add vector components of the neighbor to the sum
        sumx = sumx + cos(other.dir);
        sumy = sumy + sin(other.dir);
        n++;

      }
    }

    // interpolate between current vector and the median vector of the neighbors
    // (dividing the vector sum by n to get the centroid)
    this.nextx = lerp(cos(this.dir),sumx / n, alignment);
    this.nexty = lerp(sin(this.dir),sumy / n, alignment);

  };

  this.update = function() {

    // get direction from vector components
    this.dir = atan2(this.nexty, this.nextx);

  };

}