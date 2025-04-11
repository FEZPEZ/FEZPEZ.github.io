const addGuestBtn = document.getElementById('addGuestBtn');
const guestsDiv = document.getElementById('guests');

addGuestBtn.addEventListener('click', () => {
    const guestInput = document.createElement('div');
    guestInput.classList.add('guest-input');
    guestInput.innerHTML = '<input type="text" name="guest[]" placeholder="Guest Name">';
    guestsDiv.appendChild(guestInput);
});
