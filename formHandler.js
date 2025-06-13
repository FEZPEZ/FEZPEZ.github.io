const form = document.getElementById('dish-form');
const statusDiv = document.getElementById('status');
const categoryButtonsContainer = document.getElementById('category-buttons');
const categoryHiddenInput = document.getElementById('category-hidden');
const takenDishesList = document.getElementById('taken-dishes');

const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbz1zoU2bDG83YhjqooWrDr4DNgfAN3TvVQP6PAuOB8IvIifpgrOASmwyV05CrYi-qBb/exec';

let allEntries = [];

function getMessage(ratio) {
    if (ratio < 0.5) {
        return { text: "we need this!", color: "text-green-700", bg: "bg-green-100" };
    } else if (ratio < 0.7) {
        return { text: "you could bring this", color: "text-yellow-800", bg: "bg-yellow-100" };
    } else if (ratio < 1) {
        return { text: "only if you really want to", color: "text-orange-800", bg: "bg-orange-100" };
    } else {
        return { text: "we're good on this", color: "text-red-800", bg: "bg-red-100" };
    }
}

function updateTakenDishesList(categoryName, categoriesData) {
    takenDishesList.innerHTML = '';

    if (!categoryName || !categoriesData || !Array.isArray(categoriesData)) {
        takenDishesList.innerHTML = '<li class="text-gray-500">Nothing yet...</li>';
        return;
    }

    // Find the category object by name (case-insensitive)
    const categoryObj = categoriesData.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());

    if (!categoryObj || !categoryObj.dishes || categoryObj.dishes.length === 0) {
        takenDishesList.innerHTML = '<li class="text-gray-500">Nothing yet...</li>';
        return;
    }

    categoryObj.dishes.forEach(dish => {
        const tags = [];
        if (dish.gf) tags.push('GF');
        if (dish.df) tags.push('DF');
        if (dish.vegan) tags.push('Vegan');

        // Capitalize each word in the dish name
        const titleCasedName = dish.name
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        const displayName = titleCasedName + (tags.length > 0 ? ` (${tags.join(', ')})` : '');

        const li = document.createElement('li');
        li.textContent = displayName;
        takenDishesList.appendChild(li);
    });
}



