let looping = true;
let socket, cnvs, ctx, canvasDOM;
let fileName = "./frames/sketch";
let maxFrames = 20;
let rollDuration = 360;
let rollCount = 0;
let gl;
let time;
let shaderProgram;
let vertices;

function setup() {
    socket = io.connect('http://localhost:8080');
    pixelDensity(1);
    cnvs = createCanvas(windowWidth, windowHeight, WEBGL);
    ctx = cnvs.drawingContext;
    canvasDOM = document.getElementById('defaultCanvas0');

    gl = canvas.getContext('webgl');
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    frameRate(30);
    background(0);
    fill(255, 50);
    noStroke();

    // Create an empty buffer object to store the vertex buffer
    var vertex_buffer = gl.createBuffer();

    //Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /*=========================Shaders========================*/

    // vertex shader source code
    var vertCode = `
    attribute vec3 coordinates;
    varying vec2 myposition;
    varying vec2 center;
    void main(void) {
        gl_Position = vec4(coordinates, 1.0);
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        gl_PointSize = 150.0;
    }`;

    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);

    // Compile the vertex shader
    gl.compileShader(vertShader);

    // fragment shader source code
    var fragCode = `
    precision mediump float;
    varying vec2 myposition;
    varying vec2 center;
    uniform float time;
    float rand(vec2 co){
        return fract(sin(dot(co.xy * time,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
        float dist_squared = dot(pos, pos);
        float alpha;

        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.0095, 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        // gl_FragColor = vec4(1.0, 1.0 - dist_squared * 1.0, 0.0, 0.35 - dist_squared - (rando * 0.2) + alpha);
        gl_FragColor = vec4(1.0, 1.0 - dist_squared * 1.0, 0.0, (0.35 - dist_squared - (rando * 0.2)) * alpha);
        // gl_FragColor = vec4(d * 0.001, uv.x, 0.0, 0.25);
    }`;

    // vec2 uv = gl_FragCoord.xy / vec2(1600, 1600);

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);

    // Compile the fragmentt shader
    gl.compileShader(fragShader);

    // Create a shader program object to store
    // the combined shader program
    shaderProgram = gl.createProgram();

    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);

    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);

    // Link both programs
    gl.linkProgram(shaderProgram);

    // Use the combined shader program object
    gl.useProgram(shaderProgram);
    time = gl.getUniformLocation(shaderProgram, "time");


    /*======== Associating shaders to buffer objects ========*/

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    /*============= Drawing the primitive ===============*/

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 0.01);

    // gl.clearDepth(0.15);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Draw the triangle
    // gl.drawArrays(gl.POINTS, 0, 0);
    if (!looping) {
        noLoop();
    }
}

function draw() {
    // background(220);

    gl.uniform1f(time, frameCount);
    vertices = [];
    vertices.push(0, 0, 0.0);
    vertices.push(1, 0, 0.0);
    vertices.push(0, 1, 0.0);
    rollCount += 2;
    if (rollCount >= rollDuration) {
        rollCount = 0;
    }
    let rollDisplay = map(rollCount, 0, 360, 0, width);
    // fill(200);
    // rect(0, height - 10, width, 10);
    // fill(0);
    vertices.push(rollDisplay * 0.001, 0, 0);
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].start == rollCount) {
            lines[i].activateDisplay();
        }
    }
    for (let i = 0; i < drawnLines.length; i++) {
        drawnLines[i].display();
    }

    // Create an empty buffer object to store the vertex buffer
    var vertex_buffer = gl.createBuffer();

    //Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /*======== Associating shaders to buffer objects ========*/

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    /*============= Drawing the primitive ===============*/

    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, vertices.length / 3);



    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
}

function mousePressed() {
    // fill(random(255),random(255),random(255));
    let l = new Line(rollCount);
    currentLine = l;
}

function mouseDragged() {
    // ellipse(mouseX, mouseY, 10);
    // vertices.push(0.5, 0, 0);
    // currentLine.addVector(mouseX, mouseY);
    let mapX = map(mouseX, 0, width, -1, 1);
    let mapY = map(mouseY, 0, height, 1, -1);
    currentLine.addVector(mapX, mapY);
}

function mouseReleased() {
    currentLine = null;
}

function keyPressed() {
    if (keyCode === 32) {
        if (looping) {
            noLoop();
            looping = false;
        } else {
            loop();
            looping = true;
        }
    }
    if (key == 'p' || key == 'P') {
        frameExport();
    }
    if (key == 'r' || key == 'R') {
        window.location.reload();
    }
    if (key == 'm' || key == 'M') {
        redraw();
    }
}