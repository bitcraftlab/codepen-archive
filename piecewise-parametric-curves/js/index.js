// Meandering through Space 2016

// picewise parametric curves

// @bitcraftlab 2016

// interaction state
var dragging = null;
var hovering = null;

// radii
var rclick = 10;
var rpoint = 3;
var rtrail = 8;

// list of points
var p = [
   {x:10, y:10},
   {x:130, y:10},
   {x:130, y:170},
   {x:250, y:170},
   {x:390, y:170},
   {x:390, y:390},
   {x:250, y:390},
   {x:130, y:390},
   {x:130, y:230},
   {x:250, y:230}
 ];

// curve function
var curvefn;


function setup() {

  // black background div
  div = createDiv();
  div.style('background', '#000');
  div.size(windowWidth, windowHeight);

  // canvas inside the div
  canvas = createCanvas(400, 400);
  canvas.parent(div);
  canvas.center();

  // generate a piecewise parametric curve
  curvefn = createPiecewiseCurve(
    createBezierCurve(p[0], p[1], p[2], p[3]),
    createLine(p[3], p[4]),
    createLine(p[4], p[5]),
    createLine(p[5], p[6]),
    createBezierCurve(p[6], p[7], p[8], p[9])
  );

}


// adjust div size
function windowResized() {
  div.size(windowWidth, windowHeight);
  canvas.center();
}

function draw() {

  background(255);

  // show control points
  drawControlPoints();
  connectControlPoints();

  var steps = 500;

  // show the curve + animated trail
  drawCurve(curvefn, steps);
  drawTrail(curvefn, steps);

  // interaction
  drawCursor();

}

////////////////////////////////////////////////////////////////////////////////
// drawing functions

function drawTrail(curvefn, steps) {
  fill(0, 50);
  noStroke();
  for(i = 0; i < 20; i++) {
    var t = ((frameCount + 2*i)% (steps + 1)) / steps;
    var pt = curvefn(t);
    ellipse(pt.x, pt.y, rtrail, rtrail);
  }
}

function drawControlPoints() {
  for(var i = 0; i < p.length; i++) {
    var pt = p[i];
    fill(0);
    ellipse(pt.x, pt.y, rpoint, rpoint);
  }
}

function connectControlPoints() {
  noFill();
  stroke(0, 50);
  beginShape();
  for(var i = 0; i < p.length; i++) {
    var pt = p[i];
    vertex(pt.x, pt.y);
  }
  endShape();
}

// draw a parametric function on screen
function drawCurve(fn, steps) {
  noFill();
  stroke(0, 150);
  beginShape();
  for(var i = 0; i <= steps; i++) {
    // normalize i to the range (0, 1)
    var t = norm(i, 0, steps);
    // compute function
    var pt = fn(t);
    vertex(pt.x, pt.y);
  }
  endShape();
}

function drawCursor() {
  if(dragging) {
    fill(255, 0, 0, 100);
    ellipse(dragging.x, dragging.y, rclick, rclick);
  } else if(hovering) {
    fill(0, 100);
    ellipse(hovering.x, hovering.y, rclick, rclick);
  }
}


////////////////////////////////////////////////////////////////////////////////
// curve factories

// factory for bezier curve functions
function createBezierCurve(p1, p2, p3, p4) {
  return function(t) {
    return {
      x: bezierPoint(p1.x, p2.x, p3.x, p4.x, t),
      y: bezierPoint(p1.y, p2.y, p3.y, p4.y, t)
    };
  };
}

// factory for straight line functions
function createLine(p1, p2) {
  return function(t) {
    return {
      x: lerp(p1.x, p2.x, t),
      y: lerp(p1.y, p2.y, t)
    };
  };
}

// factory for creating circular arcs
function createArc(p1, p2, p3) {
  return function(t) {
    return {
      x: lerp(p1.x, p2.x, t),
      y: lerp(p1.y, p2.y, t)
    };
  };
}

// factory for piecewise curve functions
function createPiecewiseCurve() {

  var fns = arguments;

  return function(t) {
    var n = fns.length;
    // increase the interval from (0, 1) to (0, n)
    var tscale = t * n;
    // pick the i'th function for the interval (i, i + 1)
    var i = constrain(floor(tscale), 0, n - 1);
    var fn = fns[i];
    // re-normalize parameter to the range (0, 1)
    var u = tscale - i;
    // apply the selected function
    return fn(u);
  };

}

////////////////////////////////////////////////////////////////////////////////
// interaction

function mouseMoved() {
  startHover();
}

function mousePressed() {
  startDrag();
}

function mouseDragged() {
  if(!dragging) {
    startDrag();
  } else {
    dragging.x = mouseX;
    dragging.y = mouseY;
  }
}

function mouseReleased() {
  dragging = null;
  cursor(ARROW);
}

function startDrag() {
  for(var i = 0; i < p.length; i++) {
    var pt = p[i];
    if(dist(pt.x, pt.y, mouseX, mouseY) < rclick) {
      dragging = pt;
      cursor(HAND);
    }
  }
}

function startHover() {
  hovering = null;
  for(var i = 0; i < p.length; i++) {
    var pt = p[i];
    if(dist(pt.x, pt.y, mouseX, mouseY) < rclick) {
      hovering = pt;
    }
  }
}