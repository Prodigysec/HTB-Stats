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
        const mainSection = document.createElement('section');
        mainSection.classList.add('main-section');
        document.body.appendChild(mainSection);

        const headerSection = document.createElement('header');
        headerSection.classList.add('header-section');
        mainSection.appendChild(headerSection);

        const homeButton = document.createElement('button');
        homeButton.textContent = 'Home';
        headerSection.appendChild(homeButton);

        const compareButton = document.createElement('button');
        compareButton.textContent = 'Compare';
        headerSection.appendChild(compareButton);

        const resultsContainer = document.createElement('table');
        resultsContainer.id = 'resultsContainer';
        mainSection.appendChild(resultsContainer);

        const topThead = document.createElement('thead');
        resultsContainer.appendChild(topThead);

        const tableRow = document.createElement('tr');
        topThead.appendChild(tableRow)

        const tableRowTitles = ["Rank", "Name", "Points"];
        for (let index = 0; index < 3; index++) {
            const tableHeader = document.createElement('th');
            tableHeader.className = "text-center";
            tableHeader.textContent = tableRowTitles[index];
            tableRow.appendChild(tableHeader);
        }

        let currentChunk = 1;

        async function displayChunk(chunkIndex, chunkSize) {
            const startIndex = (chunkIndex - 1) * chunkSize;
            const chunkData = data.slice(startIndex, startIndex + chunkSize);

            const chunkContainer = document.createElement('tbody');
            resultsContainer.appendChild(chunkContainer);

            // Display the fetched data
            await Promise.all(chunkData.map(async function (user) {
                // console.log(user);

                const dataGroup = [user.profile.rank, user.profile.name, user.profile.points]
                const userElement = document.createElement('tr');
                if (!user.profile.id || user.profile.id === undefined) {
                    return;

                } else {
                    for (let index = 0; index < 3; index++) {
                        const tableData = document.createElement('td');
                        tableData.textContent = dataGroup[index];
                        userElement.appendChild(tableData);
                    }
                    userElement.classList.add('mem-id', user.profile.id);
                    chunkContainer.appendChild(userElement);
                }
            }));
            chunkContainer.style.display = 'block';
        }
        displayChunk(currentChunk, 20);
    }
});
