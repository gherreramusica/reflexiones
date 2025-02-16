document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.menu-button');
    const menu = document.querySelector('.menu');

    menuButton.addEventListener('click', function() {
        menu.classList.toggle('show');
    });

    window.addEventListener('click', function(event) {
        if (!menu.contains(event.target)) {
            menu.classList.remove('show');
        }
    });
});
