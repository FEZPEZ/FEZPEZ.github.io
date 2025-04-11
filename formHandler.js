const form = document.getElementById('rsvpForm');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const guestElements = document.querySelectorAll('input[name="guest[]"]');
    const guests = Array.from(guestElements)
        .map(g => g.value.trim())
        .filter(g => g.length > 0);

    const endpoint = 'https://script.google.com/macros/s/AKfycbzfpv-x1cXy3zMSZXJJx1_A-N3nyJXdnB_m6JJ9M4cZZofRuQ0a083XDUcsHPQyw851/exec';

    const payload = {
        name,
        email,
        guests
    };

    fetch(endpoint, {
        redirect: "follow",
        method: 'POST',
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                const gif = document.getElementById('explosionGif');
                gif.src = ''; // Unload the image
                void gif.offsetWidth; // Force reflow to allow restarting
                gif.src = 'images/explosion.gif'; // Set it back again

                form.style.opacity = '0';
                form.style.pointerEvents = 'none';
                // Show the success message
                successMessage.style.display = 'block';
                form.reset();
            } else {
                alert('Something went wrong. Try again.');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error submitting form.');
        });
});
