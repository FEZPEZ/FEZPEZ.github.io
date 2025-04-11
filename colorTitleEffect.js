const heading1 = document.getElementById('heading1'); // Select the first h2 by ID
const heading2 = document.getElementById('heading2'); // Select the second h2 by ID
const colors = ['lightblue', 'pink', 'yellow', 'lime', 'cyan', 'magenta', 'white'];
let index = 0;

setInterval(() => {
    heading1.style.color = colors[index]; // Apply color to the first heading
    heading2.style.color = colors[(index + 0) % colors.length]; // Apply color to the second heading
    index = (index + 1) % colors.length; // Cycle through colors
}, 500);
