/**
 * FROLAGA
 * Aran Scherzer
 * 
 * A game of catching flies with your tractor beam
 * 
 * Instructions:
 * - Move your space ship with your mouse
 * - Click to launch the beam
 * - Catch ships
 * 
 * Made with p5
 * https://p5js.org/
 * 
 * New feature: Changing the frog to a space ship 
 */

"use strict";

// Our ship
const ship = {
    // The ship's body has a position and size
    body: {
        x: 320,
        y: 520,
        size: 150
    },
    // The ship's beam has a position, size, speed, and state
    beam: {
        x: undefined,
        y: 480,
        size: 20,
        speed: 20,
        // Determines how the beam moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    }
};

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speed: 3
};


let stateFunction = game;

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(640, 480);

    // Give the fly its first random position
    resetFly();
}

function draw() {
    stateFunction();
}


// function title() {
//     background(255);

//     push();
//     textSize(80);
//     textFont(BOLD);
//     fill(0);
//     text("FROLAGA", 150, 240);
//     pop();

//     mousePressed();
// }

// function mousePressed() {
//     stateFunction == game();
// }

function game() {
    background("black");
    moveFly();
    drawFly();
    moveShip();
    moveBeam();
    drawShip();
    checkBeamOverlap();
}


/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveFly() {
    // Move the fly
    fly.x += fly.speed;
    // Handle the fly going off the canvas
    if (fly.x > width) {
        resetFly();
    }
}

/**
 * Draws the fly as a black circle
 */
function drawFly() {
    push();
    noStroke();
    fill("green");
    ellipse(fly.x, fly.y, fly.size);
    pop();
}

/**
 * Resets the fly to the left with a random y
 */
function resetFly() {
    fly.x = 0;
    fly.y = random(0, 300);
}

/**
 * Moves the ship to the mouse position on x
 */
function moveShip() {
    ship.body.x = mouseX;
}

/**
 * Handles moving the beam based on its state
 */
function moveBeam() {
    // Beam matches the ship's x
    ship.beam.x = ship.body.x;
    // If the beam is idle, it doesn't do anything
    if (ship.beam.state === "idle") {
        // Do nothing
    }
    // If the beam is outbound, it moves up
    else if (ship.beam.state === "outbound") {
        ship.beam.y += -ship.beam.speed;
        // The beam bounces back if it hits the top
        if (ship.beam.y <= 0) {
            ship.beam.state = "inbound";
        }
    }
    // If the beam is inbound, it moves down
    else if (ship.beam.state === "inbound") {
        ship.beam.y += ship.beam.speed;
        // The beam stops if it hits the bottom
        if (ship.beam.y >= height) {
            ship.beam.state = "idle";
        }
    }
}

/**
 * Displays the beam (tip and line connection) and the ship (body)
 */
function drawShip() {
    // Draw the beam tip
    push();
    fill("#55fff0");
    noStroke();
    ellipse(ship.beam.x, ship.beam.y, ship.beam.size);
    pop();

    // Draw the rest of the beam
    push();
    stroke("#55fff0");
    strokeWeight(ship.beam.size);
    line(ship.beam.x, ship.beam.y, ship.body.x, ship.body.y);
    pop();

    // Draw the ship's body
    push();
    fill("#a73821");
    noStroke();
    ellipse(ship.body.x, ship.body.y, ship.body.size);
    pop();

    push();
    fill("white");
    noStroke();
    ellipse(ship.body.x - 30, ship.body.y + 10, ship.body.size);
    ellipse(ship.body.x + 30, ship.body.y + 10, ship.body.size);
    pop();

}
// counter = 0;

/**
 * Handles the beam overlapping the fly
 */
function checkBeamOverlap() {
    // Get distance from beam to fly
    const d = dist(ship.beam.x, ship.beam.y, fly.x, fly.y);
    // Check if it's an overlap
    const eaten = (d < ship.beam.size / 2 + fly.size / 2);
    if (eaten) {
        // Reset the fly
        // counter++;
        // for (starter = 0; starter < counter; starter++) {
        resetFly();
        // }

        // Bring back the beam
        ship.beam.state = "inbound";
    }
}

/**
 * Launch the beam on click (if it's not launched yet)
 */
function mousePressed() {

    if (ship.beam.state === "idle") {
        ship.beam.state = "outbound";
    }
}