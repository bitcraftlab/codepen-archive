////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//          A B E L I A N   S A N D P I L E   M O D E L                       //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// @bitcraftlab 2016

// array of sand
var a = [];

// color palette
var palette = [
  [0, 0, 0],
  [63, 63, 63],
  [127, 127, 127],
  [255, 255, 255]
];

// pixel diameter
var d = 4;

// one step at a time
var steps = 1;

// put two grains on every square
var init = 1;

// put lots of grains in the center
var initcenter = Math.pow(4, 8);

// image to display the sand
var img;

// dimensions of the sand pile
var cols, rows, n;

// create a canvas that fills the window
function setup() {
  createCanvas(windowWidth, windowHeight);
  reset();
}

// redraw and restart when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  reset();
}

// press any key to start over
function keyPressed() {
  reset();
}

// watch the sand in real time ^_^
function draw() {

  // do several steps at a time, to speed things up
  for(var i = 0; i < steps; i++) {
    step();
  }

  // draw the sand pile
  renderSand();

  // show the resulting image on screen, scaling as needed
  noSmooth();
  image(img, 0, 0, width, height);

}

// draw the sand pile using our palette
function renderSand() {
  img.loadPixels();
  for (var i = 0; i < n; i++) {
    var idx = 4 * i;
    var c = palette[a[i] % 4];
    img.pixels[idx] = c[0];
    img.pixels[idx + 1] = c[1];
    img.pixels[idx + 2] = c[2];
    img.pixels[idx + 3] = 255;
  }
  img.updatePixels();

}

// one step at a time
function step() {

  // collect indices of all squares that need to be updated
  var collect = [];
  for (var i = 0; i < n; i++) {
    if (a[i] >= 4) {
      collect.push(i);
    }
  }

  // apply the rule to the selected squares.
  // order does not matter, because: abelian.
  for(i = 0; i < collect.length; i++) {
    sandRule(collect[i]);
  }

}

// apply sand rule to square i
function sandRule(i) {

    // get x and y coordinates
    var x = i % cols;
    var y = (i - x) / cols;

    // spread sand grains evenly in all four directions
    // taking care of border cases
    if(x > 0) a[i - 1] += 1;
    if(x < cols-1) a[i + 1] += 1;
    if(y > 0) a[i - cols] += 1;
    if(y < rows-1) a[i + cols] += 1;

    // decrease the center by 4 grains
    a[i] -= 4;

}


// start over
function reset() {

  // calculate number of rows and cols we can fit on screen
  var density = pixelDensity();
  cols = int(width * density  / d);
  rows = int(height * density / d);

  // create an image for rendering
  img = createImage(cols, rows);
  n = rows * cols;

  // add inital number of grains to all the fields
  for (var i = 0; i < n; i++) {
    a[i] = init;
  }

  // add lots of grains to the center!
  var cx = int(cols / 2);
  var cy = int(rows / 2);
  a[cy * cols + cx] = initcenter;

}