async function loadCategoryData() {
    try {
        const res = await fetch(ENDPOINT_URL);
        const data = await res.json(); // expects { categories: [...], entries: [...] }

        console.log(data);

        categoryButtonsContainer.innerHTML = '';
        allEntries = data.entries || [];

        data.categories.forEach(cat => {
            const ratio = cat.idealServings ? cat.currentServings / cat.idealServings : 0;
            const { text, color, bg } = getMessage(ratio);

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `w-full flex justify-between items-center px-4 py-2 rounded border ${bg} hover:bg-opacity-80`;
            btn.innerHTML = `
                <span class="font-medium">${cat.name}</span>
                <span class="text-sm ${color}">${text}</span>
            `;

            btn.addEventListener('click', () => {
                categoryHiddenInput.value = cat.name;

                const allButtons = categoryButtonsContainer.querySelectorAll('button');
                allButtons.forEach(b => b.classList.remove('ring', 'ring-blue-500'));
                btn.classList.add('ring', 'ring-blue-500');

                document.getElementById('dish').placeholder = `Your favorite ${cat.name.toLowerCase()}`;

                updateTakenDishesList(cat.name, data.categories);
            });

            categoryButtonsContainer.appendChild(btn);
        });

    } catch (err) {
        console.error('Failed to load categories:', err);
        categoryButtonsContainer.innerHTML = '<p class="text-red-600">Error loading categories</p>';
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!categoryHiddenInput.value) {
        statusDiv.textContent = 'Please select a category.';
        return;
    }

    const formData = new FormData(form);
    const payload = {
        timestamp: new Date().toISOString(),
        category: categoryHiddenInput.value,
        dish: formData.get('dish'),
        person: formData.get('person'),
        email: formData.get('email'),
        servings: parseInt(formData.get('servings')),
        gf: !!formData.get('gf'),
        df: !!formData.get('df'),
        vegan: !!formData.get('vegan')
    };

    try {
        const res = await fetch(ENDPOINT_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            }
        });

        if (res.ok) {
            document.getElementById('form-wrapper').style.display = 'none';
            statusDiv.textContent = '';

            // Create video container
            const videoContainer = document.createElement('div');
            videoContainer.style.position = 'fixed';
            videoContainer.style.top = '50%';
            videoContainer.style.left = '50%';
            videoContainer.style.zIndex = '1000';
            videoContainer.style.width = '10vw';
            videoContainer.style.maxWidth = '720px';
            videoContainer.style.aspectRatio = '16 / 9';
            videoContainer.style.transform = 'translate(-50%, -50%) rotate(-20deg)';
            videoContainer.innerHTML = `
                <iframe width="100%" height="100%" 
                    src="https://www.youtube.com/embed/IMoGdZLIRn8?autoplay=1&controls=1" 
                    title="YouTube video player" frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
                </iframe>
            `;

            // Create overlay container to hold GIF and text, positioned absolutely inside videoContainer
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = '50%';
            overlay.style.left = '50%';
            overlay.style.transform = 'translate(-50%, -50%)';
            overlay.style.zIndex = '1010';
            overlay.style.display = 'flex';
            overlay.style.flexDirection = 'column';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.pointerEvents = 'none'; // so clicks pass through

            // Create GIF element (centered)
            const gif = document.createElement('img');
            gif.src = 'images/explosion(noloop).gif'; // example GIF, replace as needed
            gif.style.width = '150px';
            gif.style.height = '150px';
            gif.style.marginBottom = '-20px';

            // Create the "Thank You!" text element
            const thankYouText = document.createElement('div');
            thankYouText.textContent = 'Thank You!';
            thankYouText.style.fontFamily = "'Press Start 2P', cursive, monospace"; // 8-bit pixel font style
            thankYouText.style.fontSize = '2rem';
            thankYouText.style.fontWeight = 'bold';
            thankYouText.style.userSelect = 'none';
            thankYouText.style.animation = 'rainbow 1s linear infinite';
            thankYouText.style.transition = 'opacity 1s ease';

            // Append gif and text to overlay, overlay to videoContainer
            overlay.appendChild(gif);
            overlay.appendChild(thankYouText);
            videoContainer.appendChild(overlay);

            document.body.appendChild(videoContainer);

            // Insert font link for 8-bit font if not already included
            if (!document.getElementById('pixel-font-link')) {
                const link = document.createElement('link');
                link.id = 'pixel-font-link';
                link.rel = 'stylesheet';
                link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
                document.head.appendChild(link);
            }

            // Define rainbow animation keyframes only once
            if (!document.getElementById('rainbow-style')) {
                const style = document.createElement('style');
                style.id = 'rainbow-style';
                style.textContent = `
                @keyframes rainbow {
                    0% { color: red; }
                    15% { color: orange; }
                    30% { color: yellow; }
                    45% { color: green; }
                    60% { color: blue; }
                    75% { color: indigo; }
                    90% { color: violet; }
                    100% { color: red; }
                }
                `;
                document.head.appendChild(style);
            }

            // Fade out the text after 2 seconds
            setTimeout(() => {
                thankYouText.style.opacity = '0';
            }, 3000);

            categoryHiddenInput.value = '';
            await loadCategoryData(); // Refresh categories + entries
        } else {
            statusDiv.textContent = 'Error submitting. Please try again.';
        }
    } catch (err) {
        console.error('Submit failed:', err);
        statusDiv.textContent = 'Network error. Try again later.';
    }
});



// Splash screen handling
let categoriesLoaded = false;
const splash = document.getElementById('splash-screen');
const splashBtn = document.getElementById('splash-ok-btn');

const originalLoadCategoryData = loadCategoryData;
loadCategoryData = async () => {
    await originalLoadCategoryData();
    categoriesLoaded = true;
};

splashBtn.addEventListener('click', async () => {
    splashBtn.disabled = true;
    splashBtn.textContent = 'Loading...';

    while (!categoriesLoaded) {
        await new Promise(res => setTimeout(res, 300));
    }

    splash.classList.add('opacity-0');
    setTimeout(() => splash.style.display = 'none', 500);
});

loadCategoryData();
