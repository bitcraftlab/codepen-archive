////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//     turtle drawing                                                         //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// Meandering Code 2016

// HOMEWORK:

// Create your own string rewriting rule it to control the turtle.
// Use the function yourCommands() in the l-system section of the code.

var step = 0;
var iteration = 5;
var commands;
var turtle;

////////////////////////////////////////////////////////////////////////////////
// main                                                                       //
////////////////////////////////////////////////////////////////////////////////

function setup() {

  // use degrees instead of radians
  angleMode(DEGREES);
  
  // fill the window
  createCanvas(windowWidth, windowHeight);
  
  // create the turtle that does the drawing
  turtle = createTurtle();

  // create the command string for drawing a koch curve ...
  commands = kochCommands(iteration);
  
  // ... or call your own function here
  // commands = yourCommands(iteration);

}

function draw() {
  if (step < commands.length) {
    // execute current step
    turtle.obey(commands[step]);
    // increase the step by 1
    step = step + 1;
  } else {
    // reset turtle and step
    turte.reset();
    step = 0;
  }
}


////////////////////////////////////////////////////////////////////////////////
//    interaction                                                             //
////////////////////////////////////////////////////////////////////////////////

function windowResized() {
  // resize the canvas and clear it
  resizeCanvas(windowWidth, windowHeight);
  clear();
  // reset turtle and step
  turtle.reset();
  step = 0;
}


////////////////////////////////////////////////////////////////////////////////
//    turtle                                                                  //
////////////////////////////////////////////////////////////////////////////////

function createTurtle() {
  
  // create turtle object
  var turtle = {

    // screen coordinates of the turtle
    x: 0,
    y: 0,

    // inital direction
    heading: 0,

    // turn angle in degrees
    turnangle: 60,

    // pixels the turtle moves forward in one step
    stepsize: 5,

    goto: function(x, y) {
      this.x = x;
      this.y = y;
    },

    forward: function(distance) {
      // current coordinates
      var px = this.x;
      var py = this.y;
      // calculate new coordinates
      this.x = this.x + distance * cos(this.heading);
      this.y = this.y + distance * sin(this.heading);
      // draw a line between pervious and new coordinates
      line(px, py, this.x, this.y);
    },

    // turn to the right
    turn: function(angle) {
      // update heading of the turtle
      this.heading = this.heading + angle;
    },

    // pass command(s) to the turtle
    obey: function(commands) {

      // iterate over all the commands
      for (var i = 0; i < commands.length; i++) {

        // get the current command
        var cmd = commands[i];

        // execute the command
        switch (cmd) {

          case 'f': // go one step forward
            this.forward(this.stepsize);
            break;

          case '<': // turn to the left
            this.turn(-this.turnangle);
            break;

          case '>': // turn to the right
            this.turn(+this.turnangle);
            break;

        }
      }
    },

    // reset turtle position and direction
    reset: function() {
      this.goto(20, height - 20);
      this.heading = -PI / 4;
    }

  };

  // initialization
  turtle.reset();

  // return the object
  return turtle;

}

////////////////////////////////////////////////////////////////////////////////
//    l-system                                                                //
////////////////////////////////////////////////////////////////////////////////

// Using String rewriting to generate a fractal command sequence for our turtle
// See also: https://en.wikipedia.org/wiki/L-system

// CREATE YOUR OWN FUNCTION HERE:
function yourCommands(iter) {
  var seq = 'f';
  return seq;
}

// l-system for the koch curve
function kochCommands(iter) {

  // the axiom (initial sequence)
  var axiom = 'f';
  // the replacement sequence
  var rule = 'f<f>>f<f';
  // start out with the axiom
  var seq = axiom;

  for (i = 0; i < iter; i++) {
    // start out with an empty sequence
    var newseq = '';
    // iterate over all characters of the string
    for (j = 0; j < seq.length; j++) {
      // get a command from the sequence
      var cmd = seq[j];
      // rewriting rule
      if (cmd === 'f') {
        // add rule expansion to the new sequence
        newseq = newseq + rule;
      } else {
        // copy the original character to the new sequence
        newseq = newseq + cmd;
      }
    }
    seq = newseq;
  }

  return seq;
}