function spawnComet() {
    const comet = document.createElement('img');
    comet.src = 'images/comet-observatory.png';
    comet.style.position = 'fixed';
    comet.style.width = '1000px';
    comet.style.height = 'auto';
    comet.style.zIndex = '-1';
    comet.style.pointerEvents = 'none';

    comet.classList.add('silhouette-rotate');

    // Start offscreen (bottom-right)
    let x = window.innerWidth + 100;
    let y = window.innerHeight + 100;
    comet.style.left = `${x}px`;
    comet.style.top = `${y}px`;

    document.body.appendChild(comet);

    const speed = 2; // pixels per frame (adjust for faster/slower movement)

    function animate() {
        x -= speed;
        y -= speed;

        comet.style.left = `${x}px`;
        comet.style.top = `${y}px`;

        // When completely offscreen to the top-left, remove it
        if (x < -1500 || y < -1500) {
            comet.remove();
        } else {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// Run every minute
setInterval(spawnComet, 60000);

// Optionally trigger once on page load
spawnComet();
