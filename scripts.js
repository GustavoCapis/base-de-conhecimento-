const endpoint = "https://pokeapi.co/api/v2/pokemon?limit=10"; //API endpoint

//Fetch pokemon name and URL
async function getPokemonName() {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      console.log("Error");
      throw new Error(`HTTPS Error: ${res.status}`);
    }
    const data = await res.json();
    console.log(data);

    //Store Pokemon names
    const pokemonNames = data.results.map((pokemon) => pokemon.name); //return a string array with the names

    //Store Pokemon URLs to get the images
    const pokemonURL = data.results.map((pokemon) => pokemon.url);
    console.log(pokemonURL);

    //Callback function to update card title
    updateCardTitle(pokemonNames);

    //Return array in which each item is a promise
    const promises = pokemonURL.map((url) => getPokemonDetails(url));

    const allDetails = await Promise.all(promises);
    console.log(allDetails);
    updateCardImage(allDetails);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

getPokemonName();

//Get card title element and change it for the pokemon name
function updateCardTitle(pokemons) {
  const cardTitles = document.querySelectorAll(".card-title");
  pokemons.forEach((pokemon, index) => {
    if (cardTitles[index])
      cardTitles[index].textContent = pokemon.toUpperCase(); //the array is already string format so no need for .name after the pokemon
  });
}

//Update card image
function updateCardImage(images) {
  const cardImage = document.querySelectorAll(".card-img-top");
  cardImage.forEach((img, i) => {
    img.src = images[i].sprite;
  });
}

//Fetch each pokemon details
async function getPokemonDetails(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log("Error");
      throw new Error(`HTTPS Error: ${res.status}`);
    }

    const data = await res.json();
    //The JSON is really big so these are the only info we need right now
    return {
      name: data.name,
      sprite: data.sprites.front_default,
    };
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}
