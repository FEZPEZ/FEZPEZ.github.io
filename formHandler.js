const form = document.getElementById('dish-form');
const statusDiv = document.getElementById('status');
const categoryButtonsContainer = document.getElementById('category-buttons');
const categoryHiddenInput = document.getElementById('category-hidden');

const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbz1zoU2bDG83YhjqooWrDr4DNgfAN3TvVQP6PAuOB8IvIifpgrOASmwyV05CrYi-qBb/exec';

// Map serving ratio to color/message
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

async function loadCategoryData() {
    try {
        const res = await fetch(ENDPOINT_URL);
        const data = await res.json(); // expects { categories: [...] }

        categoryButtonsContainer.innerHTML = '';

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
                // Set hidden field
                categoryHiddenInput.value = cat.name;

                // Visually mark the selected button
                const allButtons = categoryButtonsContainer.querySelectorAll('button');
                allButtons.forEach(b => b.classList.remove('ring', 'ring-blue-500'));
                btn.classList.add('ring', 'ring-blue-500');
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

    // If no category is selected
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
        gf: formData.get('gf') ? true : false,
        vegan: formData.get('vegan') ? true : false
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
            statusDiv.textContent = 'Submission successful! Thank you.';
            form.reset();
            categoryHiddenInput.value = '';
            await loadCategoryData(); // Refresh button UI
        } else {
            statusDiv.textContent = 'Error submitting. Please try again.';
        }
    } catch (err) {
        console.error('Submit failed:', err);
        statusDiv.textContent = 'Network error. Try again later.';
    }
});

loadCategoryData();
