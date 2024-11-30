// Global variables
let player;
let settings = { gravity: null };
let platforms = [];
let coins = [];
let trails = [];
let score = 0;
let cameraOffset = 0; // Tracks the camera's vertical position
let bg, icLeft, icRight, platformImg; // Assets


function preload() {
    bg = loadImage('assets/images/bg.png'); // Background image
    icLeft = loadImage('assets/images/Ic_left.png'); // Icarus facing left
    icRight = loadImage('assets/images/Ic_right.png'); // Icarus facing right
    platformImg = loadImage('assets/images/platform.jpg'); // Platform image 
}
// setup executes once at the beginning
function setup() {
    createCanvas(600, 400); // Create a canvas of 600 pixels per 400 pixels
    settings.gravity = createVector(0, 1);
    player = new Player(settings, width / 2, height - 50, 40, 40, icLeft, icRight);

    // Generate initial platforms and coins
    generateMapSection(0, height);
}

// draw executes again and again (~60 fps)
function draw() {
    image(bg, 0, 0, width, height); // Draw background image

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
    player.update(platforms);

    // Update and display platforms
    for (let platform of platforms) {
        platform.draw();
    }

    // Update and display coins
    for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].show();
        if (player.collect(coins[i])) {
            coins.splice(i, 1);
            score++;
        }
    }

    // Generate new platforms and coins as the player climbs
    if (player.pos.y + cameraOffset < -height) {
        generatePlatforms(cameraOffset - height, cameraOffset);
    }

    // Remove old platforms and coins below the screen
    platforms = platforms.filter(platform => platform.y > cameraOffset - height);
    coins = coins.filter(coin => coin.y > cameraOffset - height);
}

// Generate platforms and coins
function generatePlatforms(startY, endY) {
    const sectionHeight = endY - startY;

    // Determine the number of platforms dynamically based on height
    const basePlatforms = 6; // Base number of platforms
    const heightFactor = max(0.6, 1 - abs(cameraOffset) / 5000); // Reduce density with height
    const numberOfPlatforms = floor(basePlatforms * heightFactor);
    const gap = sectionHeight / numberOfPlatforms;

    for (let i = 0; i < numberOfPlatforms; i++) {
        let tries = 0;
        let platformAdded = false;

        while (tries < 10 && !platformAdded) {
            tries++;

            // Generate random positions for the platform
            const platformX = random(50, width - 130);
            const platformY = startY + i * gap + random(-20, 20);

            // Ensure the platform does not overlap with existing platforms
            let isValid = true;
            for (let existing of platforms) {
                if (dist(platformX, platformY, existing.x, existing.y) < 100) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                platforms.push(new Platform(platformX, platformY, platformImg));
                platformAdded = true;

                // Optionally add a coin near the platform
                if (random(1) < 0.4 * heightFactor) {
                    const coinX = platformX + random(-10, 40);
                    const coinY = platformY - 30;
                    coins.push(new Coin(coinX, coinY, 15));
                }
            }
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
    constructor(settings, x, y, w, h, leftImg, rightImg) {
        this.settings = settings;
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.size = createVector(w, h);
        this.onGround = false;
        this.facingRight = true;
        this.leftImg = leftImg;
        this.rightImg = rightImg;
    }

    show() {
        imageMode(CENTER);
        const img = this.facingRight ? this.rightImg : this.leftImg;
        image(img, this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, this.size.x, this.size.y);
    }

    update(platforms) {
        this.acc.add(this.settings.gravity);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0, 0);

        // Check for platform collisions
        for (let platform of platforms) {
            if (this.standOn(platform)) break;
        }

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
        if (direction === 'left') {
            this.vel.x = isPressed ? -speed : 0;
            this.facingRight = false;
        }
        if (direction === 'right') {
            this.vel.x = isPressed ? speed : 0;
            this.facingRight = true;
        }
        if (direction === 'up' && this.onGround) {
            this.vel.y = -15; // Jump force
            this.onGround = false;
        }
    }

    standOn(platform) {
        // Check collision with any platform (platforms or trail)
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

// Platform class
class Platform {
    constructor(x, y, img) {
        this.x = x;
        this.y = y;
        this.w = 80;
        this.h = 20;
        this.img = img;
    }

    draw() {
        image(this.img, this.x, this.y, this.w, this.h);
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