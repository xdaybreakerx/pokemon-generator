document.getElementById("create-encounter").addEventListener("click", getAndDisplayPokemonData);
document.getElementById("create-team").addEventListener("click", getAndShowTeamData);

async function getPokemonData(){
	let pokemonApiUrlBase = "https://pokeapi.co/api/v2/pokemon/"

	let randomPokemonNumber = Math.floor(Math.random() * 1025) + 1;

	let fullApiUrl = pokemonApiUrlBase + randomPokemonNumber;

	let response = await fetch(fullApiUrl);
	let responseData = await response.json();
	let result = responseData;

	// let promiseResponse = await fetch(fullApiUrl).then(elephant => {
	// 	return elephant.json();
	// })
	// result = promiseResponse;
	return result;
}

async function putDataOnPage(dataToDisplay) {
    // Update the Pokémon name
    document.getElementsByClassName("pokemonName")[0].textContent = dataToDisplay.name;

    // Update the Type 1 display
    let type1Display = document.getElementsByClassName("pokemonType1")[0];
    type1Display.textContent = "Type 1: " + dataToDisplay.types[0].type.name;

    // Update the Type 2 display
    let type2Display = document.getElementsByClassName("pokemonType2")[0];
    if (dataToDisplay.types[1]) {
        // If the data includes a second type, set and display it
        type2Display.textContent = "Type 2: " + dataToDisplay.types[1].type.name;
        type2Display.style.display = ""; // Ensure the element is visible
    } else {
        // If no second type exists, clear and hide the Type 2 display
        type2Display.textContent = "";
        type2Display.style.display = "none"; // Hide the element
    }

    // Manage the Pokémon image display, including shiny chance
    let imageContainer = document.getElementsByClassName("pokemonImage")[0];
    let imageElement = imageContainer.getElementsByTagName("IMG")[0];
    let oddsUpperLimit = 4; // Testing/development odds - real odds are 1 in 8,192
    let shinyResult = Math.floor(Math.random() * oddsUpperLimit) + 1;
    if (shinyResult === 1) {
        imageElement.src = dataToDisplay.sprites.front_shiny;
        console.log("Shiny Pokemon found!");
    } else {
        imageElement.src = dataToDisplay.sprites.front_default;
    }

    let pokemonAudioElement = document.querySelector(".pokemonCry audio");
    if (!pokemonAudioElement) {
        console.error("Audio element not found!");
        return;
    }
    pokemonAudioElement.src = dataToDisplay.cries.latest;

    let pokemonAudioPlayButton = document.querySelector(".pokemonCry");
    if (pokemonAudioPlayButton) {
        pokemonAudioPlayButton.onclick = () => {
            pokemonAudioElement.play();
        };
    }
}

// Button calls this
async function getAndDisplayPokemonData(){
	let data = await getPokemonData();
	console.log(data);

	putDataOnPage(data);
}

// let pokemonButton = document.getElementById("create-encounter");
// pokemonButton.addEventListener("click", getAndDisplayPokemonData);


async function generateTeamData(){
	


	// let teamArray = [];
	// for (let index = 0; index < 6; index++) {
	// 	let data = await getPokemonData();
	// 	teamArray.push(data);		
	// }
	// teamArray = promiseAllResult;


	let promiseAllResult = await Promise.all([
		getPokemonData(),
		getPokemonData(),
		getPokemonData(),
		getPokemonData(),
		getPokemonData(),
		getPokemonData(),
	]);



	return promiseAllResult;
}

async function showTeamData(teamToDisplay) {
    let teamDisplaySection = document.getElementById("team-display");
    // Clear the existing content
    teamDisplaySection.innerHTML = "";

    teamToDisplay.forEach((pokemon) => {
        // Card container
        let card = document.createElement("div");
        card.className = "card w-full bg-base-100 shadow-xl flex flex-col"; // Using DaisyUI card and flex classes

        // Card content
        let cardContent = document.createElement("div");
        cardContent.className = "card-body flex-grow"; // Using DaisyUI card-body class

        // Pokemon image
        let imageElement = document.createElement("img");
        imageElement.className = "card-image h-48 object-cover w-full"; // Tailwind classes for the image
        imageElement.src = pokemon.sprites.front_default; // Add the source for the image
        cardContent.appendChild(imageElement);

        // Pokemon name and types
        let nameElement = document.createElement("h2");
        nameElement.className = "card-title"; // Using DaisyUI card-title class
        nameElement.textContent = pokemon.name;
        cardContent.appendChild(nameElement);

        let type1Element = document.createElement("div");
        type1Element.textContent = "Type 1: " + pokemon.types[0].type.name;
        cardContent.appendChild(type1Element);

        if (pokemon.types[1]) {
            let type2Element = document.createElement("div");
            type2Element.textContent = "Type 2: " + pokemon.types[1].type.name;
            cardContent.appendChild(type2Element);
        }

        card.appendChild(cardContent);

        // Card actions (button container)
        let cardActions = document.createElement("div");
        cardActions.className = "card-actions justify-end p-4"; // Using DaisyUI card-actions class

        // Play Sound button
        let playSoundButton = document.createElement("button");
        playSoundButton.textContent = "Play Pokémon Cry";
        playSoundButton.className = "btn btn-primary"; // Using DaisyUI button classes
        playSoundButton.onclick = function() {
            // Add functionality to play the Pokémon cry
            let audio = new Audio(pokemon.cries.latest); // Replace with the correct property if different
            audio.play();
        };

        cardActions.appendChild(playSoundButton);
        card.appendChild(cardActions);

        // Append the card to the team display section
        teamDisplaySection.appendChild(card);
    });
}



async function getAndShowTeamData(){
	let teamData = await generateTeamData();
	console.log(teamData);
	showTeamData(teamData);	
}



// Load a single Pokémon on page load
document.addEventListener('DOMContentLoaded', function() {
    getAndDisplayPokemonData();
    getAndShowTeamData();
});
