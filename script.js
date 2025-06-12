const buttons = document.querySelectorAll('.tab-button');
const mainContent = document.getElementById('main-content');

const loadTab = async (tab) => {
    if (tab === 'funny') {
        // Inject canvas manually and call init function (assumed to be defined elsewhere)
        mainContent.innerHTML = `<canvas id="funny-canvas"></canvas>`;
        if (typeof initFunnyTab === 'function') {
            initFunnyTab();
        }
    } else if (tab === 'main') {
            // Inject canvas manually and call init function (assumed to be defined elsewhere)
            mainContent.innerHTML = `<canvas id="morph-container"></canvas>`;
            if (typeof setInterval === 'function') {
                setInterval(morph, 1000);
            }
    } else {
        const res = await fetch(`tabs/${tab}.html`);
        const html = await res.text();
        mainContent.innerHTML = `<div class="tab-content active">${html}</div>`;
    }
};

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');

        buttons.forEach(btn => btn.classList.remove('text-blue-600'));
        button.classList.add('text-blue-600');

        loadTab(tab);
    });
});

// Load home tab by default
loadTab('home');
