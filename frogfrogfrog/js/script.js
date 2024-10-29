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
 * New feature: Changing the frog to a frog space ship 
 * Changing Fly to alien fly
 * Changing background to star movement going downwards
 */

"use strict";

// Our ship (space toad)
const ship = {
    body: {
        //The ship's body and size
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

// Our Alien-fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speed: 3
};

// Starfield (array to store stars)
let stars = [];
const starCount = 100; // Number of stars

// Score counter
let score = 0;

let stateFunction = titleScreen;//Start with the title screen

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(640, 480);

    // Create starfield with random positions
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: random(0, width),
            y: random(0, height),
            size: random(1, 3),
            speed: random(1, 3) // Different stars move at different speeds
        });
    }

    // Give the fly its first random position
    resetFly();
}

function draw() {
    stateFunction();
}

function titleScreen() {
    drawStars();
    displayTitle();
    displayStartButton();
}

function game() {
    drawStars(); // Draw and move the stars
    moveFly();
    drawFly();
    moveShip();
    moveBeam();
    drawShip();
    checkBeamOverlap();
    displayScore();// Write out score
}

/**
 * Draws and animates the starfield background
 */
function drawStars() {
    background("black"); // Clear the background

    for (let star of stars) {
        fill(255);
        noStroke();
        ellipse(star.x, star.y, star.size); // Draw star

        // Move the star down
        star.y += star.speed;

        // Wrap around to the top if star goes off-screen
        if (star.y > height) {
            star.y = 0;
            star.x = random(0, width); // Reset to a random position at the top
        }
    }
}

function displayTitle() {
    push();
    fill("white");
    textFont('Courier New');
    textSize(40);
    textAlign(CENTER);
    text("FROGALA", width / 2, height / 2 - 20);
    textSize(20);
    text("A game of catching Alien Flies \n with your Tractor Tounge", width / 2, height / 2 + 20);
    pop();
}

function displayStartButton() {
    push();
    fill("#55fff0");
    rect(width / 2 - 70, height / 2 + 60, 140, 40, 5);//Start button rectangle
    fill("black");
    textFont('Courier New');
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Start", width / 2, height / 2 + 80);//Start button text
    pop();
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
 * Draws the alien-fly hybrid with simple, quirky features.
 */
function drawFly() {
    push();
    noStroke();

    // Head: Slightly oval-shaped to blend alien and insect vibes
    fill("#8aff8a"); // Alien-green color
    ellipse(fly.x, fly.y, fly.size * 2, fly.size * 1.5);

    // Eyes: Glowing, alien-like
    fill("white");
    ellipse(fly.x - 5, fly.y - 5, 10, 12); // Left eye
    ellipse(fly.x + 5, fly.y - 5, 10, 12); // Right eye

    fill("#55fff0"); // Glow effect for the pupils
    ellipse(fly.x - 5, fly.y - 5, 5); // Left pupil
    ellipse(fly.x + 5, fly.y - 5, 5); // Right pupil

    // Antennae: Short, insect-like feel
    stroke("#8aff8a");
    strokeWeight(2);
    line(fly.x - 7, fly.y - 15, fly.x - 10, fly.y - 25); // Left antenna
    line(fly.x + 7, fly.y - 15, fly.x + 10, fly.y - 25); // Right antenna

    // Wings: Transparent with a subtle glow
    fill(255, 255, 255, 100); // Transparent white
    ellipse(fly.x - 10, fly.y, 15, 30); // Left wing
    ellipse(fly.x + 10, fly.y, 15, 30); // Right wing

    // Body: Small and rounded like an insect's thorax
    fill("#6aff6a");
    ellipse(fly.x, fly.y + 10, fly.size, fly.size * 1.2);

    // Tiny Legs: Bug-like dangling limbs
    stroke("#6aff6a");
    strokeWeight(2);
    line(fly.x - 5, fly.y + 15, fly.x - 5, fly.y + 25); // Left leg
    line(fly.x + 5, fly.y + 15, fly.x + 5, fly.y + 25); // Right leg

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
 * Draws a hybrid frog-spaceship with sci-fi and organic elements.
 */
function drawShip() {
    // Draw the beam tip
    push();
    fill("#55fff0");
    noStroke();
    ellipse(ship.beam.x, ship.beam.y, ship.beam.size);
    pop();

    // Draw the beam line
    push();
    stroke("#55fff0");
    strokeWeight(ship.beam.size);
    line(ship.beam.x, ship.beam.y, ship.body.x, ship.body.y);
    pop();

    // Draw the frog-ship's body (a rounded metallic hull)
    push();
    fill("#3e8e41"); // Metallic frog-green color
    stroke("#2c5f2d"); // Darker green outline for metallic effect
    strokeWeight(4);
    ellipse(ship.body.x, ship.body.y, ship.body.size, ship.body.size * 0.8); // Slightly oval shaped main body
    pop();

    // Frog like eye cylinders (futuristic cameras or sensors)
    push();
    fill("#d1f7ff"); // Sci-fi blue & white for the eyes
    stroke("#55fff0");
    strokeWeight(3);
    ellipse(ship.body.x - 50, ship.body.y - 40, 50, 30); // Left eye module
    ellipse(ship.body.x + 50, ship.body.y - 40, 50, 30); // Right eye module

    fill("#55fff0"); // Glowing pupils
    ellipse(ship.body.x - 50, ship.body.y - 40, 15);
    ellipse(ship.body.x + 50, ship.body.y - 40, 15);
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
        score++; // Increase score
    }
}

/**
 * Display the score on the top right corner of the screen
 */
function displayScore() {
    push();
    fill("white");
    textFont('Courier New')
    textSize(20);
    text(`Score: ${score}`, 530, 30); // Display score in the top right corner
    pop();
}

/**
 * Launch the beam on click (if it's not launched yet)
 */
function mousePressed() {
    // If the mouse is pressed on the location of the button:
    if (mouseX > width / 2 - 70 && mouseX < width / 2 + 70 && mouseY > height / 2 + 60 && mouseY < height / 2 + 100) {
        stateFunction = game; // Change the title page to the game page when button is clicked
    }
    if (ship.beam.state === "idle") {
        ship.beam.state = "outbound";
    }
}