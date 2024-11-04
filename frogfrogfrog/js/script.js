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
 * Added a Score System
 * Changed the fly spawn to spawn on both sides and in waves moving faster and randomly
 * Added a title screen
 * Particle effects
 */

"use strict";


// Our ship (space toad)
const ship = {
    body: {
        // The ship's body and size
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

// Alien-fly
const maxWaves = 5; // Constant for wave configurations
let currentWave = 1;
let flies = [];
let fliesPerWave = 5; // Starting count of flies per wave
let caughtFlies = 0;
let waveCooldown = 0; // Timer for cooldown between waves
let particles = []; // Particle effect array

// Starfield (array to store stars)
let stars = [];
const starCount = 100; // Number of stars

// Score counter
let score = 0;
let stateFunction = titleScreen;//Start with the title screen

// Boss (Sci-Fi Bird) Configuration
const boss = {
    x: 320,
    y: -200,
    width: 300,
    height: 200,
    beakWidth: 100,
    beakHeight: 120,
    health: 20,
    attackCooldown: 120, // Cooldown between each attack sequence
    attackWarning: false,
    attackWarningCooldown: 0,
    active: false,
    attackPhase: 0 // Tracks the attack phase (0 = center, 1 = left, 2 = right)
};

/**
 * Creates the canvas and sets up the fly
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
    // Give the flies their first position
    makeWave();
}

/**
 * Draws the stateFunctioj
 */
function draw() {
    stateFunction();
}

/**
 * Holds the title page by calling all the title page functions
 */
function titleScreen() {
    drawStars();
    displayTitle();
    displayStartButton();
}

/**
 * Holds the main game page and calls all the rest of the primary functions
 */
function game() {
    drawStars(); // Draw and move the stars
    if (waveCooldown > 0) {
        // Display wave start message during cooldown
        displayWaveStartMessage();
        waveCooldown--;
    } else {
        moveFlies();// Move flies in pattern
        drawFlies(); // Draws flies
        moveShip();
        moveBeam();
        drawShip();
        checkBeamOverlap();
        drawParticles();
        displayScore();// Write out score
    }
    // Trigger boss battle once waves are done
    if (currentWave > maxWaves && boss.active) {
        drawBoss();
        handleBossAttack();
    }
    if (boss.active) {
        drawBoss();
        handleBossAttack();
    }
}

/**
 * Makes a new wave of flies with random patterns and seperate spawn times
 */
function makeWave() {
    flies = [];
    let speed = 2 + currentWave; // Base speed increases per wave

    for (let i = 0; i < fliesPerWave; i++) {
        // Decide starting side and delay for each fly
        let startX = i % 2 === 0 ? 0 : width; // Alternates start side
        let direction = startX === 0 ? 1 : -1; // Direction based on start side
        let yPos = random(50, height / 2); // Random Y position
        let flySpeed = speed * direction * random(0.8, 1.2); // Random speed variation

        // Color and smaller size based on side
        let flyColor = startX === 0 ? "#8aff8a" : "#ff8a8a"; // Left: greenish, Right: reddish
        let spawnDelay = int(random(30, 120)); // Random spawn delay

        flies.push({
            x: startX,
            y: yPos,
            size: 5, // Start small for animation
            targetSize: 20, // Final size for active flies
            color: flyColor,
            originalColor: flyColor,
            speed: flySpeed,
            delay: spawnDelay,
            active: false,
            captured: false
        });
    }
}

/**
 * Creates particle effect around the fly.
 */
function createParticles(fly) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: fly.x,
            y: fly.y,
            size: random(2, 5),
            color: fly.color,
            xSpeed: random(-2, 2),
            ySpeed: random(-2, 2),
            lifespan: 30
        });
    }
}

/**
 * Moves particles and reduces lifespan.
 */
