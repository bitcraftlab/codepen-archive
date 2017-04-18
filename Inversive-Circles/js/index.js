///////////////////////////////////////////////////////////////////////////////
//                                                                            //
//           I N V E R S I V E     C I R C L E S                              //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// @bitcraftlab 2016

// William Gilbert's Inversive Circles Postscript Program.
// Recoded in javascript / p5.js

// Original version here:
// https://www.math.uwaterloo.ca/~wgilbert/FractalGallery/Inversive/Inversive.html


// colors (may not match the original since CMYK and RGB have different gamuts)
var cWhite = cmyk(0, 0, 0);
var cBlack = cmyk(0, 0, 0, 1);
var cRed = cmyk(0, 1, 1);
var cYellow = cmyk(0, 0, 1);
var cBlue = cmyk(1, 1, 0);
var cCream = cmyk(0.09, 0.26, 0.49);
var cLightCream = cmyk(0, 0.18, 0.44);
var cLightBrown = cmyk(0.24, 0.69, 0.86);
var cDarkBrown = cmyk(0.75, 0.92, 0.99);
var cBrownGreen = cmyk(0.78, 0.88, 0.97);
var cDarkRed = cmyk(0.50, 1, 0.99);

// color palette
var colArray = [
  cDarkRed,
  cLightCream,
  cLightBrown,
  cDarkBrown,
  cCream,
  cBrownGreen,
  cCream,
  cLightBrown,
  cLightCream,
  cCream
];

// depth of iterations > 2
var maxDepth = 9;
// underflow
var delta = 0.00001;

// outside circle
var c0 = { x:250, y:250, r:200 };
// inside circle 1
var c1 = { x:300, y:190, r:121.898 };
// inside circle 2
var c2 = { x:219.85, y:370.6, r:75.6884 };
// inside circle 3
var c3 = { x:121.358, y:262.1941, r:70.7811 };

// crop border
var xcrop = 48;
var ycrop = 48;

// div and canvas elements
var div;
var canvas;

//recursion depth
var depth = 0;

////////////////////////////////////////////////////////////////////////////////

function setup() {

  colorMode(RGB, 1);

  // create a div
  div = createDiv('');
  div.size(windowWidth, windowHeight);

  // create a canvas that is centered inside the div
  canvas = createCanvas(500 - 2 * xcrop, 500 - 2 * ycrop);
  canvas.parent(div);
  canvas.center();

  // flip the y axis and account for cropping
  flipY();
  translate(-xcrop, -ycrop);

  // outside circle
  strokeWeight(2);
  fillCircle(c0);

  down();

  // inside circles
  strokeWeight(1.5);
  fillCircle(c1);
  fillCircle(c2);
  fillCircle(c3);

  // circle fractal
  strokeWeight(0.5);
  invertThreeCircles(c0, c1, c2, c3);

}

function windowResized() {
  div.size(windowWidth, windowHeight);
  canvas.center();
}

////////////////////////////////////////////////////////////////////////////////

// down the rabbit hole
function down() {
  depth++;
}

// escape the rabbit hole
function up() {
  depth--;
}

// circle filled with color according to depth
function fillCircle(c) {
  fill(depth >= colArray.length ? cWhite : colArray[depth]);
  ellipse(c.x, c.y, 2 * c.r, 2 * c.r);
}

// invert point p in circle c
function invertPoint(c, p) {
  var d = dist2(p, c);
  var inv = (c.r * c.r) / d.d;
  return {
    x : c.x + d.x * inv,
    y : c.y + d.y * inv
  };
}

// invert circle c1 in circle c0
function invertCircle(c0, c1) {

  var d = dist2(c0, c1);
  var r = c1.r / sqrt(d.d);

  // points a and b
  var a = {
    x: c1.x + d.x * r,
    y: c1.y + d.y * r
  };
  var b = {
    x: c1.x - d.x * r,
    y: c1.y - d.y * r
  };

  // invert points a and b
  var ai = invertPoint(c0, a);
  var bi = invertPoint(c0, b);
  var di = dist2(ai, bi).d;

  var c = {
    x: (ai.x + bi.x) / 2,
    y: (ai.y + bi.y) / 2,
    r: sqrt(di) / 2
  };

  // draw the inverted circle
  fillCircle(c);

  return c;
}

// recursively invert each circle in 3 others. Outside circle is c0
function invertThreeCircles(c0, c1, c2, c3) {
  down();
  if(depth < maxDepth) {
    invertThreeCircles(c1, invertCircle(c1, c0), invertCircle(c1, c2), invertCircle(c1, c3));
    invertThreeCircles(c2, invertCircle(c2, c0), invertCircle(c2, c1), invertCircle(c2, c3));
    invertThreeCircles(c3, invertCircle(c3, c0), invertCircle(c3, c1), invertCircle(c3, c2));
  }
  up();
}

// calculate distances between two points
function dist2(p1, p2) {
  var dx = p1.x - p2.x;
  var dy = p1.y - p2.y;
  var dd = (dx * dx + dy * dy);
  if(dd < delta) dd = 1; // underflow
  return {
    x: dx,
    y: dy,
    d: dd
  };
}

////////////////////////////////////////////////////////////////////////////////

// cmky to rgb conversion
function cmyk(c, m, y, k) {
  ik = 1 - (k || 0);
  return [
    (1 - c) * ik,
    (1 - m) * ik,
    (1 - y) * ik
  ];
}

// flip the y axis, to match the original
function flipY() {
  translate(0, height/2);
  scale(1, -1);
  translate(0, -height/2);
}