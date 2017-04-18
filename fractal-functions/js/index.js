
////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//     fractal functions                                                      //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// meandering through space 2016

// @bitcraftlab 2016

// Example for constructing (fractal) parametric functions programatically.
// The fractal functions are constructed by hilbert(iter) and snake(iter).

// The resulting functions take a parameter t between 0 and 1
// and return points tracing out a fractal curve


////////////////////////////////////////////////////////////////////////////////
// parameters                                                                 //
////////////////////////////////////////////////////////////////////////////////

var maxiter = 6;
var iteration = 2;
var gap = 20;
var stepsize = 1;
var outline = 3;

var points = true;
var region = true;

var linecolor = '#000000';
var backcolor = '#2266bb';
var fillcolor = '#ffffff';

var curves = ['hilbert', 'snake'];

////////////////////////////////////////////////////////////////////////////////
// globals                                                                    //
////////////////////////////////////////////////////////////////////////////////

var zoom;
var canvas;
var div;
var gui;

////////////////////////////////////////////////////////////////////////////////
// main                                                                       //
////////////////////////////////////////////////////////////////////////////////

function setup() {

  // diameter of the canvas
  var d = pow(2, maxiter + 3) + 2 * gap;

  // create div to fill the window
  div = createDiv();
  div.size(windowWidth, windowHeight);
  div.style('background', 'black');

  // fixed size canvas centered inside the div
  canvas = createCanvas(d, d);
  canvas.parent(div);
  canvas.center();

  // create a gui
  sliderRange(0, maxiter, 1);
  gui = createGui('fractal functions');
  gui.addGlobals('curves', 'iteration', 'outline', 'points', 'region', 'linecolor', 'backcolor', 'color3', 'fillcolor');

  // drawing style
  strokeCap(PROJECT);

  // only re-draw when the gui is changed
  noLoop();

}


function draw() {

  // call the selected curve function
  var tile = window[curves](iteration);

  // scale from unit-interval to target square
  beginScale(gap, gap, width - gap, height - gap);

  // some background
  background(backcolor);
  var darker = lerpColor(color(backcolor), color(0), 0.2);
  fill(darker);
  noStroke();
  ellipse(0.5, 0.5, 1, 1);

  // do we need to draw the outline?
  if(outline === 0) {
    noStroke();
  } else {
    stroke(linecolor);
  }
  
  // do we need to fill the shape?
  if (region) {
    fill(fillcolor);
    drawCurve(tile, shape, true);
  } else {
    noFill();
    drawCurve(tile, lines, false);
  }

  // draw points ontop of the curve
  if (points) {
    stroke(linecolor);
    drawCurve(tile, dots);
  }

  endScale();

}

////////////////////////////////////////////////////////////////////////////////
// interaction                                                                //
////////////////////////////////////////////////////////////////////////////////

function windowResized() {
  div.size(windowWidth, windowHeight);
  canvas.center();
}

////////////////////////////////////////////////////////////////////////////////
// fractal functions                                                          //
////////////////////////////////////////////////////////////////////////////////

// Create a hilbert curve from four piecewise functions
function hilbert(iter) {

  // elementary curve
  // crv = shrink(range([ln(0, 0, 0, 1), ln(0, 1, 1, 1), ln(1, 1, 1, 0), ln(1, 0, 1, 0) ]), 0.5, 0.5);
  var crv = shrink(range([pt(0, 0), pt(0, 1), pt(1, 1), pt(1, 0)]), 1 / 2, 1 / 2);

  // create fractal tile iteratively from four parts
  var fn0, fn1, fn2, fn3;
  for (var i = 0; i < iter; i++) {
    fn0 = shrink(right(crv), 0, 0);
    fn1 = shrink(crv, 0, 1);
    fn2 = shrink(crv, 1, 1);
    fn3 = shrink(left(flip(crv)), 1, 0);
    crv = range([fn0, fn1, fn2, fn3]);
  }

  // attach size info to the curve
  crv.size = 2;
  
  // attach function for closing the curve
  crv.close = function(drawfn) {
    drawfn(1, 0);
    drawfn(0, 0);
  };

  return crv;
}


// Create a snake curve from nine piecewise functions
function snake(iter) {

  // elementary s-shaped curve
  var crv = shrink(range([
    pt(0, 0), pt(1, 0), pt(2, 0),
    pt(2, 1), pt(1, 1), pt(0, 1),
    pt(0, 2), pt(1, 2), pt(2, 2)
  ]), 1 / 2, 1 / 2, 1 / 3);

  // create fractal tile iteratively from nine parts
  var fn0, fn1, fn2, fn3, fn4, fn5, fn6, fn7, fn8, fn9;
  for (var i = 0; i < iter; i++) {
    fn0 = shrink(crv, 0, 0);
    fn1 = shrink(flop(crv), 1, 0);
    fn2 = shrink(crv, 2, 0);
    fn3 = shrink(flip(crv), 2, 1);
    fn4 = shrink(flip(flop(crv)), 1, 1);
    fn5 = shrink(flip(crv), 0, 1);
    fn6 = shrink(crv, 0, 2);
    fn7 = shrink(flop(crv), 1, 2);
    fn8 = shrink(crv, 2, 2);
    crv = shrink(range([fn0, fn1, fn2, fn3, fn4, fn5, fn6, fn7, fn8]), 0, 0, 2 / 3);
  }

  // attach size info to the curve
  crv.size = 3;
  
  // attach function for closing the curve
  crv.close = function(drawfn) {
    drawfn(1, 1);
    drawfn(1, 0);
    drawfn(0, 0);
  };
  
  return crv;

}

