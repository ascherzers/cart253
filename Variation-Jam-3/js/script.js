// Global variables
let player;
let settings = { gravity: null };
let obstacles = [];
let coins = [];
let score = 0;

// setup executes once at the beginning
function setup() {
    createCanvas(600, 400); // Create a canvas of 600 pixels per 400 pixels
    settings.gravity = createVector(0, 1);
    player = new Player(settings, width / 2, height - 50, 40, 40);

    // Generate some obstacles and coins
    for (let i = 0; i < 5; i++) {
        obstacles.push(new Obstacle(random(50, width - 50), random(100, height - 50), 80, 20));
        coins.push(new Coin(random(50, width - 50), random(50, height - 100), 15));
    }
}

// draw executes again and again (~60 fps)
function draw() {
    background(220); // Apply a rgb color (220, 220, 220) to the the background

    // Display score
    fill(0);
    textSize(18);
    text(`Score: ${score}`, 10, 30);

    // Update and display player
    player.show();
    player.update();

    // Update and display obstacles
    for (let obstacle of obstacles) {
        obstacle.show();
    }

    // Update and display coins
    for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].show();
        if (player.collect(coins[i])) {
            coins.splice(i, 1);
            score++;
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
