// Meandering Through Space 2016 

// lecture 4 - Introduction to objects and Arrays

// Things to do

// 1. extend the circles so each has a different radius
// 2. extend the circles so they can draw them selves

// a circle as an object with three attributes: x, y, and color
var circle1 = {
  x: 100,
  y: 220,
  color: "#99aa33"
};

// another circle with different values for those three attributes
var circle2 =  {
  x: 200,
  y: 80,
  color: "#669966"
};

// and yet another circle
var circle3 =  {
  x: 300,
  y: 220,
  color: "#339999"
};

// let's create an array containing these three objects
var circles = [circle1, circle2, circle3];

// create the canvas
function setup() {
  createCanvas(windowWidth, windowHeight);
}


function draw() {
  background(30);
  for(var i = 0; i < circles.length; i++) {
    // get one of the circles using 'i' as an index into the array
    var c = circles[i];
    // use the attributes to draw the circle
    fill(c.color);
    ellipse(c.x, c.y, 100, 100);
  }
}

// dynamically adjust the canvas to the window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}