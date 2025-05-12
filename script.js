// List of card filenames
const cardFilenames = [
    'card1.png', 'card2.png', 'card3.png',
    'card4.png', 'card5.png', 'card6.png',
    'card7.png', 'card8.png', 'card9.png', 'card10.png'
];

const carousel = document.getElementById('carousel');
const grid = document.getElementById('grid');

let draggedItem = null;

// Initialize 3x3 grid
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.dataset.index = i;
    cell.addEventListener('dragover', (e) => e.preventDefault());
    cell.addEventListener('drop', onDropToGrid);
    grid.appendChild(cell);
}

// Load cards into carousel
cardFilenames.forEach(filename => {
    const img = document.createElement('img');
    img.src = `cards/${filename}`;
    img.className = 'card';
    img.draggable = true;
    img.addEventListener('dragstart', onDragStart);
    carousel.appendChild(img);
});

// Make the carousel sortable using Sortable.js
new Sortable(carousel, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    draggable: '.card',
    sort: true
});

// When drag starts
function onDragStart(e) {
    draggedItem = e.target;
}

// When dropped into a grid cell
function onDropToGrid(e) {
    e.preventDefault();
    if (!draggedItem) return;
    if (e.currentTarget.querySelector('img')) return; // cell already filled

    // Move the dragged item into the grid
    e.currentTarget.appendChild(draggedItem);

    // Adjust appearance
    draggedItem.className = ''; // remove .card styling
    draggedItem.style.width = '90%';
    draggedItem.style.height = '90%';
    draggedItem.style.margin = '0';
    draggedItem.draggable = false; // prevent dragging again
    draggedItem = null;
}

// In case the drag ends without proper drop
document.addEventListener('dragend', (e) => {
    draggedItem = null;
});

// Keyboard arrow scrolling
document.addEventListener('keydown', (e) => {
    const container = document.getElementById('carousel-container');
    if (e.key === 'ArrowRight') {
        container.scrollBy({ left: 100, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
        container.scrollBy({ left: -100, behavior: 'smooth' });
    }
});