////////////////////////////////////////////////////////////////////////////////
// my functions                                                               //
////////////////////////////////////////////////////////////////////////////////

// rescale the unit square to the target square
function beginScale(xmin, ymin, xmax, ymax) {

  // calculate maginification factor
  zoom = (xmax - xmin);
  
  push();
  
  // go to bottom left corner
  translate(xmin, ymax);
  
  // rescale unit interval to target interval with y-axis pointing upwards
  scale(zoom, -zoom);
  
  // adjust for absolute stroke weight
  strokeWeight(outline / zoom);

}


function endScale() {
  pop();
}


// draw a curve function using a drawing function
// if close is true, additional points are added, so the resulting shape looks nicer.
function drawCurve(curvefn, drawfn, close) {

  // get dimensions of the curve
  var size = curvefn.size;
  
  // number of sampling points
  var n = pow(size * size, iteration + 1) + 1;

  // previous point coordinates
  var ppx;
  var ppy;

  // start drawing
  drawfn.begin();

  for (var i = 0; i <= n; i++) {
    // get t-value between 0 and 1
    var t = i / n;
    // get the point from the curve function
    var p = curvefn(t);
    if(i > 0) {
      // pass the current and previous coordinates to the draw function
      drawfn(ppx, ppy, p.x, p.y);
    }
    // update previous coordinates
    ppx = p.x;
    ppy = p.y;
  }

  // close the curve so we can fill the region
  if(close) {
    curvefn.close(drawfn);
  }
  
  // stop drawing
  drawfn.end();

}

////////////////////////////////////////////////////////////////////////////////
// drawing functions                                                          //
////////////////////////////////////////////////////////////////////////////////

function dots(x1, y1) {
  ellipse(x1, y1, 2 * outline/zoom, 2 * outline/zoom);
}
dots.begin = function() {
  noStroke();
  fill(linecolor);
};
dots.end = function() {};

////////////////////////////////////////////////////////////////////////////////

function shape(x1, y1) {
  vertex(x1, y1);
}
shape.begin = function() {
  beginShape();
};
shape.end = function() {
  endShape(CLOSE);
};

////////////////////////////////////////////////////////////////////////////////

function lines(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
}
lines.begin = function() {};
lines.end = function() {};

////////////////////////////////////////////////////////////////////////////////
// elementary functions                                                       //
////////////////////////////////////////////////////////////////////////////////

// line function factory
function ln(x1, y1, x2, y2) {
  return function(t) {
    return {
      x: lerp(x1, x2, t),
      y: lerp(y1, y2, t)
    };
  };
}

// point function factory
function pt(px, py) {
  return function(t) {
    return {
      x: px,
      y: py
    };
  };
}

////////////////////////////////////////////////////////////////////////////////
// function combinators                                                       //
////////////////////////////////////////////////////////////////////////////////

// range function factory
// takes a list of function and combines them into a piecewise function
function range(fns) {
  return function(t) {
    var n = fns.length;
    var idx = floor(t * n);
    idx = constrain(idx, 0, n - 1);
    var t2 = (t * n) - idx;
    return fns[idx](t2);
  };
}

////////////////////////////////////////////////////////////////////////////////
// function transformers                                                      //
////////////////////////////////////////////////////////////////////////////////

// scale function factory
function shrink(fn, tx, ty, factor) {
  factor = factor || 1 / 2;
  return function(t) {
    var p = fn(t);
    return {
      x: (p.x + tx) * factor,
      y: (p.y + ty) * factor
    };
  };
}

// rotate right function factory
function right(fn) {
  return function(t) {
    var p = fn(t);
    return {
      x: p.y,
      y: p.x
    };
  };
}

// rotate left function factory
function left(fn) {
  return function(t) {
    var p = fn(t);
    return {
      x: 1 - p.y,
      y: p.x
    };
  };
}

// flip function factory
function flip(fn) {
  return function(t) {
    var p = fn(t);
    return {
      x: 1 - p.x,
      y: p.y
    };
  };
}

// flop function factory
function flop(fn) {
  return function(t) {
    var p = fn(t);
    return {
      x: p.x,
      y: 1 - p.y
    };
  };
}