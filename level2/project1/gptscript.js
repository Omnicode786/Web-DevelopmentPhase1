let fetchedImages = [];

// Fetch Random Images
async function fetchRandomImages() {
    const fetchPromises = Array.from({ length: 1150 }, async (_, i) => {
        const response = `https://picsum.photos/200/150?random=${Math.random()}`;
        return {
            name: `Image ${i + 1}`,
            image: response
        };
    });

    // Wait for all fetches to complete
    fetchedImages = await Promise.all(fetchPromises);
    showCards(fetchedImages);
}

// Display Cards
function showCards(images) {
    let clutter = "";
    images.forEach(function (obj) {
        clutter += `
            <div class="box">
                <img class="cursor-pointer" src="${obj.image}" alt="${obj.name}">
                <div class="caption">${obj.name}</div>
            </div>`;
    });
    document.querySelector(".container").innerHTML = clutter;
}

// Ensure DOM is loaded before fetching images
document.addEventListener("DOMContentLoaded", () => {
    fetchRandomImages();
});