function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        fill(p.color);
        noStroke();
        ellipse(p.x, p.y, p.size);

        p.x += p.xSpeed;
        p.y += p.ySpeed;
        p.lifespan--;

        if (p.lifespan <= 0) {
            particles.splice(i, 1); // Remove particle when lifespan is over
        }
    }
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

/**
 * Displays the title and description of the game on the title screen
 */
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

/**
 * Start button to start the game from the title screen
 */
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
 * Moves each fly of the current wave across the screen
 */
function moveFlies() {
    for (let fly of flies) {
        if (!fly.active) {
            // Decrement delay and activate fly when delay reaches zero
            fly.delay--;
            if (fly.delay <= 0) {
                fly.active = true;
                createParticles(fly); // Particle effect on activation
            }
        } else if (fly.captured) {
            // Move captured fly toward the ship
            fly.x = lerp(fly.x, ship.body.x, 0.05);
            fly.y = lerp(fly.y, ship.body.y, 0.05);
            if (dist(fly.x, fly.y, ship.body.x, ship.body.y) < 10) {
                flies.splice(flies.indexOf(fly), 1); // Remove when close to ship
                score++;
                caughtFlies++;
                if (caughtFlies >= fliesPerWave) resetWave();
            }
        } else {
            // Animate the activation effect by increasing fly size to targetSize
            if (fly.size < fly.targetSize) {
                fly.size += 0.5; // Animate to normal size
            }
            // Move active flies
            fly.x += fly.speed;
            if (fly.x > width || fly.x < 0) {
                fly.speed *= -1; // Bounce back at screen edges
            }
        }
    }
}

/**
 * Draws the alien-fly hybrid with colour and variation
 */
