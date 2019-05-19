let currentLine = null;
let lines = [];
let drawnLines = [];

let Line = function(r) {
    this.start = r;
    lines.push(this);
    this.dots = [];
};

Line.prototype.addVector = function(x, y) {
    this.dots.push([x, y]);
};

Line.prototype.activateDisplay = function() {
    drawnLines.push(this);
    this.displayIndex = 0;
    // for (let j = 0; j < this.dots.length; j++) {
    //     ellipse(this.dots[j][0], this.dots[j][1], 2);
    // }
};

Line.prototype.display = function(x, y) {
    if (this.displayIndex <= this.dots.length) {
        for (let i = 0; i < this.displayIndex; i++) {
            // ellipse(this.dots[i][0], this.dots[i][1], 15);
            // vertices.push(this.dots[i][0] + Math.sin(frameCount) * 0.001, this.dots[i][1], 0.0);
            let x = this.dots[i][0] + Math.sin(frameCount + i) * 0.001;
            let y = this.dots[i][1] + Math.sin(frameCount - 1 + i) * 0.001;
            vertices.push(x, y, 0.0);
        }
    } else {
        // let diff = this.dots.length * 2 - this.displayIndex;
        // for (let i = this.dots.length - 1; i > diff; i--) {
        //     ellipse(this.dots[i][0], this.dots[i][1], 5);
        // }
        for (let i = this.displayIndex - (this.dots.length - 1); i < this.dots.length - 1; i++) {
            // console.log("III  : " + i);
            // ellipse(this.dots[i][0], this.dots[i][1], 15);
            let x = this.dots[i][0] + Math.sin(frameCount + i) * 0.001;
            let y = this.dots[i][1] + Math.sin(frameCount - 1 + i) * 0.001;
            vertices.push(x, y, 0.0);
        }
    }
    this.displayIndex++;
    if (this.displayIndex >= (this.dots.length - 1) * 2) {
        for (let i = 0; i < drawnLines.length; i++) {
            if (drawnLines[i] == this) {
                drawnLines.splice(i, 1);
            }
        }
    }
};