function setup() {
  createCanvas(500, 500);
  background(200);
  noStroke();
}

function draw() {
  background(220);
  rollCount++;
  if (rollCount >= rollDuration) {
    rollCount = 0;
  }
  let rollDisplay = map(rollCount, 0, 360, 0, 500);
  fill(200);
  rect(0, 490, 500, 10);
  fill(0);
  ellipse(rollDisplay, 495, 5);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].start == rollCount) {
      lines[i].activateDisplay();
    }
  }
}

function mousePressed() {
    // fill(random(255),random(255),random(255));
    let l = new Line(rollCount);
    currentLine = l;
}

function mouseDragged() {
    ellipse(mouseX, mouseY, 10);
    // console.log(frameCount);
    currentLine.addVector(mouseX, mouseY);
}

function mouseReleased() {
    // console.log("Released!!!");
    currentLine = null;
}


function keyPressed() {
    if (key == 'p' || key == 'P') {
        console.log(lines.length);
    }
}
