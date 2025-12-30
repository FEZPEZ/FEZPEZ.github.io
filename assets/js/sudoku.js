document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.minigame').forEach(container => {
    const btn = container.querySelector('button');
    const result = container.querySelector('p');
    if (!btn || !result) return;

    btn.addEventListener('click', () => {
      const outcomes = ['You win!', 'Try again.', 'Almost!'];
      const choice = outcomes[Math.floor(Math.random() * outcomes.length)];
      result.textContent = choice;
    });
  });
});