function drawFlies() {
    for (let fly of flies) {
        if (fly.active) {
            push();
            noStroke();
            fill(fly.color); // Use color based on side

            // Head: Slightly oval-shaped to blend alien and insect vibes
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
    }
}

/**
 * Displays a "Wave Start" message at the beginning of each wave.
 */
function displayWaveStartMessage() {
    push();
    fill("white");
    textFont('Courier New');
    textSize(30);
    textAlign(CENTER, CENTER);
    text(`Wave ${currentWave}`, width / 2, height / 2);
    pop();
}

/**
 * Resets the flies when all are caught.
 */
function resetWave() {
    caughtFlies = 0;
    if (currentWave < maxWaves) {
        currentWave++;
        fliesPerWave += 3; // Increase flies per wave
        waveCooldown = 60; // Set cooldown duration for the wave start message
        makeWave();
    } else {
        // After the final wave, start the boss battle instead of resetting to the title screen
        startBossBattle(); // Activate the boss battle
    }
}

/**
 * Starts the boss battle with it's starting attributes
 */
function startBossBattle() {
    boss.active = true;
    boss.health = 20;
    boss.attackCooldown = 120;
}

/**
 * Draws the bird looking boss
 */
function drawBoss() {
    if (boss.health <= 0) {
        stateFunction = victoryScreen;
        return;
    }

    // Draw the main body of the bird
    push();
    fill("#444");
    noStroke();
    ellipse(boss.x, boss.y, boss.width, boss.height);

    // Draw the wings
    fill("#666");
    ellipse(boss.x - boss.width * 0.6, boss.y + 30, boss.width * 0.7, boss.height * 0.5);
    ellipse(boss.x + boss.width * 0.6, boss.y + 30, boss.width * 0.7, boss.height * 0.5);

    // Draw the eyes
    fill("red");
    ellipse(boss.x - 40, boss.y - 30, 20, 30);
    ellipse(boss.x + 40, boss.y - 30, 20, 30);
    fill("yellow");
    ellipse(boss.x - 40, boss.y - 30, 10, 15);
    ellipse(boss.x + 40, boss.y - 30, 10, 15);

    // Draw the beak based on the attack phase
    if (boss.attackWarning) {
        fill("yellow");
        textSize(30);
        textAlign(CENTER, CENTER);
        text("WARNING!", boss.attackTargetX, boss.attackTargetY - 50);
    } else {
        fill("#333");
        triangle(
            boss.x, boss.y, // Top of the beak
            boss.attackTargetX - boss.beakWidth / 2, boss.attackTargetY, // Left corner of beak
            boss.attackTargetX + boss.beakWidth / 2, boss.attackTargetY // Right corner of beak
        );
    }

    pop();

    // Display boss health
    fill("white");
    textSize(20);
    textAlign(CENTER, CENTER);
    text(`BOSS HEALTH: ${boss.health}`, width / 2, 50);
}

function handleBossAttack() {
    if (boss.attackCooldown > 0) {
        boss.attackCooldown--;
    } else if (!boss.attackWarning) {
        // Start warning phase for the current attack
        boss.attackWarning = true;
        boss.attackWarningCooldown = 60; // Warning duration

        // Set attack target position based on phase
        if (boss.attackPhase === 0) { // Center attack
            boss.attackTargetX = width / 2;
            boss.attackTargetY = height / 2;
        } else if (boss.attackPhase === 1) { // Left attack
            boss.attackTargetX = width / 3;
            boss.attackTargetY = height / 2;
        } else if (boss.attackPhase === 2) { // Right attack
            boss.attackTargetX = (2 * width) / 3;
            boss.attackTargetY = height / 2;
        }
    } else if (boss.attackWarning && boss.attackWarningCooldown > 0) {
        boss.attackWarningCooldown--;
        if (boss.attackWarningCooldown === 0) {
            boss.attackWarning = false;
            boss.isAttacking = true;
        }
    } else if (boss.isAttacking) {
        // Move the beak down towards the target
        boss.y += 10;
        if (boss.y > boss.attackTargetY) {
            // Check for collision with the ship
            if (dist(boss.attackTargetX, boss.attackTargetY, ship.body.x, ship.body.y) < boss.beakWidth / 2) {
                stateFunction = gameOverScreen;
            }

            // Reset position and prepare for next attack
            boss.isAttacking = false;
            boss.y = -200; // Reset the bird's position to top
            boss.attackPhase = (boss.attackPhase + 1) % 3; // Cycle through center, left, right
            boss.attackCooldown = 120; // Cooldown before next attack sequence
        }
    }
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
        // Move the beam down toward the frog spaceship
        if (ship.beam.y < ship.body.y) {
            ship.beam.y += ship.beam.speed; // Move down to the frog's position
        } else {
            ship.beam.state = "idle"; // Reset to idle when it reaches the frog
        }
    }
}

/**
 * Draws a frog spaceship 
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
    for (let i = flies.length - 1; i >= 0; i--) {
        // Get distance from beam to fly
        const fly = flies[i];
        if (fly.active && !fly.captured) {
            const d = dist(ship.beam.x, ship.beam.y, fly.x, fly.y);
            // Check if it's an overlap
            if (d < ship.beam.size / 2 + fly.size / 2) {
                fly.color = "#ffffff"; // Flash effect
                fly.captured = true; // Set to captured state
                createParticles(fly); // Create particles for the caught fly
                ship.beam.state = "inbound"; // Change beam state to inbound
                fly.x = ship.beam.x; // Set fly's x position to the beam's x
                fly.y = ship.beam.y; // Set fly's y position to the beam's y
                setTimeout(() => (fly.color = fly.originalColor), 100); // Reset color after flash
                break;
            }
        }
    }
    if (boss.active && dist(ship.beam.x, ship.beam.y, boss.x, boss.y) < boss.width / 2) {
        boss.health--;
    }
}

/**
 * Shows the game over screen if game loss
 */
function gameOverScreen() {
    background("black");
    fill("red");
    textSize(50);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
}

/**
 * Shows the victory screen if game won
 */
function victoryScreen() {
    background("black");
    fill("green");
    textSize(50);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width / 2, height / 2);
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