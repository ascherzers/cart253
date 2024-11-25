// Global variables
let player;
let settings = { gravity: null };
let obstacles = [];
let coins = [];
let trails = [];
let score = 0;
let cameraOffset = 0; // Tracks the camera's vertical position


// setup executes once at the beginning
function setup() {
    createCanvas(600, 400); // Create a canvas of 600 pixels per 400 pixels
    settings.gravity = createVector(0, 1);
    player = new Player(settings, width / 2, height - 50, 40, 40);

    // Generate initial obstacles and coins
    generateMapSection(0, height);
}

// draw executes again and again (~60 fps)
function draw() {
    background(220); // Apply a rgb color (220, 220, 220) to the the background

    // Move the camera to follow the player only upward
    if (player.pos.y < height / 2 + cameraOffset) {
        cameraOffset = player.pos.y - height / 2;
    }
    translate(0, -cameraOffset);

    // Display score
    fill(0);
    textSize(18);
    text(`Score: ${score}`, 10, cameraOffset + 30);

    // Update and display player
    player.show();
    player.update();

    // Update and display obstacles
    for (let obstacle of obstacles) {
        obstacle.show();
        player.standOn(obstacle);
    }

    // Update and display coins
    for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].show();
        if (player.collect(coins[i])) {
            coins.splice(i, 1);
            score++;
        }
    }

    // Manage trails
    for (let i = trails.length - 1; i >= 0; i--) {
        trails[i].show();
        trails[i].update();
        if (player.standOn(trails[i])) {
            trails[i].resetLifetime(); // Refresh trail's lifetime when standing on it
        }
        if (trails[i].isFaded()) {
            trails.splice(i, 1); // Remove faded trails
        }
    }

    // Generate new map sections as the player climbs
    if (player.pos.y + cameraOffset < -height) {
        generateMapSection(cameraOffset - height, cameraOffset);
    }
}

// Generate a new section of the map
function generateMapSection(startY, endY) {
    // Clear old objects to avoid clutter
    obstacles = obstacles.filter((obs) => obs.y > startY);
    coins = coins.filter((coin) => coin.y > startY);

    // Determine the number of platforms dynamically based on height
    const basePlatforms = 5; // Base number of platforms
    const heightFactor = max(1, 1 - abs(cameraOffset) / 5000); // Reduce density with height
    const numberOfPlatforms = floor(basePlatforms * heightFactor);

    const platformSpacing = (endY - startY) / numberOfPlatforms;

    for (let i = 0; i < numberOfPlatforms; i++) {
        const platformY = startY + i * platformSpacing + random(-20, 20); // Slight randomness
        const platformX = random(50, width - 130); // Avoid edges

        // Add a new platform
        obstacles.push(new Obstacle(platformX, platformY, 80, 20));

        // Add a coin optionally
        if (random(1) < 0.4 * heightFactor) { // Decrease coin density with height
            const coinX = platformX + random(-10, 40);
            const coinY = platformY - 30;
            coins.push(new Coin(coinX, coinY, 15));
        }
    }
}

// keyPressed executes when a key is pressed
function keyPressed() {
    switch (key) {
        case 'ArrowLeft':
            player.move('left', true);
            break;
        case 'ArrowUp':
            player.move('up', true);
            break;
        case 'ArrowRight':
            player.move('right', true);
    }
}

// keyReleased executes when a key is released
function keyReleased() {
    switch (key) {
        case 'ArrowLeft':
            player.move('left', false);
            break;
        case 'ArrowRight':
            player.move('right', false);
    }
}

// Player class
class Player {
    constructor(settings, x, y, w, h) {
        this.settings = settings;
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.size = createVector(w, h);
        this.onGround = false;
    }

    show() {
        fill(100, 150, 255);
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    update() {
        this.acc.add(this.settings.gravity);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0, 0);

        // Leave a memory trail
        if (this.vel.mag() > 0) {
            trails.push(new Trail(this.pos.x, this.pos.y, this.size.x, this.size.y));
        }

        // Check if on a trail
        for (let trail of trails) {
            if (
                this.pos.y + this.size.y >= trail.y &&
                this.pos.y + this.size.y <= trail.y + 5 &&
                this.pos.x + this.size.x > trail.x &&
                this.pos.x < trail.x + trail.w
            ) {
                this.vel.y = 0;
                this.onGround = true;
                this.pos.y = trail.y - this.size.y; // Align with the trail
            }
        }

        // Screen borders
        if (this.pos.x < 0) {
            this.pos.x = 0;
            this.vel.x = 0;
        }
        if (this.pos.x + this.size.x > width) {
            this.pos.x = width - this.size.x;
            this.vel.x = 0;
        }

        // Prevent falling below the screen
        if (this.pos.y + this.size.y >= height) {
            this.pos.y = height - this.size.y;
            this.vel.y = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
    }

    move(direction, isPressed) {
        const speed = 5;
        if (direction === 'left') this.vel.x = isPressed ? -speed : 0;
        if (direction === 'right') this.vel.x = isPressed ? speed : 0;
        if (direction === 'up' && this.onGround) {
            this.vel.y = -15; // Jump force
            this.onGround = false;
        }
    }

    standOn(platform) {
        // Check collision with any platform (obstacle or trail)
        if (
            this.pos.y + this.size.y >= platform.y &&
            this.pos.y + this.size.y <= platform.y + 5 &&
            this.pos.x + this.size.x > platform.x &&
            this.pos.x < platform.x + platform.w &&
            this.vel.y >= 0
        ) {
            this.vel.y = 0;
            this.onGround = true;
            this.pos.y = platform.y - this.size.y; // Align with the platform
            return true;
        }
        return false;
    }

    collect(coin) {
        return dist(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, coin.x, coin.y) < this.size.x / 2 + coin.radius;
    }
}

// Obstacle class
class Obstacle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    show() {
        fill(200, 100, 100);
        rect(this.x, this.y, this.w, this.h);
    }
}

// Coin class
class Coin {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    show() {
        fill(255, 215, 0);
        ellipse(this.x, this.y, this.radius * 2);
    }
}

// Trail class
class Trail {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.lifetime = 60; // Duration in frames
    }

    show() {
        fill(100, 255, 100, map(this.lifetime, 0, 60, 0, 255)); // Fades over time
        rect(this.x, this.y, this.w, this.h);
    }

    update() {
        this.lifetime--; // Decrease lifetime
    }

    resetLifetime() {
        this.lifetime = 120; // Reset lifetime when stood on
    }

    isFaded() {
        return this.lifetime <= 0;
    }
}