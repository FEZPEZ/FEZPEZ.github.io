document.addEventListener("DOMContentLoaded", function () {
    const bgSpeed = 0.5; // pixels per frame
    const bgHeight = 512; // height of your tile image in px — adjust this to match your actual image
    let offset = 0;

    function scrollBackground() {
        offset -= bgSpeed;
        if (Math.abs(offset) >= bgHeight) {
            offset = 0; // reset to start for loop
        }

        document.body.style.backgroundPosition = `${offset}px ${offset}px`;
        requestAnimationFrame(scrollBackground);
    }

    scrollBackground();
});