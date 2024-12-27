window.onload = function() {
    if (window.location.href.includes("index.html")) {
        alert("Welcome to the homepage!");
    }
}
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Thank you for your feedback!');
});
