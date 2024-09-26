let angle = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(map(mouseX, 0, width, 180, 360), 100, 10);

    translate(width / 2, height / 2);
    let size = map(mouseY, 0, height, 20, 100);
    let speed = map(mouseX, 0, width, 0.01, 0.1);

    rotate(angle);
    fill(200, 80, 100);  // Set to a single color
    ellipse(cos(angle) * 200, sin(angle) * 200, size, size);

    rotate(angle);
    fill(150, 80, 100);  // Set to a single color
    ellipse(cos(angle) * 200, sin(angle) * 200, size, size);

    rotate(angle);
    fill(250, 80, 100);  // Set to a single color
    ellipse(cos(angle) * 200, sin(angle) * 200, size, size);

    angle += speed;

    if (mouseIsPressed) {
        rect(mouseX, mouseY, 100, 100);
    }
}
