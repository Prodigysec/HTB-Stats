document.addEventListener('DOMContentLoaded', async function () {
    const header = document.querySelector('header.hero');
    const section = document.querySelector('section.features');
    const getStartedButton = document.querySelector('.hero-button');
    const footer = document.querySelector('.footer');

    // Perform API request asyncronously
    const fetchUsers = async () => {
        const users = [];
        let id = 300;

        const fetchPage = async (id) => {
            const response = await fetch(`https://www.hackthebox.com/api/v4/user/profile/basic/${id}`, {
                headers: {
                    Authorization: `Bearer ${window.env.YOUR_AUTH_TOKEN}`,
                },
            });
            const data = await response.json();
            return data;
        };

        while (users.length < 20) {
            const data = await fetchPage(id);
            if (data.message &&
                data.message.user_id &&
                data.message.user_id[0] === 'The selected user id is invalid.'
            ) {// Invalid user ID, skip and continue to the next page
                id++;
                continue;
            }
            users.push(data);
            id++;
        }
        return users;
    };

    const fetchDataPromise = fetchUsers();

    getStartedButton.addEventListener('click', async function (event) {
        event.preventDefault();

        const data = await fetchDataPromise;

        // Remove the header, section and footer
        header.remove();
        section.remove();
        footer.remove();

        displayData(data);

    });

    function displayData(data) {

    }
});
