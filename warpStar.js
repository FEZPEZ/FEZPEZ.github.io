function spawnWarpStar() {
    const warpStarDiv = document.getElementById('warpStar');
    const warpStarImg = document.createElement('img');
    warpStarImg.src = 'images/warp-star.png'; // Path to your image
    warpStarDiv.appendChild(warpStarImg);

    // Randomly spawn offscreen (either left or right side)
    const startPosition = Math.random() < 0.5 ? -50 : window.innerWidth + 50; // offscreen to the left or right
    const startTop = Math.random() * (window.innerHeight - 50); // Random vertical position within the window
    warpStarImg.style.left = `${startPosition}px`;
    warpStarImg.style.top = `${startTop}px`;

    const direction = startPosition < 0 ? 1 : -1; // Move to the right if starting from left, or left if starting from right

    // Variables to control vertical movement
    let verticalOffset = 0;
    const verticalSpeed = Math.random() * 0.5 + 0.5; // Random vertical speed
    const maxVerticalMovement = 20; // Maximum vertical movement

    // Animate the image across the screen
    let currentPosition = startPosition;
    const speed = 1; // Horizontal speed of movement
    function move() {
        currentPosition += direction * speed;

        // Update vertical position with random wandering effect
        verticalOffset += (Math.random() * 2 - 1) * verticalSpeed; // Random up/down movement
        verticalOffset = Math.min(Math.max(verticalOffset, -maxVerticalMovement), maxVerticalMovement); // Limit the vertical movement

        warpStarImg.style.top = `${startTop + verticalOffset}px`; // Apply the vertical offset

        if ((direction === 1 && currentPosition > window.innerWidth) || (direction === -1 && currentPosition < -50)) {
            // Once it reaches the end, remove the image
            warpStarImg.remove();
        } else {
            warpStarImg.style.left = `${currentPosition}px`;
            requestAnimationFrame(move);
        }
    }

    move();
}

// Spawn the warp star every 5-10 seconds
setInterval(spawnWarpStar, Math.random() * 500 + 5000);
