// sound spiral 

var mic;
var x, y, px, py;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  mic.start();
  background(255);
  stroke(0);
}

function draw() {
  var vol = mic.getLevel();
  var angle = frameCount * TWO_PI / 600;
  dmin = (angle) * 5;
  dmax = (10 + angle) * 5;
  var d = map(vol, 0, 1, dmin, dmax);
  px = x;
  py = y;
  x = width/2 + cos(angle) * d;
  y = height/2 + sin(angle) * d;
  line(px, py, x, y);
}