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

        const tableRowTitles = ["Name", "Rank", "Points", "Give Respect"];
        for (let index = 0; index < 4; index++) {
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

                const dataGroup = [user.profile.name, user.profile.rank, user.profile.points]
                const userElement = document.createElement('tr');
                if (!user.profile.id || user.profile.id === undefined) {
                    return;

                } else {
                    for (let index = 0; index < 4; index++) {
                        const tableData = document.createElement('td');

                        if (index === 3) {
                            const imageCell = document.createElement('td');
                            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                            const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                            svgElement.setAttribute("viewBox", "0 0 2500 2500"); // Replace [width] and [height] with the desired dimensions
                            svgPath.setAttribute("d", "M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"); // Replace [path_data] with the SVG path data

                            svgElement.appendChild(svgPath);
                            imageCell.appendChild(svgElement);

                            // Create a counter element
                            const counterElement = document.createElement('span');
                            counterElement.textContent = '0'; // Initial counter value
                            counterElement.classList.add('counter');
                            imageCell.appendChild(counterElement);

                            // Increment the counter on SVG click event
                            svgElement.addEventListener('click', function () {
                                const currentCount = parseInt(counterElement.textContent);
                                const newCount = currentCount + 1;
                                counterElement.textContent = newCount;
                            });

                            userElement.appendChild(imageCell);

                        } else {
                            tableData.textContent = dataGroup[index];
                        }
                        userElement.appendChild(tableData);
                    }

                    userElement.classList.add('mem-id', user.profile.id);
                    chunkContainer.appendChild(userElement);
                }
            }));
            chunkContainer.style.display = 'block';
        }
        displayChunk(currentChunk, 20);

        // Create event listener for the "Home" button
        homeButton.addEventListener('click', function () {
            mainSection.remove();

            document.body.appendChild(header);
            document.body.appendChild(section);
            document.body.appendChild(footer);
        });
    }
});
