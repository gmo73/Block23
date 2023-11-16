const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2308-AAC-ET-WEB-PT";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${APIURL}/players`);
    const players = await response.json();
    console.log(players);
    return players;
  } catch (error) {
    console.error("Uh oh! Something went wrong!", error);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    console.log(`${APIURL}/players`);
    const response = await fetch(`${APIURL}/players/${playerId}`);
    console.log(`${APIURL}/players/${playerId}`);
    const playerInfo = await response.json();
    console.log(playerInfo);
    const playerPic = playerInfo.data.player.imageUrl;
    return playerPic;
  } catch (error) {
    console.error(`Uh oh! trouble fetching player #${playerId}!`, error);
  }
};

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${APIURL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });
    const newPlayer = await response.json();
    return newPlayer;
  } catch (error) {
    console.error(
      "Uh oh! Something went wrong with adding a new player!",
      error
    );
  }
};

const deletePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}players/${playerId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log("deleted", data);
  } catch (error) {
    console.error(
      `Uh oh! Something went wrong with deleting #${playerId} from roster!`,
      error
    );
  }
};

const renderAllPlayers = async (players) => {
  try {
    const response = await fetchAllPlayers();
    console.log(response.data.players);
    const playersContainer = document.getElementById("all-players-container");
    response.data.players.forEach((player) => {
      const playerCard = document.createElement("section");
      const playerName = JSON.stringify(player.name);
      playerCard.innerHTML = `<h1> Name: ${player.name}</h1> <p> Breed: ${player.breed}</p>`;
      playerCard.classList.add("player-card");

      const detsBtn = document.createElement("button");
      detsBtn.innerText = "Puppy Pic";
      detsBtn.addEventListener("click", async () => {
        const playerPic = await fetchSinglePlayer(player.id);
        const playerImg = document.createElement("img");
        playerImg.src = playerPic;
        playerCard.appendChild(playerImg);

        playerCard.removeChild(detsBtn);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Remove Puppy";
      deleteBtn.addEventListener("click", async () => {
        await removePlayer(player.id);
        playerContainer.removeChild(playerCard);
      });

      playerCard.appendChild(detsBtn);
      playerCard.appendChild(deleteBtn);

      playersContainer.appendChild(playerCard);
    });
    return players;
  } catch (error) {
    console.error(
      "Uh oh! Something went wrong with rendering all players!",
      error
    );
  }
};

const renderNewPlayerForm = () => {
  try {
    const newPlayerFormContainer = document.createElement("new-player-form");
    const form = document.createElement("form");

    form.innerHTML = `
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>
      <label for="breed">Breed:</label>
      <input type="text" id="breed" name="breed" required>
      <label for="imageUrl">Image URL:</label>
      <input type="url" name="imageUrl" id="imageUrl" required>
      <button type="submit">Add Puppy</button>`;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = document.getElementById("name").value;
      const breed = document.getElementById("breed").value;
      const imageUrl = document.getElementById("imageUrl").value;

      const newPlayer = { name, breed, imageUrl };
      await addNewPlayer(newPlayer);
      playerContainer.innerHTML = "";
      const updatedPlayers = await fetchAllPlayers();
      return renderAllPlayers(updatedPlayers);
    });
    newPlayerFormContainer.appendChild(form);
  } catch (error) {
    console.error(
      "Uh oh! Something went wrong with rendering the new player form!",
      error
    );
  }
};

const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);
  console.log(players);

  renderNewPlayerForm();
};
init();
