
////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//     braitenberg vehicles 2.b                                               //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// meandering through space 2016

// @bitcraftlab 2016



////////////////////////////////////////////////////////////////////////////////
// parameters                                                                 //
////////////////////////////////////////////////////////////////////////////////

// wether or not to show the environment, the vehicles and their traces
var showVehicles = true;
var showDrawing = true;
var showEnvironment = false;
var showSensors = false;

// number of vehicles
var vehicleNum = 100;

// number of light shades from our spotlight
var shadesOfGray = 50;

// diameter of the spotlight
var dSpotLight = 250;


////////////////////////////////////////////////////////////////////////////////
// globals                                                                    //
////////////////////////////////////////////////////////////////////////////////

// list of all vehicles
var vehicles;

// pixel density of the display
var density;

// graphics
var canvas, environment, drawing;

// add a GUI
var gui;


function setup() {

  // account for retina displays
  density = pixelDensity();

  setupGraphics();
  setupVehicles();
  
  gui = createGui('braitenberg vehicles 2.a', width - 220, 20);
  gui.addGlobals('showVehicles', 'showDrawing', 'showEnvironment', 'showSensors');

}


function setupGraphics() {
  // canvas where our vehicles are drawn
  canvas = createCanvas(windowWidth, windowHeight);
  // environment sensed by the vehicles
  environment = createGraphics(width, height);
  // drawing created by the vehicles
  drawing = createGraphics(width, height);
}


function setupVehicles() {
  // create some vehicles and add them to the list
  vehicles = [];
  for(var i = 0; i < vehicleNum; i++) {
    var v = createVehicle(random(width), random(height));
    vehicles.push(v);
  }
}


function draw() {

  // move the vehicles around
  for(var i = 0; i < vehicles.length; i++) {
    vehicles[i].move();
  }

  // now draw stuff
  background(255);
  noStroke();

  // change the environment by casting some light
  environment.background(0);
  for(i = shadesOfGray; i > 0; i--) {
    var d = map(i, 0, shadesOfGray, 0, dSpotLight);
    var c = map(i, 0, shadesOfGray, 255, 0);
    environment.fill(c);
    environment.noStroke();
    environment.ellipse(mouseX / density, mouseY / density, d);
  }

  // show the environment on screen
  if(showEnvironment) {
    image(environment);
  }

  if(showDrawing) {
    image(drawing);
  }

  // draw the vehicles on screen
  if(showVehicles) {
    for(i = 0; i < vehicles.length; i++) {
      vehicles[i].show();
    }
  }

}

function createVehicle(x, y) {

  // orientation of the vehicle
  var angle = random(360);

  // speed of the vehicle
  var speed = 1;
  var maxSpeed = 5;

  // sensor measurements
  var leftLight = 0;
  var rightLight = 0;

  // sensors
  var leftEye;
  var rightEye;

  // width and height of the vehicle
  var w = 10;
  var h = 20;

  // diameter of those beautiful eyes
  var dEye = 7;

  // previous positions
  var px = 0;
  var py = 0;

  function show() {

    rectMode(CENTER);

    push();

    // move coordinate system to the center of the vehicle
    translate(x, y);

    // draw a rectangle heading forward
    stroke(0);
    fill(255, 100, 100, 200);
    rotate(angle + HALF_PI);
    rect(0, 0, w, h);

    pop();

    // draw the eyes
    if(showSensors) {
      var leftEye = sensorPosition(PI/12);
      var rightEye = sensorPosition(-PI/12);
      stroke(0);
      strokeWeight(0.5);
      fill(255, 100, 100, leftLight);
      ellipse(leftEye.x, leftEye.y, dEye, dEye);
      fill(255, 100, 100, rightLight);
      ellipse(rightEye.x, rightEye.y, dEye, dEye);
    }

  }

  function move() {
    // use your sensors
    sense();

    // keep track of our previous position
    px = x;
    py = y;

    // move forward
    x += cos(angle) * speed;
    y += sin(angle) * speed;

    // reset to previous coordinates and stop if we are off screen
    if( x < 0 || x > width || y < 0 || y > height) {
      x = px;
      y = py;
    }

    // leave a trace behind
    drawing.stroke(0);
    drawing.strokeWeight(0.25);
    drawing.line(px / density, py / density, x / density, y / density);

  }

  function sensorPosition(direction) {

    var sensorAngle = angle + direction;

    // return positon based on vehicle position
    var distance = max(w, h);

    return {
      x: x + cos(sensorAngle) * distance,
      y: y + sin(sensorAngle) * distance
    };
  }

  function sense() {

    // sensor positions at +/- 15 degrees
    leftEye = sensorPosition(-15);
    rightEye = sensorPosition(+15);

    // sensor measurements (just use the red channel)
    leftLight = red(environment.get(leftEye.x / density, leftEye.y / density));
    rightLight = red(environment.get(rightEye.x / density, rightEye.y / density));

    // speed is directly proportional to the intensity of the input
    leftSpeed = map(rightLight, 0, 255, 0, maxSpeed);
    rightSpeed = map(leftLight, 0, 255, 0, maxSpeed);

    // calculate resulting driving angle
    angle += atan2(leftSpeed - rightSpeed, w);
    speed = (leftSpeed + rightSpeed) / 2;
 
  }

  // expose functions by returning an object that encapsulates them.
  // (no need for 'this' or 'new' ...)
  return {
    draw: draw,
    show: show,
    move: move
  };

}

function keyTyped() {
  setupVehicles();
  drawing.clear();
}