document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header.hero');
    const section = document.querySelector('section.features');
    const getStartedButton = document.querySelector('.hero-button');
    const footer = document.querySelector('.footer');

    // Perform API request asyncronously

    // Fetch data on page load

    // Add eventlistener to button
    getStartedButton.addEventListener('click', function (event) {
        event.preventDefault();

        // Remove the header, section and footer
        header.remove();
        section.remove();
        footer.remove();
    });
});
