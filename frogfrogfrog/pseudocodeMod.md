# Pseudocode for FROLAGA

ship
    body
        x: 320 // Middle of a 640x480 canvas
        y: 520 // Near the bottom
        size: 150 // Diameter of the ship
    beam
        x: undefined // Matches the body x
        y: 480 // Initial y position near bottom
        size: 20 // Diameter of beam tip
        speed: 20 // Beam speed in pixels/second
        state: idle // Beam starts in an idle state
    secondBeam // For power-up after 3 waves
        x: undefined
        y: 480
        size: 20
        speed: 20
        state: idle
    thirdBeam // For power-up after 5 waves
        x: undefined
        y: 480
        size: 20
        speed: 20
        state: idle

gameState
    winScore: 1000 // Score to win the game
    maxWaves: 100 // Total number of waves
    score: 0 // Player’s score
    currentWave: 1 // Tracks the wave level
    flies: array // Array to hold alien flies
    fliesPerWave: 5 // Flies per wave, increasing with each wave
    waveCooldown: 0 // Cooldown timer between waves
    particles: array // Particle effect array for visuals

stars
    starCount: 100 // Number of stars in starfield
    array of stars with random x, y positions and movement speeds

setup()
    create a 640x480 canvas
    initialize starfield with random positions and speeds
    generate first wave of flies

draw()
    call stateFunction // Runs either titleScreen or game based on current game state

titleScreen()
    drawStars()
    display title, instructions, and a start button

game()
    if score >= winScore
        switch to victoryScreen
        return
    drawStars() // Draw starfield background
    if waveCooldown > 0
        display "Wave Start" message
        decrease waveCooldown
    else
        moveFlies()
        drawFlies()
        moveShip()
        moveBeam(ship.beam)
        if doubleBeamUnlocked moveBeam(ship.secondBeam)
        if tripleBeamUnlocked moveBeam(ship.thirdBeam)
        drawShip()
        checkBeamOverlap(ship.beam)
        if doubleBeamUnlocked checkBeamOverlap(ship.secondBeam)
        if tripleBeamUnlocked checkBeamOverlap(ship.thirdBeam)
        drawParticles()
        displayScore()

makeWave()
    clear flies array
    speed = 2 + currentWave
    for each fly in fliesPerWave
        set starting side, y position, and speed
        assign color based on starting side
        set random spawn delay
        add fly to flies array

createParticles(fly)
    add particles around the caught fly position

drawParticles()
    for each particle in particles
        draw particle
        move particle based on speed
        decrease lifespan
        remove particle if lifespan <= 0

drawStars()
    background black
    for each star
        draw and move star downwards
        if star goes off bottom, reset to top at random x

displayTitle()
    display title and description at screen center

displayStartButton()
    display a button with "Start" text at the center

moveFlies()
    for each fly in flies
        if fly delay > 0
            decrease delay
        if fly is activated, grow to target size, then move horizontally
        if fly is captured, move towards the ship
            if close to ship, remove fly from array and increase score
            if all flies caught in wave, call resetWave

drawFlies()
    for each active fly
        draw body, eyes, wings, and legs

displayWaveStartMessage()
    display the wave number at the center

resetWave()
    reset caughtFlies to 0
    if currentWave < maxWaves
        increment currentWave
        increase fliesPerWave by 3
        set waveCooldown
        call makeWave
        if currentWave is 3 unlock doubleBeam
        if currentWave is 5 unlock tripleBeam
    else call gameOverScreen

moveShip()
    set ship body x to mouse x position

moveBeam(beam)
    set beam x to ship body x
    if beam is idle do nothing
    if beam is outbound
        move beam up by speed
        if beam reaches top, set to inbound
    if beam is inbound
        move beam down by speed
        if beam reaches ship, set to idle

drawShip()
    draw each beam and line to ship
    if doubleBeamUnlocked draw secondBeam
    if tripleBeamUnlocked draw thirdBeam
    draw ship body with sci-fi style and frog-like eyes

checkBeamOverlap(beam)
    for each fly in flies
        if fly is active and not captured
            if beam overlaps fly
                set fly to captured
                create particles
                set beam to inbound
                set fly position to beam position
                reset fly color after delay if flashing

gameOverScreen()
    display "GAME OVER" in red at center

victoryScreen()
    display "YOU WIN!" in green at center

displayScore()
    display score at top right corner

mousePressed()
    if game in titleScreen
        switch to game state
    else if beam is idle
        set beam state to outbound
