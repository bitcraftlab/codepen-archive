var commands = '';
var turtle;
var step = 0;
var iter = 5;
var iterMax = 7;
var piter = iter;

var gui;

function commandSetup() {
  
  var seq = 'F';
  var rule = 'F[-F][+F]';

  for (i = 0; i < iter; i++) {
    var newseq = '';
    for (j = 0; j < seq.length; j++) {
      if (seq[j] === 'F') {
        newseq += rule;
      } else {
        newseq += seq[j];
      }
    }
    seq = newseq;
  }
  commands = seq;
}

function setup() {
  
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);

  stroke(255, 30);
  commandSetup();
  
  turtle = {

    turnangle: 30,
    step: 30,
    heading: 180,

    goto: function(x, y) {
      translate(x, y);
      rotate(this.heading);
      ellipse(0, 0, 4);
    },

    obey: function(commands) {
      for (var i = 0; i < commands.length; i++) {
        var cmd = commands[i];
       
        switch (cmd) {

          case 'F':
            line(0, 0, 0, this.step);
            translate(0, this.step);
            break;

          case '+':
            rotate(this.turnangle);
            break;

          case '-':
            rotate(-this.turnangle);
            break;

          case '[':
            push();
            break;

          case ']':
            pop();
            break;
        }
      }
    }
  }

  gui = createGui('L-System', width - 220, 20);
  gui.addGlobals('iter');

}

function draw() {
  if(iter != piter) {
    commandSetup();
  }
  background(100);
  turtle.goto(width/2, height * 5/6);
  turtle.obey(commands);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}