// Global variables
let player;
let settings = { gravity: null };
let platforms = [];
let score = 0;
let gameOver = false; // Track if the game is over
let platformBuffer = 100; // Buffer above the visible area to spawn platforms

function setup() {
    createCanvas(500, 600);
    initializeGame(); // Initialize the game state
}

// Initialize or reset the game state
function initializeGame() {
    settings.gravity = createVector(0, 0.5);
    platforms = [];
    score = 0;
    gameOver = false;

    // Generate initial platforms
    for (let i = 0; i < 10; i++) {
        let x = random(50, width - 100);
        let y = height - i * 60; // Space out platforms vertically
        platforms.push(new Platform(x, y, 80, 15));
    }

    // Place player on top of the first platform
    let firstPlatform = platforms[platforms.length - 1];
    player = new Player(settings, firstPlatform.x + firstPlatform.w / 2 - 20, firstPlatform.y - 40, 40, 40);

    loop(); // Restart the draw loop
}

function draw() {
    background(220);

    // Handle game over logic
    if (gameOver) {
        displayGameOverScreen();
        return;
    }

    // Draw the score at the fixed screen position
    drawScore();

    // Translate canvas based on player position (simulate scrolling)
    let offsetY = max(0, height / 2 - player.pos.y);
    translate(0, offsetY);

    // Update and display player
    player.update(platforms);
    player.show();

    // Update and display platforms
    for (let i = platforms.length - 1; i >= 0; i--) {
        platforms[i].show();

        // Remove platforms that move off-screen below the player
        if (platforms[i].y > player.pos.y + height) {
            platforms.splice(i, 1);
        }
    }

    // Ensure platforms exist above the screen before they are visible
    while (platforms[platforms.length - 1].y > player.pos.y - platformBuffer - height) {
        let newX = random(50, width - 100);
        let newY = platforms[platforms.length - 1].y - 60;
        platforms.push(new Platform(newX, newY, 80, 15));
    }

    // Increment score as the player ascends
    for (let platform of platforms) {
        if (platform.y > player.pos.y + height / 2 && !platform.scored) {
            platform.scored = true; // Mark platform as scored
            score++;
        }
    }

    // Game over condition
    if (player.pos.y > height + 100) {
        gameOver = true;
        displayGameOverScreen();
        noLoop(); // Stop the draw loop
    }
}

// Draw the score at a fixed position on the screen
function drawScore() {
    push(); // Save the current drawing state
    resetMatrix(); // Reset transformations to the default coordinate system
    fill('red');
    textSize(18);
    text(`Score: ${score}`, 10, 30); // Always draw at the top-left corner
    pop(); // Restore the previous drawing state
}



// Display the game-over screen
function displayGameOverScreen() {
    textAlign(CENTER);
    textSize(32);
    fill('red');
    text("Game Over!", width / 2, height / 2 - 50);
    textSize(20);
    text("Press SPACE to restart", width / 2, height / 2);
}

// keyPressed handles input
function keyPressed() {
    if (gameOver && key === ' ') {
        initializeGame(); // Restart the game when space is pressed
    }

    if (!gameOver) {
        if (key === 'ArrowLeft') player.move('left', true);
        if (key === 'ArrowRight') player.move('right', true);
    }
}

function keyReleased() {
    if (!gameOver) {
        if (key === 'ArrowLeft') player.move('left', false);
        if (key === 'ArrowRight') player.move('right', false);
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
    }

    show() {
        fill(100, 150, 255);
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    update(platforms) {
        this.acc.add(this.settings.gravity);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0, 0);

        // Horizontal boundary wrapping
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.x < 0) this.pos.x = width;

        // Check for collisions with platforms (only when falling)
        if (this.vel.y > 0) {
            for (let platform of platforms) {
                if (
                    this.pos.x + this.size.x > platform.x &&
                    this.pos.x < platform.x + platform.w &&
                    this.pos.y + this.size.y <= platform.y &&
                    this.pos.y + this.size.y + this.vel.y >= platform.y
                ) {
                    this.vel.y = -10; // Bounce up
                    break;
                }
            }
        }
    }

    move(direction, isPressed) {
        const speed = 5;
        if (direction === 'left') this.vel.x = isPressed ? -speed : 0;
        if (direction === 'right') this.vel.x = isPressed ? speed : 0;
    }
}

// Platform class
class Platform {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.scored = false; // Tracks if the platform has contributed to the score
    }

    show() {
        fill(200, 100, 100);
        rect(this.x, this.y, this.w, this.h);
    }
}
