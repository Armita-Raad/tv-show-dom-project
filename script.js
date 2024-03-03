// function to fetch data from TV Maze
const searchShows = async (query) => {
  try {
    const response = await axios.get(
      `https://api.tvmaze.com/search/shows?q=${query}`
    );
    return response.data.map((result) => result.show);
  } catch (error) {
    console.log(error);
  }
};
// function for creating a movie card
const createMovieCard = (movie) => {
  const card = document.createElement("div");
  card.classList.add("card");

  const image = document.createElement("img");
  image.src = movie.image.medium;
  image.alt = movie.name;

  const title = document.createElement("p");
  title.textContent = movie.name;
  title.classList.add("title");

  const genres = document.createElement("p");
  genres.textContent = movie.genres.join(" | ");
  genres.classList.add("genres");

  const rating = document.createElement("p");
  rating.classList.add("rating");
  if (movie.rating.average !== null) {
    rating.textContent = movie.rating.average;
  } else {
    rating.textContent = "7.8";
  }

  card.append(image, title, genres, rating);
  card.dataset.showId = movie.id;
  //   click event listener
  card.addEventListener("click", async (event) => {
    const targetCard = event.target.closest(".card");
    if (targetCard) {
      const showId = targetCard.dataset.showId;
      window.location.href = `./episodes.html?seriesId=${showId}`;
    }
  });

  return card;
};

const handleSearch = async () => {
  const searchInput = document.querySelector('input[type="search"]');
  const query = searchInput.value.trim().toLowerCase();
  const cards = document.querySelector(".cards");
  if (query !== "") {
    const movies = await searchShows(query);

    cards.innerHTML = "";

    movies.slice(0, 12).forEach((movie) => {
      const card = createMovieCard(movie);
      cards.append(card);
    });
  } else {
    const showNames = [
      "Game of Thrones",
      "The Vampire Diaries",
      "Dark",
      "The nevers",
      "Sherlock",
      "Sopranos",
      "Planet Earth II",
      "True Detective",
      "Fresh Prince",
      "The wire",
      "Mythbusters",
      "Scrapheap Challenge",
    ];
    cards.innerHTML = "";
    for (const showName of showNames) {
      const movies = await searchShows(showName);
      if (movies.length > 0) {
        const card = createMovieCard(movies[0]);
        cards.append(card);
      }
    }
  }
};
document
  .querySelector('input[type="search"]')
  .addEventListener("input", handleSearch);
handleSearch();
